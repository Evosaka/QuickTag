import React, { useEffect, useState, FormEvent } from "react";
import { useMutation, useQuery } from "@apollo/client";

import Input from "@components/Input";
import NavButton from "@components/NavButton";
import DynamicTable from "@components/DynamicTable";

import showNotification from "@utils/notifications";

import { ErrorType, requiredFieldsUnidade, Unidade } from "@lib/types";
import { areAllErrorsEmpty, validateFields } from "@utils/functions";

import {
  GET_UNIDADES,
  UPSERT_UNIDADE,
  STATUS_ARMAZENAMENTO,
} from "@lib/graphql/consts";

import { useAppContext } from "@lib/context/appContext";

const initialValues: Unidade = {
  name: "",
  unidade: "",
  status: "ATIVO",
};

//colunas da grade
const unitColumns = [
  { name: "NOME", key: "name" },
  { name: "UNIDADE DE MEDIDA", key: "unidade" },
  { name: "STATUS", key: "status" },
];

interface UnitProps {
  mode: string;
  dataEdit?: Unidade;
  refetchData?: () => void;
}

const UnitScreen = ({ mode, dataEdit, refetchData }: UnitProps) => {
  const [values, setValues] = useState<Unidade>({ ...initialValues });
  const [errors, setErrors] = useState<ErrorType<Unidade>>({});
  const [id, setId] = useState<string>("");
  const [units, setUnits] = useState<Unidade[]>([]);

  const { setSpinMsg } = useAppContext();

  const { data: dbUnidades, refetch } = useQuery(GET_UNIDADES, {
    variables: { status: "ATIVO" },
  });

  const [upsert] = useMutation(UPSERT_UNIDADE, {
    onCompleted: (data) => {
      const { upsertUnidade: id } = data;
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
    setUnits([]);
    if (
      dbUnidades &&
      dbUnidades?.getErpUnidades &&
      dbUnidades.getErpUnidades.length > 0
    ) {
      setUnits(dbUnidades?.getErpUnidades);
    }
  }, [dbUnidades]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      let saveErrors = {};

      saveErrors = {
        ...errors,
        ...validateFields(values, requiredFieldsUnidade),
      };

      if (!areAllErrorsEmpty(saveErrors)) {
        setErrors({ ...saveErrors });
        return;
      }

      setSpinMsg("Gravando");

      const unidadeInput = { ...values };

      upsert({
        variables: {
          unidadeInput,
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
          <div className="lg:w-[40%]">
            <Input
              label="Nome"
              type="text"
              error={errors?.name}
              value={values.name}
              placeholder=""
              onChange={(e) => onChangeField(e.target.value, "name")}
            />
          </div>
          <div className="lg:w-[20%]">
            <Input
              label="Unidade"
              type="text"
              error={errors?.unidade}
              value={values.unidade}
              placeholder="KG, UN"
              onChange={(e) => onChangeField(e.target.value, "unidade")}
            />
          </div>
          <div className="lg:w-[20%]">
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
              label={id ? "Salvar Edição" : "Cadastrar"}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </form>
      <div className="pt-5">
        <DynamicTable
          label="Unidades Cadastradas"
          data={units}
          columns={unitColumns}
          hasDelete
          hasEdit
          onDelete={(record: Unidade) => {
            const { status, unidade } = record;
            const newStatus = status === "ATIVO" ? "CANCELADO" : "ATIVO";
            setStatus({
              variables: {
                unidade,
                status: newStatus,
              },
            });
          }}
          onEdit={(record: Unidade) => {
            setValues({ ...record });
            const { unidade } = record;
            setId(unidade);
          }}
        />
      </div>
    </>
  );

  return renderForm();
};

export default UnitScreen;
