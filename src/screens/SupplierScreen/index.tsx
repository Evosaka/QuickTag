import React, { useEffect, useState, FormEvent } from "react";
import { useMutation, useQuery } from "@apollo/client";

import Input from "@components/Input";
import NavButton from "@components/NavButton";
import DynamicTable from "@components/DynamicTable";

import showNotification from "@utils/notifications";

import { ErrorType, Fornecedor, requiredFieldsFornecedor } from "@lib/types";
import { areAllErrorsEmpty, validateFields } from "@utils/functions";

import {
  STATUS_ARMAZENAMENTO,
  GET_CADASTRO_FORNECEDOR,
  UPSERT_CADASTRO_FORNECEDOR,
} from "@lib/graphql/consts";

import { useAppContext } from "@lib/context/appContext";
import { getCadastroId } from "@src/utils/getCadastroId";

const initialValues: Fornecedor = {
  id: 0,
  name: "",
  cpfcnpj: "",
  state: "SP",
  ehFornecedor: true,
  ehCliente: false,
  ehParceiro: false,
  fantasia: "",
  status: "ATIVO",
  cityId: "3550308",
  cep: "05092-000",
  tpPessoa: "J",
};

//colunas da grade
const supplierColumns = [
  { name: "NOME DA EMPRESA", key: "name" },
  { name: "NOME DA FANTASIA", key: "fantasia" },
  { name: "CNPJ", key: "cpfcnpj" },
  { name: "STATUS", key: "status" },
];

interface SupplierProps {
  mode: string;
  dataEdit?: Fornecedor;
  refetchData?: () => void;
}

const SupplierScreen = ({ mode, dataEdit, refetchData }: SupplierProps) => {
  const [values, setValues] = useState<Fornecedor>({ ...initialValues });
  const [errors, setErrors] = useState<ErrorType<Fornecedor>>({});
  const [id, setId] = useState<number>(0);
  const [suppliers, setSuppliers] = useState<Fornecedor[]>([]);

  const { setSpinMsg } = useAppContext();

  const { data: dbFornecedores, refetch } = useQuery(GET_CADASTRO_FORNECEDOR, {
    variables: { status: "ATIVO", ehFornecedor: true },
  });

  const [upsert] = useMutation(UPSERT_CADASTRO_FORNECEDOR, {
    onCompleted: (data) => {
      const { upsertFornecedor: id } = data;
      if (id) {
        setId(id);
      }
      showNotification("Registro salvo com sucesso!", "success");
      setSpinMsg("");
      refetch();
    },
    onError: (err) => {
      setSpinMsg("");
      showNotification("Erro ao salvar!", "error");
      console.log("err: ", err);
    },
  });

  const [setStatus] = useMutation(STATUS_ARMAZENAMENTO, {
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

  useEffect(() => {
    if (dataEdit) setValues({ ...dataEdit });
  }, [dataEdit]);

  useEffect(() => {
    setSuppliers([]);
    if (
      dbFornecedores &&
      dbFornecedores?.getCadastro &&
      dbFornecedores.getCadastro.length > 0
    ) {
      setSuppliers(dbFornecedores?.getCadastro);
    }
  }, [dbFornecedores]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      let saveErrors = {};

      saveErrors = {
        ...errors,
        ...validateFields(values, requiredFieldsFornecedor),
      };

      if (!areAllErrorsEmpty(saveErrors)) {
        setErrors({ ...saveErrors });
        return;
      }

      setSpinMsg("Gravando");

      const cadastroInput = { ...values };

      upsert({
        variables: {
          cadastroInput,
        },
      });
    } catch (err) {}
  };

  const onChangeField = (value: any, field: string) => {
    setValues({ ...values, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const renderForm = () => (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex max-lg:flex-col justify-between py-1.5">
          <div className="lg:w-[49%]">
            <Input
              label="Nome do Fornecedor"
              type="text"
              error={errors?.name}
              value={values.name}
              placeholder=""
              onChange={(e) => onChangeField(e.target.value, "name")}
            />
          </div>
          <div className="lg:w-[49%]">
            <Input
              label="Nome Fantasia"
              type="text"
              error={errors?.fantasia}
              value={values.fantasia}
              placeholder=""
              onChange={(e) => onChangeField(e.target.value, "fantasia")}
            />
          </div>
        </div>
        <div className="flex max-lg:flex-col lg:w-[100%] justify-between py-1.5">
          <div className="lg:w-[49%]">
            <Input
              label="CNPJ"
              type="text"
              error={errors?.cpfcnpj}
              value={values.cpfcnpj}
              placeholder=""
              onChange={(e) => onChangeField(e.target.value, "cpfcnpj")}
            />
          </div>
          <div className="lg:w-[29%]">
            <Input
              label="Status"
              type="text"
              disabled={true}
              error={errors.status}
              value={values.status}
              onChange={(e) => onChangeField(e.target.value, "status")}
            />
          </div>

          <div className="w-full max-lg:pt-5 lg:self-end lg:w-[18%]">
            <NavButton
              label={id ? "Salvar Edição" : "Cadastrar"}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </form>
      <div className="pt-5">
        <DynamicTable
          label="Fornecedores Cadastradas"
          data={suppliers}
          columns={supplierColumns}
          hasDelete
          hasEdit
          onDelete={(record: Fornecedor) => {
            const { status, id } = record;
            const newStatus = status === "ATIVO" ? "CANCELADO" : "ATIVO";
            setStatus({
              variables: {
                id,
                status: newStatus,
              },
            });
          }}
          onEdit={(record: Fornecedor) => {
            setValues({ ...record });
            const { id } = record;
            id && setId(id);
          }}
        />
      </div>
    </>
  );

  return renderForm();
};

export default SupplierScreen;
