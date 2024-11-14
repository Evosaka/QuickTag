/***
 * TELA DE CADASTRO DE MODELOS
 * TODO:
 *   --> Ajustar campos faltantes na retaguarda
 *   --> Criar cadastro de tipo de armazenamento na plataforma igual o grupo
 *   --> Verificar a relação do grupo ao parceiro
 *   --> Buscar os grupos
 *   --> Buscar o cadastro de unidades
 */

import React, { useEffect, useState, FormEvent } from "react";
import { useMutation, useQuery } from "@apollo/client";

import Button from "@src/components/button";
import ComboBox from "@components/ComboBox";
import Input from "@components/Input";
import NavButton from "@components/NavButton";
import DynamicTable from "@components/DynamicTable";
import { Title } from "@components/styled";

import showNotification from "@utils/notifications";

import {
  Campo,
  ErrorType,
  Group,
  Item,
  requiredFieldsTagModel,
  TagModel,
} from "@lib/types";
import { areAllErrorsEmpty, validateFields } from "@utils/functions";

import {
  GET_CAMPOS,
  GET_ETIQUETA_MODELOS,
  GET_GRUPOS,
  GET_ITENS,
  STATUS_ETIQUETA_MODELOS,
  UPSERT_ETIQUETA_MODELOS,
} from "@lib/graphql/consts";

const initialValues: TagModel = {
  id: 0,
  name: "",
  modeloId: undefined,
  grupoId: undefined,
  itemId: undefined,
  descModelo: "",
  status: "ATIVO",
};

import { useAppContext } from "@lib/context/appContext";

//colunas da grade
const tagModelColumns = [
  { name: "ID", key: "id" },
  { name: "MODELO", key: "name" },
  { name: "GRUPO", key: "descGrupo" },
  { name: "PRODUTO", key: "descProduto" },
  { name: "STATUS", key: "status" },
];

interface TagModelProps {
  mode: string;
  dataEdit?: TagModel;
  refetchData?: () => void;
}

