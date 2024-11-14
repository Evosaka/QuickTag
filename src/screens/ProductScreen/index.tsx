/***
 * TELA DE CADASTRO DE GRUPOS
 * TODO:
 *   --> Ajustar campos faltantes na retaguarda
 *   --> Criar cadastro de tipo de armazenamento na plataforma igual o grupo
 *   --> Verificar a relação do grupo ao parceiro
 *   --> Buscar os grupos
 *   --> Buscar o cadastro de unidades
 */

import React, { useEffect, useState, FormEvent, useCallback } from "react";
import { useMutation, useQuery } from "@apollo/client";
import * as XLSX from "xlsx";

import ComboBox from "@components/ComboBox";
import Input from "@components/Input";
import NavButton from "@components/NavButton";
import DynamicTable from "@components/DynamicTable";

import showNotification from "@utils/notifications";

import {
  ErrorType,
  requiredFieldsItem,
  Item,
  Group,
  Unidade,
  Armazenamento,
  TipoArmazenamentoByItem,
} from "@lib/types";
import { areAllErrorsEmpty, validateFields } from "@utils/functions";

import {
  GET_GRUPOS,
  GET_ITENS,
  GET_UNIDADES,
  UPSERT_ITENS,
  STATUS_ITEM,
  GET_LOCAL_ARMAZENAMENTO,
  GET_ARMAZENAMENTO_BY_PRODUTO,
  UPSERT_ARMAZENAMENTO_PRODUTO,
  GET_ARMAZENAMENTO,
} from "@lib/graphql/consts";

import { useAppContext } from "@lib/context/appContext";
import Button from "@src/components/button";
import { colors } from "@src/utils/theme";
import { sheetToJson } from "@src/utils/sheetToJson";
import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";

const initialValues: Item = {
  id: 0,
  name: "",
  description: "",
  grupoId: 0,
  categoriaId: 1,
  tipoId: 1,
  unidadeId: "",
  imgpath: "",
  marca: "",
  vlItem: 0,
  tpDisposicao: "NUMERICA",
  opcoes: "",
  status: "ATIVO",
  descArmazenamento: "",
  descFornecedor: "",
  sif: "",
  temSif: false,
  temLote: false,
  temFornecedor: false,
  temValidade: false,
  localArmazenamentoId: 0,
};

const initialValuesStorageType: TipoArmazenamentoByItem = {
  itemId: 0,
  armazenamentoId: 0,
  validMeses: 0,
  validDias: 0,
  validHoras: 0,
  status: "ATIVO",
};

//colunas da grade
const productColumns = [
  { name: "ID", key: "id" },
  { name: "PRODUTO", key: "name" },
  { name: "STATUS", key: "status" },
  { name: "UNIDADE", key: "unidadeId" },
  { name: "LOCAL ARMAZENAMENTO", key: "descArmazenamento" },
  { name: "SIF", key: "temSif" },
  { name: "TEM LOTE", key: "temLote" },
  { name: "TEM VALIDADE", key: "temValidade" },
  { name: "TEM FORNECEDOR", key: "temFornecedor" },
];

interface ProductProps {
  mode: string;
  dataEdit?: Item;
  refetchData?: () => void;
}

