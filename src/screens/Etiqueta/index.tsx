/***
 * TELA DE CADASTRO DE MODELOS
 * TODO:
 *   --> Trazer modelo de sugestão com base no grupo e produto selecionado
 *   --> Trazer unidade do produto
 *   --> Ajustar campos de data componente e valor default
 *   -->
 *   -->
 */

import React, {
  useEffect,
  useState,
  FormEvent,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useMutation, useQuery } from "@apollo/client";
import Cookies from "js-cookie";

import Button from "@src/components/button";
import ComboBox from "@components/ComboBox";
import Icon from "@utils/Icons";
import Input from "@components/Input";
import { Title } from "@components/styled";
import { colors } from "@utils/theme";
import {
  convertDateFormat,
  isValidDate,
  isValidNumber,
  isValidTime,
  maskedValue,
} from "@utils/functions";

import showNotification from "@utils/notifications";

import {
  CadastroUser,
  ErrorType,
  Group,
  Item,
  LoggedUser,
  requiredFieldsEtiqueta,
  Etiqueta,
  Unidade,
  Armazenamento,
  Fornecedor,
  TipoArmazenamentoByItem,
} from "@lib/types";
import { areAllErrorsEmpty, retNumber, validateFields } from "@utils/functions";
import { useAppContext } from "@lib/context/appContext";
import ConfirmAlert from "@src/components/ConfirmAlert";
import TagModelToPrint from "@src/components/TagModelToPrint/TagModelToPrint";

import {
  GET_ARMAZENAMENTO,
  GET_ARMAZENAMENTO_BY_PRODUTO,
  GET_CADASTRO_FORNECEDOR,
  GET_CADASTRO_USER,
  GET_ETIQUETA_MODELOS,
  GET_GRUPOS,
  GET_ITENS,
  GET_LOCAL_ARMAZENAMENTO,
  GET_UNIDADES,
  UPSERT_ETIQUETA,
} from "@lib/graphql/consts";
import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";
import { generateShortId } from "@src/utils/generateId";

const initialValues: Etiqueta = {
  cadastroId: 0,
  id: 0,
  remessaId: "",
  login: "",
  grupoId: undefined,
  itemId: 0,
  modeloId: 1,
  qtProduto: 0,
  unidade: undefined,
  lote: "",
  sif: "",
  dtManipulacao: "",
  hrManipulacao: "",
  dtValidade: "",
  hrValidade: "",
  descFornecedor: "",
  descArmazenamento: "",
  dtValidadeOriginal: "",
  armazenamentoId: 0,
  descTipoArmazenamento: "",
  codBarras: "",
  html: "<p>teste</p>",
  status: "ATIVO",
};

interface EtiquetaProps {
  mode: string;
  dataEdit?: Etiqueta;
  refetchData?: () => void;
}

interface NameUser {
  login: string;
  name: string;
}

interface Products extends Item {
  value: number;
  caption: string;
}

interface Groups extends Group {
  value: number;
  caption: string;
}

interface StorageTypes extends TipoArmazenamentoByItem {
  value: number;
  caption: string;
}