const TagModelScreen = ({ mode, dataEdit, refetchData }: TagModelProps) => {
  const [values, setValues] = useState<TagModel>({ ...initialValues });
  const [errors, setErrors] = useState<ErrorType<TagModel>>({});
  const [id, setId] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("tab1");
  const [dbGrid, setDbGrid] = useState<TagModel[]>([]);
  const [campos, setCampos] = useState<Campo[]>([]);
  const [groups, setGroups] = useState<{ value: number; caption: string }[]>(
    []
  );
  const [itens, setItens] = useState<{ value: number; caption: string }[]>([]);
  const [modelos, setModelos] = useState<{ value: number; caption: string }[]>(
    []
  );
  const { setSpinMsg } = useAppContext();

  const { data: mainDB, refetch } = useQuery(GET_ETIQUETA_MODELOS);

  const { data: dbCampos } = useQuery(GET_CAMPOS);

  const { data: dbGroups } = useQuery(GET_GRUPOS, {
    variables: { status: "ATIVO" },
  });

  const { data: dbItens } = useQuery(GET_ITENS, {
    variables: { status: "ATIVO" },
  });

  const { data: dbModelos } = useQuery(GET_ETIQUETA_MODELOS, {
    variables: { status: "ATIVO" },
  });

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const [setStatus] = useMutation(STATUS_ETIQUETA_MODELOS, {
    onCompleted: (data) => {
      showNotification("Status ajustado!", "success");
      refetch();
      setSpinMsg("");
    },
    onError: (err) => {
      setSpinMsg("");
      showNotification("Erro ao mudar status!", "error");
      console.log("err: ", err);
    },
  });

  const [upsert] = useMutation(UPSERT_ETIQUETA_MODELOS, {
    onCompleted: (data) => {
      const { upsertErpEtiquetaModelo: id } = data;
      if (id) {
        setId(id);
      }
      setSpinMsg("");
      showNotification("Registro salvo com sucesso!", "success");
      setActiveTab("tab1");
      refetch();
    },
    onError: (err) => {
      setSpinMsg("");
      showNotification("Erro ao salvar!", "error");
      console.log("err: ", err);
    },
  });

  useEffect(() => {
    if (dataEdit) setValues({ ...dataEdit });
  }, [dataEdit]);

  useEffect(() => {
    if (
      mainDB &&
      mainDB.getErpEtiquetaModelo &&
      mainDB.getErpEtiquetaModelo.length > 0
    ) {
      setDbGrid([...mainDB.getErpEtiquetaModelo]);
    }
  }, [mainDB]);

  useEffect(() => {
    setCampos([]);
    if (
      dbCampos &&
      dbCampos?.getErpEtiquetaCampos &&
      dbCampos.getErpEtiquetaCampos.length > 0
    ) {
      setCampos([...dbCampos.getErpEtiquetaCampos]);
    }
  }, [dbCampos]);

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
          caption: ar.name,
        })),
      ]);
    }
  }, [dbGroups]);

  useEffect(() => {
    setItens([]);
    if (dbItens && dbItens?.getErpItens && dbItens.getErpItens.length > 0) {
      setItens([
        ...dbItens.getErpItens.map((ar: Item) => ({
          value: ar.id,
          caption: ar.name,
        })),
      ]);
    }
  }, [dbItens]);

  useEffect(() => {
    setModelos([]);
    if (
      dbModelos &&
      dbModelos?.getErpEtiquetaModelo &&
      dbModelos.getErpEtiquetaModelo.length > 0
    ) {
      setModelos([
        ...dbModelos.getErpEtiquetaModelo.map((ar: Item) => ({
          value: ar.id,
          caption: ar.name,
        })),
      ]);
    }
  }, [dbModelos]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      let saveErrors = {};

      saveErrors = {
        ...errors,
        ...validateFields(values, requiredFieldsTagModel),
      };

      if (!areAllErrorsEmpty(saveErrors)) {
        setErrors({ ...saveErrors });
        return;
      }

      setSpinMsg("Gravando");

      const modeloInput = { ...values };

      upsert({
        variables: {
          modeloInput,
        },
      });
    } catch (err) {}
  };

  const onChangeField = (value: any, field: string) => {
    setValues({ ...values, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        // Você pode adicionar alguma notificação de sucesso aqui, se desejar
        console.log("Texto copiado para a área de transferência");
      },
      (err) => {
        console.error("Erro ao copiar texto: ", err);
      }
    );
  };

  const renderForm = () => (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex max-lg:flex-col justify-between py-1.5">
          <div className="lg:w-[48%]">
            <Input
              label="Nome do Modelo"
              type="text"
              error={errors?.name}
              placeholder=""
              onChange={(e) => onChangeField(e.target.value, "name")}
              value={values.name}
            />
          </div>
          <div className="lg:w-[30%]">
            <ComboBox
              label="Modelo Base"
              placeholder="Base "
              disabled={id > 0}
              data={[...modelos]}
              onChange={(value) => onChangeField(value, "modeloId")}
              value={values.modeloId}
            />
          </div>
          <div className="lg:w-[18%]">
            <Input
              label="Status"
              type="text"
              error={errors.status}
              placeholder="ATIVO"
              onChange={(e) => onChangeField(e.target.value, "status")}
              value={values.status}
            />
          </div>
        </div>
        <div className="flex max-lg:flex-col justify-between py-1.5">
          <div className="lg:w-[30%]">
            <ComboBox
              label="Grupo"
              data={[...groups]}
              onChange={(value) => onChangeField(value, "grupoId")}
              error={errors.grupoId}
              value={values.grupoId}
            />
          </div>
          <div className="lg:w-[68%]">
            <ComboBox
              label="Produto"
              data={[...itens]}
              onChange={(value) => onChangeField(value, "itemId")}
              value={values.itemId}
            />
          </div>
        </div>
        <div className="flex max-lg:flex-col justify-between items-start py-1.5 gap-x-5">
          <div className="w-full max-lg:pt-5  lg:w-[30%] min-h-[200px]">
            {/* Exemplo de altura mínima */}
            <Input
              label="Modelo"
              type="richedit"
              error={errors?.descModelo}
              placeholder=""
              onChange={(e) => {
                console.log("e(rich): ", e);
                onChangeField(e.target.value, "descModelo");
              }}
              value={values.descModelo}
            />
          </div>
          <div className="w-full max-lg:pt-5 lg:w-[65%] min-h-[350px]">
            {/* Exemplo de altura mínima */}
            <Title className="input-label text-base text-slate-600 font-medium">
              {"Campos disponíveis para a etiqueta"}
            </Title>
            <div className="flex flex-wrap mt-3 gap-3">
              {campos.map((field, index) => (
                <Button
                  key={`btn-${index}`}
                  mode="outline"
                  onClick={() => copyToClipboard(`[${field.alias}]`)}
                  title={field.description}
                >
                  {field.alias}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end py-1.5">
          <div className="w-full max-lg:pt-5 lg:w-[16%]">
            <NavButton
              label={id > 0 ? "Salvar Edição" : "Cadastrar"}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </form>
    </>
  );

  return (
    <>
      <nav className="flex mt-5 space-x-2" aria-label="Tabs" role="tablist">
        <button
          type="button"
          className={`py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium text-center rounded-lg ${
            activeTab === "tab1"
              ? "bg-gray-700 text-white hover:bg-gray-300"
              : "text-gray-500 hover:bg-gray-200"
          }`}
          onClick={() => handleTabClick("tab1")}
        >
          Modelos Cadastrados
        </button>
        <button
          type="button"
          className={`py-3 px-4 inline-flex items-center gap-x-2  text-sm font-medium text-center rounded-lg ${
            activeTab === "tab2"
              ? "bg-gray-700 text-white hover:bg-gray-300"
              : "text-gray-500 hover:bg-gray-200"
          }`}
          onClick={() => handleTabClick("tab2")}
        >
          Lançamento
        </button>
      </nav>

      <div className="mt-3">
        {activeTab === "tab1" && (
          <div className="pt-5">
            <DynamicTable
              label="Modelos Cadastrados"
              data={dbGrid}
              columns={tagModelColumns}
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
              onEdit={(record: TagModel) => {
                //@ts-ignore
                const { descModeloBase, descGrupo, descItem, ...restRecord } =
                  record;
                setValues({ ...restRecord });
                const { id } = record;
                setId(id);
                setActiveTab("tab2");
              }}
            />
          </div>
        )}
        {activeTab === "tab2" && <div className="pt-5">{renderForm()}</div>}
      </div>
    </>
  );
};

export default TagModelScreen;