const ProductScreen = ({ mode, dataEdit, refetchData }: ProductProps) => {
  const [values, setValues] = useState<Item>({ ...initialValues });
  const [errors, setErrors] = useState<ErrorType<Item>>({});
  const [id, setId] = useState<number>(0);
  const [dbGrid, setDbGrid] = useState<Item[]>([]);
  const [groups, setGroups] = useState<{ value: number; caption: string }[]>(
    []
  );
  const [unidades, setUnidades] = useState<
    { value: number; caption: string }[]
  >([]);
  const [storageLocation, setStorageLocation] = useState<
    { value: number; caption: string }[]
  >([]);
  const [storageTypesBd, setStorageTypesBd] = useState<
    { value: number; caption: string }[]
  >([]);
  const [jsonSheetData, setJsonSheetData] = useState<Item[]>([]);
  const [checkedSif, setCheckedSif] = useState(false);
  const [checkedLote, setCheckedLote] = useState(false);
  const [checkedOriginalValidate, setCheckedOriginalValidate] = useState(false);
  const [checkedSupplier, setCheckedSupplier] = useState(false);
  const [qttStorageTypes, setQttStorageTypes] = useState(1);
  const [storageTypes, setStorageTypes] = useState<TipoArmazenamentoByItem[]>(
    []
  );

  const { setSpinMsg } = useAppContext();

  const { data: mainDB, refetch } = useQuery(GET_ITENS);

  const { data: dbArmazenamentoByProduct } = useQuery(
    GET_ARMAZENAMENTO_BY_PRODUTO,
    {
      variables: { itemId: id },
    }
  );

  const { data: dbGroups } = useQuery(GET_GRUPOS, {
    variables: { status: "ATIVO" },
  });

  const { data: dbUnidades } = useQuery(GET_UNIDADES, {
    variables: { status: "ATIVO" },
  });

  const { data: dbStorageLocation } = useQuery(GET_LOCAL_ARMAZENAMENTO);
  const { data: dbTipoArmazenamento } = useQuery(GET_ARMAZENAMENTO, {
    variables: { status: "ATIVO" },
  });

  const [upsertArmazenamentoProduto] = useMutation(
    UPSERT_ARMAZENAMENTO_PRODUTO,
    {
      onCompleted: (data) => {
        setSpinMsg("");
      },
      onError: (err) => {
        showNotification("Erro ao salvar!", "error");
        console.log("err: ", err);
      },
    }
  );

  const [upsert] = useMutation(UPSERT_ITENS, {
    onCompleted: (data) => {
      const { upsertErpItem: id } = data;
      if (id) {
        setId(id);
      }
      handleSubmitStorageTypes(data?.upsertErpItem.id);
      refetch();
      showNotification("Registro salvo com sucesso!", "success");
      setSpinMsg("");
    },
    onError: (err) => {
      setSpinMsg("");
      showNotification("Erro ao salvar!", "error");
      console.log("err: ", err);
    },
  });

  const [setStatus] = useMutation(STATUS_ITEM, {
    onCompleted: (data) => {
      refetch();
      setSpinMsg("");
    },
    onError: (err) => {
      setSpinMsg("");
      showNotification("Erro ao mudar status!", "error");
      console.log("err: ", err);
    },
  });

  const handleAddStorageType = () => {
    return setQttStorageTypes((prevState) => prevState + 1);
  };

  const handleRemoveStorageType = () => {
    setQttStorageTypes((prevState) => prevState - 1);
    setStorageTypes((prevStorageTypes) => {
      const newStorageTypes = [...prevStorageTypes];
      newStorageTypes.pop();
      return newStorageTypes;
    });
  };

  const onChangeFieldCollaborator = (
    value: any,
    field: keyof TipoArmazenamentoByItem,
    index: number
  ) => {
    setStorageTypes((prevStorageTypes) => {
      // Make a copy of the previous state
      const newStorageTypes = [...prevStorageTypes];

      if (!newStorageTypes[index]) {
        newStorageTypes[index] = initialValuesStorageType;
      }

      newStorageTypes[index] = {
        ...newStorageTypes[index],
        [field]: value,
      };

      return newStorageTypes;
    });
  };

  useEffect(() => {
    if (dataEdit) {
      setValues({ ...dataEdit });
    }
  }, [dataEdit]);

  useEffect(() => {
    if (id && dbArmazenamentoByProduct) {
      const storages = dbArmazenamentoByProduct?.getErpItemArmazenamento;
      if (storages?.length) {
        setQttStorageTypes(storages?.length || 0);
        setStorageTypes(storages);
      }
    }
  }, [id, dbArmazenamentoByProduct]);

  useEffect(() => {
    if (mainDB && mainDB.getErpItens && mainDB.getErpItens.length > 0) {
      setDbGrid([...mainDB.getErpItens]);
    }
  }, [mainDB]);

  useEffect(() => {
    setGroups([]);
    if (
      dbGroups &&
      dbGroups?.getGrupoItens &&
      dbGroups.getGrupoItens.length > 0
    ) {
      setGroups([
        ...dbGroups.getGrupoItens.map((ar: Group) => ({
          value: ar.id,
          caption: `${ar?.name}`,
        })),
      ]);
    }
  }, [dbGroups]);

  useEffect(() => {
    setStorageLocation([]);
    if (
      dbStorageLocation &&
      dbStorageLocation?.getLocalArmazenamento &&
      dbStorageLocation.getLocalArmazenamento.length > 0
    ) {
      setStorageLocation([
        ...dbStorageLocation.getLocalArmazenamento.map((ar: Armazenamento) => ({
          value: ar.id,
          caption: ar.name,
        })),
      ]);
    }
  }, [dbStorageLocation]);

  useEffect(() => {
    setStorageTypesBd([]);
    if (
      dbTipoArmazenamento &&
      dbTipoArmazenamento?.getArmazenamento &&
      dbTipoArmazenamento.getArmazenamento.length > 0
    ) {
      setStorageTypesBd([
        ...dbTipoArmazenamento.getArmazenamento.map((ar: Armazenamento) => ({
          value: ar.id,
          caption: ar.name,
        })),
      ]);
    }
  }, [dbTipoArmazenamento]);

  useEffect(() => {
    setUnidades([]);
    if (
      dbUnidades &&
      dbUnidades?.getErpUnidades &&
      dbUnidades.getErpUnidades.length > 0
    ) {
      setUnidades([
        ...dbUnidades.getErpUnidades.map((ar: Unidade) => ({
          value: ar.unidade,
          caption: ar.name,
        })),
      ]);
    }
  }, [dbUnidades]);

  useEffect(() => {
    if (values?.localArmazenamentoId) {
      const timeoutId = setTimeout(() => {
        const descArmazenamento = storageLocation?.find(
          (el) => el.value === values?.localArmazenamentoId
        )?.caption;

        descArmazenamento &&
          onChangeField(descArmazenamento, "descArmazenamento");
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [values?.localArmazenamentoId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      let saveErrors = {};

      saveErrors = {
        ...errors,
        ...validateFields(values, requiredFieldsItem),
      };

      if (!areAllErrorsEmpty(saveErrors)) {
        setErrors({ ...saveErrors });
        return;
      }

      values.temLote = checkedLote;
      values.temSif = checkedSif;
      values.temValidade = checkedOriginalValidate;
      values.temFornecedor = checkedSupplier;

      setSpinMsg("Gravando");

      const itemInput = { ...values };
      upsert({
        variables: {
          itemInput,
        },
      });
    } catch (err) {}
  };

  const onChangeField = (value: number | string, field: string) => {
    setValues({ ...values, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleDownloadExcel = () => {
    const data = [
      [
        "produto",
        "unidade",
        "grupo",
        "status",
        "fornecedor",
        "armazenamento",
        "marca",
        "observacao",
        "temSif",
        "temLote",
        "temValidade",
        "temFornecedor",
      ],
      [
        "nome do profuto",
        "KG, G",
        "nome do grupo",
        "ATIVO",
        "nome do fornecedor",
        "local de armazenamento",
        "nome da marca",
        "observacao",
        "S | N",
        "S | N",
        "S | N",
        "S | N",
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "Modelo_importacao_produtos.xlsx");
    showNotification("Modelo baixado com sucesso!", "success");
  };

  const handleFileUploadExcel = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target?.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const jsonData = sheetToJson(worksheet);

      const mappedData = jsonData.map((item: any) => {
        const findedGroupId =
          groups.find(
            (gp) =>
              gp.caption.replace(/\s+/g, "").toLowerCase() ===
              item.grupo.replace(/\s+/g, "").toLowerCase()
          )?.value || 0;
        return {
          id: 0,
          name: item?.produto ?? "PRODUTO SEM NOME",
          description: item?.observacao,
          grupoId: findedGroupId,
          categoriaId: 1,
          tipoId: 1,
          unidadeId: "UN",
          imgpath: "",
          marca: item?.marca ?? "",
          vlItem: 0,
          tpDisposicao: "NUMERICA",
          opcoes: "",
          status: item?.status ?? "ATIVO",
          descArmazenamento: item?.armazenamento,
          descFornecedor: item?.fornecedor,
          localArmazenamentoId: item.localArmazenamentoId ?? 0,
          temSif: item?.temSif === "s" || item?.temSif === "S" ? true : false,
          temLote:
            item?.temLote === "s" || item?.temLote === "S" ? true : false,
          temValidade:
            item?.temValidade === "s" || item?.temValidade === "S"
              ? true
              : false,
          temFornecedor:
            item?.temFornecedor === "s" || item?.temFornecedor === "S"
              ? true
              : false,
        };
      });

      setJsonSheetData(mappedData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleUpsertProducts = useCallback(async () => {
    if (jsonSheetData?.length) {
      for (let i = 0; i < jsonSheetData.length; i++) {
        const data = jsonSheetData[i];
        const itemInput = { ...data };

        try {
          await new Promise((resolve) => setTimeout(resolve, 100));
          await upsert({ variables: { itemInput } });
        } catch (error) {
          console.log(`Erro ao enviar a requisição ${i + 1}:`, error);
        }
      }
    }
  }, [jsonSheetData]);

  const handleSubmitStorageTypes = async (keyClientByRegister: number) => {
    if (storageTypes.length) {
      for (let i = 0; i < storageTypes.length; i++) {
        const storageType = storageTypes[i];
        if (!storageType.armazenamentoId) return;
        try {
          setSpinMsg("Gravando");

          const input = { ...storageType };

          input.itemId = keyClientByRegister;

          await new Promise((resolve) => setTimeout(resolve, 250)); // Espera 0.25 segundos

          await upsertArmazenamentoProduto({ variables: { input } });
        } catch (err) {
          console.error(err);
        }
      }
    }

    // router.reload();
  };

  const renderForm = () => (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex max-lg:flex-col justify-between py-1.5">
          <div className="lg:w-[38%]">
            <Input
              label="Produto"
              type="text"
              error={errors?.name}
              value={values.name}
              placeholder=""
              onChange={(e) => onChangeField(e.target.value, "name")}
            />
          </div>
          <div className="lg:w-[12%]">
            <ComboBox
              label="Unidade"
              data={[...unidades]}
              value={values.unidadeId}
              error={errors.unidadeId}
              placeholder="Unidade"
              onChange={(value) => onChangeField(value, "unidadeId")}
            />
          </div>
          <div className="lg:w-[26%]">
            <ComboBox
              label="Grupo"
              data={[...groups]}
              onChange={(value) => onChangeField(value, "grupoId")}
              error={errors.grupoId}
              value={values.grupoId}
            />
          </div>
          <div className="lg:w-[18%]">
            <Input
              label="Status"
              type="text"
              error={errors.status}
              value={values.status}
              disabled={true}
              onChange={(e) => onChangeField(e.target.value, "status")}
            />
          </div>
        </div>
        <div className="flex max-lg:flex-col justify-between py-1.5">
          <div className="lg:w-[40%]">
            <ComboBox
              label="Local de Armazenamento"
              data={[...storageLocation]}
              onChange={(value) => onChangeField(value, "localArmazenamentoId")}
              error={errors.localArmazenamentoId}
              value={values.localArmazenamentoId}
            />
          </div>
          <div className="lg:w-[50%] flex-column items-end  gap-4">
            <h2 className="p-1">Campos Obrigatórios?</h2>
            <div className="flex gap-4">
              <div>
                <input
                  type="checkbox"
                  className="shrink-0 border-gray-200 rounded "
                  checked={checkedSif}
                  onChange={() => setCheckedSif((prevState) => !prevState)}
                />
                <label
                  htmlFor="myCheckbox"
                  className="text-sm text-gray-500 ml-3 self-center"
                >
                  SIF
                </label>
              </div>
              <div>
                <input
                  type="checkbox"
                  className="shrink-0 border-gray-200 rounded "
                  checked={checkedOriginalValidate}
                  onChange={() =>
                    setCheckedOriginalValidate((prevState) => !prevState)
                  }
                />
                <label
                  htmlFor="myCheckbox"
                  className="text-sm text-gray-500 ml-3 self-center"
                >
                  Validade Original
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <div>
                <input
                  type="checkbox"
                  className="shrink-0 border-gray-200 rounded "
                  checked={checkedLote}
                  onChange={() => setCheckedLote((prevState) => !prevState)}
                />
                <label
                  htmlFor="myCheckbox"
                  className="text-sm text-gray-500 ml-3 self-center"
                >
                  Lote
                </label>
              </div>
              <div>
                <input
                  type="checkbox"
                  className="shrink-0 border-gray-200 rounded "
                  checked={checkedSupplier}
                  onChange={() => setCheckedSupplier((prevState) => !prevState)}
                />
                <label
                  htmlFor="myCheckbox"
                  className="text-sm text-gray-500 ml-3 self-center"
                >
                  Fornecedor
                </label>
              </div>
            </div>
          </div>
        </div>
        <span className="flex font-semibold py-4">
          Adicione os Tipos de Armazenamento:
        </span>
        {Array.from({ length: qttStorageTypes }, (_, index) => (
          <div
            key={index}
            className="flex max-lg:flex-col gap-6 justify-between p-4 border"
          >
            <div className="lg:w-[30%]">
              <ComboBox
                label="Tipo de Armazenamento"
                data={[...storageTypesBd]}
                onChange={(value) =>
                  onChangeFieldCollaborator(value, "armazenamentoId", index)
                }
                value={storageTypes[index]?.armazenamentoId}
                // error={errors.localArmazenamentoId}
              />
            </div>
            <div className="lg:w-[20%]">
              <Input
                label="Mêses"
                type="counter"
                placeholder="2"
                value={storageTypes[index]?.validMeses}
                onCounterChange={(newValue) => {
                  if (typeof newValue !== "number") return;
                  if (newValue > 0)
                    return onChangeFieldCollaborator(
                      newValue,
                      "validMeses",
                      index
                    );
                }}
              />
            </div>
            <div className="lg:w-[20%]">
              <Input
                label="Dias"
                type="counter"
                placeholder="10"
                value={storageTypes[index]?.validDias}
                onCounterChange={(newValue) => {
                  if (typeof newValue !== "number") return;
                  if (newValue > 0)
                    return onChangeFieldCollaborator(
                      newValue,
                      "validDias",
                      index
                    );
                }}
              />
            </div>
            <div className="lg:w-[20%]">
              <Input
                label="Horas"
                type="counter"
                placeholder="12"
                value={storageTypes[index]?.validHoras}
                onCounterChange={(newValue) => {
                  if (typeof newValue !== "number") return;
                  if (newValue > 0)
                    return onChangeFieldCollaborator(
                      newValue,
                      "validHoras",
                      index
                    );
                }}
              />
            </div>
            {index === 0 ? (
              <div className="lg:w-[12%] mt-8 text-center items-center">
                <button
                  onClick={handleAddStorageType}
                  className="bg-sky-600 h-10 w-full rounded-[5px] p-2  flex  items-center justify-center"
                >
                  <PlusIcon className="h-8 w-8 text-white" />
                </button>
              </div>
            ) : (
              <div className="lg:w-[12%] mt-8 text-center items-center">
                <button
                  onClick={handleRemoveStorageType}
                  className="bg-sky-600 h-10 w-full rounded-[5px] p-2  flex  items-center justify-center"
                >
                  <TrashIcon className="h-6 w-6 text-white" />
                </button>
              </div>
            )}
          </div>
        ))}
        <div className="flex max-lg:flex-col justify-end py-1.5">
          <div className="w-full max-lg:pt-5 lg:self-end lg:w-[16%]">
            <NavButton
              label={id > 0 ? "Salvar Edição" : "Cadastrar"}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </form>
      <h3 className="font-semibold text-xl pt-2 pb-2">
        Cadastro de produtos em massa
      </h3>
      <div className="p-2 gap-8 flex items-center justify-between max-lg:flex-col max-lg: min-w-full">
        <Button
          backgroundColor={colors.primary}
          color={colors.secondary}
          icon="table-cells"
          onClick={handleDownloadExcel}
        >
          BAIXAR MODELO
        </Button>
        <Button>
          <input type="file" accept=".xlsx" onChange={handleFileUploadExcel} />
        </Button>
        <Button
          icon="document-text"
          backgroundColor={colors.primary}
          color={colors.secondary}
          disabled={!jsonSheetData?.length}
          onClick={handleUpsertProducts}
        >
          IMPORTAR PRODUTOS
        </Button>
      </div>
      <div className="pt-5">
        <DynamicTable
          label="Produtos Cadastrados"
          data={dbGrid}
          columns={productColumns}
          hasDelete
          hasEdit
          onDelete={(record: Item) => {
            const { id, status } = record;
            const newStatus = status === "ATIVO" ? "CANCELADO" : "ATIVO";
            setStatus({
              variables: {
                id,
                status: newStatus,
              },
            });
          }}
          onEdit={(record: Item) => {
            setValues({ ...record });
            const { id } = record;
            setId(id);
          }}
        />
      </div>
    </>
  );

  return renderForm();
};

export default ProductScreen;