const EtiquetaScreen = ({ mode, dataEdit, refetchData }: EtiquetaProps) => {
  const [values, setValues] = useState<Etiqueta>({ ...initialValues });
  const [errors, setErrors] = useState<ErrorType<Etiqueta>>({});
  const [cadastroId, setCadastroId] = useState<number>(0);
  const [loggedUser, setLoggedUser] = useState<LoggedUser>();
  const [names, setNames] = useState<NameUser[]>([]);
  const [qtEtiquetas, setQtEtiquetas] = useState<number>(1);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [groups, setGroups] = useState<Groups[]>([]);
  const [tipoArmazenamento, setTipoArmazenamento] = useState<StorageTypes[]>(
    []
  );

  const printComponentRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Products[]>([]);
  const [unidades, setUnidades] = useState<
    { value: number; caption: string }[]
  >([]);
  const [storageLocations, setStorageLocations] = useState<
    { value: number; caption: string }[]
  >([]);

  const [suppliers, setSuppliers] = useState<
    { value: number; caption: string }[]
  >([]);

  const { setSpinMsg, setActNewRecord } = useAppContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const [upsert] = useMutation(UPSERT_ETIQUETA, {
    onCompleted: (data) => {
      showNotification("Registro salvo com sucesso!", "success");
      setValues({ ...initialValues, cadastroId });
      setSpinMsg("");
    },
    onError: (err) => {
      setSpinMsg("");
      showNotification("Erro ao salvar!", "error");
      console.log("err: ", err);
    },
  });

  const { data: dbGroups } = useQuery(GET_GRUPOS, {
    variables: { status: "ATIVO" },
  });

  const { data: dbItens } = useQuery(GET_ITENS, {
    variables: { status: "ATIVO" },
  });

  const { data: dbArmazenamento } = useQuery(GET_ARMAZENAMENTO, {
    variables: { status: "ATIVO" },
  });

  const { data: dbArmazenamentoByProduct } = useQuery(
    GET_ARMAZENAMENTO_BY_PRODUTO,
    {
      variables: { itemId: values?.itemId },
    }
  );

  const { data: dbUnidades } = useQuery(GET_UNIDADES, {
    variables: { status: "ATIVO" },
  });

  const { data: dbLocalArmazenamento } = useQuery(GET_LOCAL_ARMAZENAMENTO, {
    variables: { status: "ATIVO" },
  });

  const { data: dbUsers } = useQuery(GET_CADASTRO_USER, {
    variables: { cadastroId },
  });

  const { data: dbFornecedores } = useQuery(GET_CADASTRO_FORNECEDOR, {
    variables: { status: "ATIVO", ehFornecedor: true },
  });

  const productSelected: Item = useMemo(() => {
    if (values?.itemId) {
      const actualProduct = dbItens.getErpItens.find(
        (p: any) => p.id === values?.itemId
      );

      return actualProduct;
    }

    return {};
  }, [values?.itemId]);

  useEffect(() => {
    if (dataEdit) setValues({ ...dataEdit });
  }, [dataEdit]);

  useEffect(() => {
    const getUser = Cookies.get("user");
    if (getUser) {
      setLoggedUser(JSON.parse(getUser));
    }
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setActNewRecord(() => {
      setValues({ ...initialValues, cadastroId });
      if (inputRef?.current) {
        inputRef.current.focus();
      }
    });
  }, [setActNewRecord]);

  useEffect(() => {
    if (loggedUser) {
      const { erpCadastroUser, login } = loggedUser;
      if (erpCadastroUser && erpCadastroUser.length > 0) {
        const { cadastroId: cadId } = erpCadastroUser[0];
        setCadastroId(cadId);
        setValues({ ...values, cadastroId: cadId, login: login });
      }
    }
  }, [loggedUser]);

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
          ...ar,
        })),
      ]);
    }
  }, [dbGroups]);

  useEffect(() => {
    setSuppliers([]);
    if (
      dbFornecedores &&
      dbFornecedores?.getCadastro &&
      dbFornecedores.getCadastro.length > 0
    ) {
      setSuppliers([
        ...dbFornecedores?.getCadastro.map((ar: Fornecedor) => ({
          value: ar.id,
          caption: ar.fantasia,
        })),
      ]);
    }
  }, [dbFornecedores]);

  // Local Armazenamento
  useEffect(() => {
    setStorageLocations([]);
    if (dbLocalArmazenamento?.getLocalArmazenamento?.length > 0) {
      setStorageLocations([
        ...dbLocalArmazenamento.getLocalArmazenamento.map(
          (ar: Armazenamento) => ({
            value: ar.id,
            caption: ar.name,
          })
        ),
      ]);
    }
  }, [dbLocalArmazenamento]);

  useEffect(() => {
    setProducts([]);
    if (dbItens && dbItens?.getErpItens && dbItens.getErpItens.length > 0) {
      setProducts([
        ...dbItens.getErpItens.map((ar: Item) => ({
          value: ar.id,
          caption: ar.name,
          ...ar,
        })),
      ]);
    }
  }, [dbItens]);

  useEffect(() => {
    setTipoArmazenamento([]);
    if (
      dbArmazenamentoByProduct &&
      dbArmazenamentoByProduct?.getErpItemArmazenamento &&
      dbArmazenamentoByProduct.getErpItemArmazenamento.length > 0 &&
      values?.itemId
    ) {
      setTipoArmazenamento([
        ...dbArmazenamentoByProduct.getErpItemArmazenamento.map(
          (ar: TipoArmazenamentoByItem) => ({
            value: ar?.armazenamento?.id,
            caption: ar?.armazenamento?.name,
            ...ar,
          })
        ),
      ]);
    }
  }, [dbArmazenamentoByProduct, values?.itemId]);

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
    setNames([]);
    if (
      dbUsers &&
      dbUsers?.getCadastroUser &&
      dbUsers.getCadastroUser.length > 0
    ) {
      setNames([
        ...dbUsers.getCadastroUser
          .filter((user: CadastroUser) => user.login != loggedUser?.login)
          .map((c: CadastroUser) => ({
            login: c.login,
            name: c.user.name,
          })),
      ]);
    }
  }, [dbUsers, loggedUser]);

  const handlePrint = useReactToPrint({
    content: () => printComponentRef.current,
  });

  const handleUpsertTag = useCallback(() => {
    setSpinMsg("Gravando");
    const etiquetaInput = { ...values };
    //ajuste das formatações
    etiquetaInput.qtProduto = retNumber(values.qtProduto.toString());
    etiquetaInput.dtImpressao = dateToPrint;
    etiquetaInput.hrImpressao = hourToPrint;
    etiquetaInput.dtManipulacao = etiquetaInput.dtManipulacao
      ? convertDateFormat(etiquetaInput.dtManipulacao)
      : undefined;
    etiquetaInput.dtValidade = etiquetaInput.dtValidade
      ? convertDateFormat(etiquetaInput.dtValidade)
      : dayjs().format("YYYY-MM-DD");
    etiquetaInput.dtValidadeOriginal = etiquetaInput.dtValidadeOriginal
      ? convertDateFormat(etiquetaInput.dtValidadeOriginal)
      : dayjs().format("YYYY-MM-DD");

    upsert({
      variables: {
        qtEtiquetas,
        etiquetaInput,
      },
    });
  }, [values]);

  const getDateToPrint = () => {
    const dateToPrint = dayjs().format("YYYY-MM-DD");
    const hourToPrint = dayjs().format("HH:mm:ss");

    return [dateToPrint, hourToPrint];
  };

  const idForTag = useMemo(() => {
    return generateShortId();
  }, []);

  const [dateToPrint, hourToPrint] = getDateToPrint();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let saveErrors = {};

      saveErrors = {
        ...errors,
        ...validateFields(
          values,
          requiredFieldsEtiqueta(
            productSelected?.temSif,
            productSelected?.temLote,
            productSelected?.temValidade,
            productSelected?.temFornecedor
          )
        ),
      };
      if (!areAllErrorsEmpty(saveErrors)) {
        setErrors({ ...saveErrors });
        return;
      }

      if (values.dtManipulacao) {
        if (!isValidDate(values.dtManipulacao)) {
          setErrors({ ...saveErrors, dtManipulacao: "Data Inválida!" });
          return;
        }
      }

      if (values.dtValidade) {
        if (!isValidDate(values.dtValidade)) {
          setErrors({ ...saveErrors, dtValidade: "Data Inválida!" });
          return;
        }
      }

      if (values.hrManipulacao) {
        if (!isValidTime(values.hrManipulacao)) {
          setErrors({ ...saveErrors, hrManipulacao: "Hora Inválida!" });
          return;
        }
      }

      // if (values.hrValidade) {
      //   if (!isValidTime(values.hrValidade)) {
      //     setErrors({ ...saveErrors, hrValidade: "Hora Inválida!" });
      //     return;
      //   }
      // }

      if (values.qtProduto) {
        if (!isValidNumber(values.qtProduto.toString())) {
          setErrors({ ...saveErrors, qtProduto: "Qtde Inválida!" });
          return;
        }
      }

      if (!(qtEtiquetas > 0)) {
        showNotification(
          "Você deve informar a quantidade de etiquetas!",
          "error"
        );
        return;
      }

      setIsPrintModalOpen(true);
    } catch (err) {}
  };

  const onChangeField = (value: any, field: string) => {
    setValues({ ...values, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  useEffect(() => {
    if (names.length) {
      setValues({ ...values, login: names[0].login });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [names]);

  useEffect(() => {
    if (
      !values?.dtManipulacao &&
      !values?.hrManipulacao &&
      !values.dtValidadeOriginal &&
      cadastroId
    ) {
      setValues({
        ...values,
        cadastroId: cadastroId,
        ["dtManipulacao"]: dayjs().format("DD/MM/YYYY"),
        ["hrManipulacao"]: dayjs().format("HH:mm"),
        ["dtValidadeOriginal"]: dayjs().format("DD/MM/YYYY"),
      });
      setErrors({ ...errors, ["dtManipulacao"]: "", ["hrManipulacao"]: "" });
    }
  }, [values, cadastroId]);

  useEffect(() => {
    if (values?.armazenamentoId && cadastroId && tipoArmazenamento) {
      const storageTypeSelected = tipoArmazenamento?.find(
        (tp) => tp.value === (values.armazenamentoId as number)
      );

      storageTypeSelected &&
        setValues({
          ...values,
          cadastroId: cadastroId,
          ["dtValidade"]: dayjs()
            .add(storageTypeSelected?.validMeses ?? 0, "month")
            .add(storageTypeSelected?.validDias ?? 0, "day")
            .format("DD/MM/YYYY"),
          ["hrValidade"]: dayjs()
            .add(storageTypeSelected?.validHoras ?? 0, "hour")
            .format("HH:mm"),
        });
      setErrors({ ...errors, ["dtValidade"]: "", ["hrValidade"]: "" });
    }
  }, [values.armazenamentoId, cadastroId, tipoArmazenamento]);

  useEffect(() => {
    const tagId = `#${idForTag}-${qtEtiquetas}`;
    onChangeField(tagId, "remessaId");
  }, [qtEtiquetas, idForTag]);

  const generateCopies = () => {
    const copies = [];
    for (let i = 0; i < qtEtiquetas; i++) {
      copies.push(
        <TagModelToPrint
          values={values}
          names={names}
          products={products}
          qtEtiquetas={qtEtiquetas}
        />
      );
    }
    return copies;
  };

  const renderForm = () => (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col justify-between w-full p-5">
          <div className="flex flex-col gap-2">
            <h1 className="input-label text-base text-slate-600 font-medium">
              Selecione seu nome
            </h1>
            <div className="flex gap-4">
              {names?.map((item, index) => (
                <div
                  key={index}
                  className={`py-3 px-5 rounded-lg shadow-sm text-sm text-center whitespace-nowrap cursor-pointer ${
                    values.login === item.login
                      ? "bg-blue-800 text-white border-2 border-blue-400"
                      : "bg-zinc-100 text-gray-500"
                  }`}
                  onClick={() => setValues({ ...values, login: item.login })}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>

          <div className="flex max-lg:flex-col xs:w-[100%] lg:w-[80%] h-auto  gap-4 py-1.5">
            <div className="lg:w-[33%]">
              <ComboBox
                label="Grupo"
                data={[...groups]}
                onChange={(value) => {
                  onChangeField(value, "grupoId");
                }}
                error={errors.grupoId}
                value={values.grupoId}
                ref={inputRef}
              />
            </div>
            <div className="lg:w-[33%]">
              <ComboBox
                label="Produto"
                data={products}
                onChange={(value) => onChangeField(value, "itemId")}
                error={errors.itemId}
                value={values.itemId}
              />
            </div>
            <div className="lg:w-[32%]">
              <ComboBox
                label="Tipos de Armazenamento"
                data={[...tipoArmazenamento]}
                error={errors?.armazenamentoId}
                value={values.armazenamentoId}
                onChange={(arm) => {
                  const descArmazenamentoTipo = tipoArmazenamento?.find(
                    (el) => el.value === arm
                  )?.caption;

                  setValues({
                    ...values,
                    descTipoArmazenamento: descArmazenamentoTipo,
                    armazenamentoId: arm as number,
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-col items-start ">
            <label className="text-lg text-[#242168] font-bold py-1">
              Etiqueta
            </label>
            <div className="flex max-lg:flex-col items-start justify-start py-1">
              <TagModelToPrint
                values={values}
                names={names}
                products={products}
                qtEtiquetas={qtEtiquetas}
              />
              <div className="lg:w-1/2 h-auto ml-3 flex flex-col justify-between text-gray-800">
                <h1 className="font-bold text-base">Preencha os dados</h1>
                <div className="flex flex-col justify-between py-1 pt-2">
                  <div className="flex justify-between py-1 gap-2">
                    <div className="w-[50%]">
                      <Input
                        label="Peso/Qtd"
                        placeholder="0000000"
                        type="text"
                        value={values.qtProduto}
                        error={errors.qtProduto}
                        onChange={(e) =>
                          onChangeField(e.target.value, "qtProduto")
                        }
                      />
                    </div>
                    <div className="w-[50%]">
                      <ComboBox
                        label="Unidade"
                        data={[...unidades]}
                        value={values.unidade}
                        error={errors.unidade}
                        placeholder="Unidade"
                        onChange={(value) => onChangeField(value, "unidade")}
                      />
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-[100%]">
                      <ComboBox
                        label="Local"
                        data={[...storageLocations]}
                        value={values.localArmazenamentoId}
                        error={errors.localArmazenamentoId}
                        placeholder="Local de Armazenamento"
                        onChange={(arm) => {
                          const descArmazenamento = storageLocations?.find(
                            (el) => el.value === arm
                          )?.caption;

                          setValues({
                            ...values,
                            descArmazenamento: descArmazenamento,
                            localArmazenamentoId: arm as number,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-[100%]">
                      <ComboBox
                        label="Fornecedor"
                        data={[...suppliers]}
                        value={values.descFornecedor}
                        error={errors.descFornecedor}
                        placeholder="Nome do Fornecedor"
                        onChange={(value) => {
                          const descFornecedor = suppliers?.find(
                            (el) => el.value === value
                          )?.caption;
                          return onChangeField(
                            descFornecedor,
                            "descFornecedor"
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between py-1 gap-2">
                    <div className="w-[50%]">
                      <Input
                        label="Lote"
                        placeholder="0000000"
                        type="text"
                        value={values.lote}
                        error={errors.lote}
                        onChange={(e) => onChangeField(e.target.value, "lote")}
                      />
                    </div>
                    <div className="w-[50%]">
                      <Input
                        label="SIF"
                        placeholder="0000000"
                        type="text"
                        value={values.sif}
                        error={errors.sif}
                        onChange={(e) => onChangeField(e.target.value, "sif")}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center items-center  gap-4">
                  <div className="w-1/3 flex flex-col justify-center">
                    <Title className="text-sm text-slate-600 font-medium pb-2">
                      Validade Original:
                    </Title>
                    <Input
                      type="calendarSimple"
                      label="calendário"
                      maxDate={dateToPrint as unknown as Date}
                      onChange={(value: any) =>
                        onChangeField(
                          dayjs(value?.startDate).format("DD/MM/YYYY"),
                          "dtValidadeOriginal"
                        )
                      }
                      showTopLabel={false}
                    />
                  </div>
                  <div className="w-1/3 flex justify-center">
                    <Input
                      label="Qtd. Impressão"
                      placeholder="01"
                      type="counter"
                      value={qtEtiquetas}
                      onCounterChange={(newValue) => {
                        if (newValue > 0) setQtEtiquetas(newValue);
                      }}
                    />
                  </div>

                  <div className="flex flex-col w-1/3 space-y-2">
                    <Title className="text-sm text-slate-600 font-medium pb-1">
                      Clique para Gravar
                    </Title>
                    <Button
                      color="white"
                      backgroundColor={colors.secondary}
                      className="w-full h-11"
                      onClick={handleSubmit}
                    >
                      Gerar Etiquetas
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <ConfirmAlert
        isOpen={isPrintModalOpen}
        onClose={() => {
          setIsPrintModalOpen(false);
        }}
        onConfirm={() => {
          handleUpsertTag();
          handlePrint();
          setIsPrintModalOpen(false);
        }}
        title={"Tem certeza que deseja imprimir essa etiqueta?"}
      >
        <div className="flex items-center justify-center p-4">
          <div className="container mx-auto p-4">
            <div className="flex flex-col items-center w-full border p-4 justify-center">
              <span className="text-lg font-medium">
                Insira a quantidade etiquetas para impressões:
              </span>
              <Input
                inputClass="w-40"
                label=""
                type="counter"
                value={qtEtiquetas}
                onCounterChange={(newValue) => {
                  if (newValue > 0) setQtEtiquetas(newValue);
                }}
              />
            </div>
            <div className="max-h-screen overflow-auto p-4 bg-white rounded shadow">
              <div className="h-[50vh]">
                <div
                  ref={printComponentRef}
                  className="flex flex-col  items-center justify-center p-4"
                >
                  <div>{generateCopies()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ConfirmAlert>
    </>
  );

  return <>{renderForm()}</>;
};

export default EtiquetaScreen;
