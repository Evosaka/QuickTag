/***
 * TELA DE CADASTRO DE GRUPOS
 * TODO:
 *   --> Ajustar campos faltantes na retaguarda
 *   --> Criar cadastro de tipo de armazenamento na plataforma igual o grupo
 *   --> Verificar a relação do grupo ao parceiro
 */

import React, { useEffect, useState, FormEvent } from "react";
import { useMutation, useQuery } from "@apollo/client";

import ComboBox from "@components/ComboBox";
import Input from "@components/Input";
import NavButton from "@components/NavButton";
import DynamicTable from "@components/DynamicTable";

import showNotification from "@utils/notifications";

import {
  ErrorType,
  requiredFieldsGroup,
  Group,
  Armazenamento,
} from "@lib/types";
import { areAllErrorsEmpty, validateFields } from "@utils/functions";

import {
  GET_ARMAZENAMENTO,
  GET_GRUPOS,
  UPSERT_GRUPOS,
  STATUS_GRUPO,
} from "@lib/graphql/consts";

const initialValues: Group = {
  id: 0,
  name: "",
  status: "ATIVO",
};

import { useAppContext } from "@lib/context/appContext";

//colunas da grade
const groupColumns = [
  { name: "ID", key: "id" },
  { name: "NOME", key: "name" },
  { name: "STATUS", key: "status" },
];

interface GroupProps {
  mode: string;
  dataEdit?: Group;
  refetchData?: () => void;
}

const GroupScreen = ({ mode, dataEdit, refetchData }: GroupProps) => {
  const [values, setValues] = useState<Group>({ ...initialValues });
  const [errors, setErrors] = useState<ErrorType<Group>>({});
  const [id, setId] = useState<number>(0);
  const [dbGrid, setDbGrid] = useState<Group[]>([]);
  const [tipoArmazenamento, setTipoArmazenamento] = useState<
    { value: number; caption: string }[]
  >([]);

  const { data: dbArmazenamento } = useQuery(GET_ARMAZENAMENTO, {
    variables: { status: "ATIVO" },
  });

  const { setSpinMsg } = useAppContext();

  const { data: mainDB, refetch } = useQuery(GET_GRUPOS);

  const [upsert] = useMutation(UPSERT_GRUPOS, {
    onCompleted: (data) => {
      const { upsertGrupoItem: id } = data;
      if (id) {
        setId(id);
      }
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

  const [setStatus] = useMutation(STATUS_GRUPO, {
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
    if (mainDB && mainDB.getGrupoItens && mainDB.getGrupoItens.length > 0) {
      setDbGrid([...mainDB.getGrupoItens]);
    }
  }, [mainDB]);

  useEffect(() => {
    setTipoArmazenamento([]);
    if (
      dbArmazenamento &&
      dbArmazenamento?.getArmazenamento &&
      dbArmazenamento.getArmazenamento.length > 0
    ) {
      setTipoArmazenamento([
        ...dbArmazenamento.getArmazenamento.map((ar: Armazenamento) => ({
          value: ar.id,
          caption: ar.name,
        })),
      ]);
    }
  }, [dbArmazenamento]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      let saveErrors = {};

      saveErrors = {
        ...errors,
        ...validateFields(values, requiredFieldsGroup),
      };

      if (!areAllErrorsEmpty(saveErrors)) {
        setErrors({ ...saveErrors });
        return;
      }

      setSpinMsg("Gravando");

      const grupoInput = { ...values };

      grupoInput.id = id && id > 0 ? id : 0;

      upsert({
        variables: {
          grupoInput,
        },
      });
    } catch (err) {}
  };

  const onChangeField = (value: string | number, field: string) => {
    setValues({ ...values, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const renderForm = () => (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex max-lg:flex-col justify-between gap-4 py-1.5">
          <div className="lg:w-[45%]">
            <Input
              label="Nome"
              type="text"
              error={errors?.name}
              value={values.name}
              placeholder=""
              onChange={(e) => onChangeField(e.target.value, "name")}
            />
          </div>
          {/* <div className="lg:w-[32%]">
            <ComboBox
              label="Tipos de Armazenamento"
              data={[...tipoArmazenamento]}
              error={errors?.armazenamentoId}
              value={values.armazenamentoId}
              onChange={(value) => onChangeField(value, "armazenamentoId")}
            />
          </div> */}
          <div className="lg:w-[30%]">
            <Input
              label="Status"
              type="text"
              error={errors.status}
              disabled={true}
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
          label="Grupos cadastrados"
          data={dbGrid}
          columns={groupColumns}
          hasDelete
          hasEdit
          onDelete={(record: Group) => {
            const { id, status } = record;
            const newStatus = status === "ATIVO" ? "CANCELADO" : "ATIVO";
            setStatus({
              variables: {
                id,
                status: newStatus,
              },
            });
          }}
          onEdit={(record: Group) => {
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

export default GroupScreen;
