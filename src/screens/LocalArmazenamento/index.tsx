/***
 * TELA DE CADASTRO DE LOCAL DE ARMAZENAMENTO
 * TODO:
 *
 */

import React, { useEffect, useState, FormEvent } from "react";
import { useMutation, useQuery } from "@apollo/client";

import Input from "@components/Input";
import NavButton from "@components/NavButton";
import DynamicTable from "@components/DynamicTable";

import showNotification from "@utils/notifications";

import {
  Armazenamento,
  ErrorType,
  requiredFieldsArmazenamento,
} from "@lib/types";
import { areAllErrorsEmpty, validateFields } from "@utils/functions";

import {
  GET_LOCAL_ARMAZENAMENTO,
  UPSERT_LOCAL_ARMAZENAMENTO,
  STATUS__LOCAL_ARMAZENAMENTO,
} from "@lib/graphql/consts";

const initialValues: Armazenamento = {
  id: 0,
  name: "",
  status: "ATIVO",
};

import { useAppContext } from "@lib/context/appContext";

//colunas da grade
const armColumns = [
  { name: "ID", key: "id" },
  { name: "LOCAL ARMAZENAMENTO", key: "name" },
  { name: "STATUS", key: "status" },
];

interface ArmazenamentoProps {
  mode: string;
  dataEdit?: Armazenamento;
  refetchData?: () => void;
}

const LocalArmazenamentoScreen = ({
  mode,
  dataEdit,
  refetchData,
}: ArmazenamentoProps) => {
  const [values, setValues] = useState<Armazenamento>({ ...initialValues });
  const [errors, setErrors] = useState<ErrorType<Armazenamento>>({});
  const [id, setId] = useState<number>(0);
  const [dbGrid, setDbGrid] = useState<Armazenamento[]>([]);

  const { setSpinMsg } = useAppContext();

  const { data: mainDB, refetch } = useQuery(GET_LOCAL_ARMAZENAMENTO);

  const [upsert] = useMutation(UPSERT_LOCAL_ARMAZENAMENTO, {
    onCompleted: (data) => {
      const { upsertArmazenamento: id } = data;
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

  const [setStatus] = useMutation(STATUS__LOCAL_ARMAZENAMENTO, {
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
    if (
      mainDB &&
      mainDB.getLocalArmazenamento &&
      mainDB.getLocalArmazenamento.length > 0
    ) {
      setDbGrid([...mainDB.getLocalArmazenamento]);
    }
  }, [mainDB]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      let saveErrors = {};

      saveErrors = {
        ...errors,
        ...validateFields(values, requiredFieldsArmazenamento),
      };

      if (!areAllErrorsEmpty(saveErrors)) {
        setErrors({ ...saveErrors });
        return;
      }

      setSpinMsg("Gravando");

      const armInput = { ...values };

      armInput.id = id && id > 0 ? id : 0;

      upsert({
        variables: {
          armInput,
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
          <div className="lg:w-[50%]">
            <Input
              label="Local de Armazenamento"
              type="text"
              error={errors?.name}
              value={values.name}
              placeholder=""
              onChange={(e) => onChangeField(e.target.value, "name")}
            />
          </div>
          <div className="lg:w-[25%]">
            <Input
              label="Status"
              type="text"
              disabled={true}
              error={errors.status}
              value={values.status}
              onChange={(e) => onChangeField(e.target.value, "status")}
            />
          </div>

          <div className="w-full max-lg:pt-5 lg:self-end lg:w-[16%]">
            <NavButton
              label={id > 0 ? "Salvar Edição" : "Cadastrar"}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </form>
      <div className="pt-5">
        <DynamicTable
          label="Locais de Armazenamento Cadastrados"
          data={dbGrid}
          columns={armColumns}
          hasDelete
          hasEdit
          onDelete={(record: Armazenamento) => {
            const { id, status } = record;
            const newStatus = status === "ATIVO" ? "CANCELADO" : "ATIVO";
            setStatus({
              variables: {
                id,
                status: newStatus,
              },
            });
          }}
          onEdit={(record: Armazenamento) => {
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

export default LocalArmazenamentoScreen;
