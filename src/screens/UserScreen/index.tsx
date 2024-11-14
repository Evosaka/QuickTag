/***
 * TELA DE CADASTRO DE USUÁRIOS
 * TODO:
 *   --> Se estiver editando desabilitar o campo de login
 *   --> Buscar grupos da retaguarda
 */

import React, { useEffect, useRef, useState, FormEvent } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Cookies from "js-cookie";

import client from "@lib/graphql/client";

import ComboBox from "@components/ComboBox";
import Input from "@components/Input";
import NavButton from "@components/NavButton";
import DynamicTable from "@components/DynamicTable";

import showNotification from "@utils/notifications";

import { ErrorType, requiredFieldsUser, LoggedUser, User } from "@lib/types";
import {
  areAllErrorsEmpty,
  validarEmail,
  validateFields,
} from "@utils/functions";

import {
  CHECK_LOGIN,
  GET_CADASTRO_USER,
  UPSERT_CADASTRO_USER,
  UPSERT_USER,
} from "@lib/graphql/consts";

const initialValues: User = {
  email: "",
  login: "",
  name: "",
  password: "",
};

import { useAppContext } from "@lib/context/appContext";

//colunas da grade
const userColumns = [
  { name: "Login", key: "login" },
  { name: "NOME", key: "name" },
  { name: "EMAIL", key: "email" },
  { name: "STATUS", key: "status" },
];

//criada para adicionar a confirmação de senha na tratativa dos erros
interface UserErrors extends User {
  confirmPassword: string;
}

interface UserProps {
  mode: string;
  dataEdit?: User;
  refetchData?: () => void;
}

const UserScreen = ({ mode, dataEdit, refetchData }: UserProps) => {
  const [loggedUser, setLoggedUser] = useState<LoggedUser>();
  const [values, setValues] = useState<User>({ ...initialValues });
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<ErrorType<UserErrors>>({});
  const [id, setId] = useState<number>(0);
  const [cadastroId, setCadastroId] = useState<number>(0);
  const [dbGrid, setDbGrid] = useState<User[]>([]);

  const { setSpinMsg, setActNewRecord } = useAppContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: mainDB, refetch } = useQuery(GET_CADASTRO_USER, {
    variables: { cadastroId },
  });

  const [upsertUser, data] = useMutation(UPSERT_USER, {
    onCompleted: (data) => confirmSave(data),
    onError: (err) => {
      setSpinMsg("");
      showNotification("Erro ao salvar!", "error");
      console.log("err: ", err);
    },
  });

  const [upsertCadastro] = useMutation(UPSERT_CADASTRO_USER, {
    onCompleted: (data) => {
      showNotification("Cadastro efetuado com sucesso!", "success");
      refetch();
      setSpinMsg("");
    },
    onError: (err) => {
      setSpinMsg("");
      showNotification("Erro ao relacionar!", "error");
      console.log("err: ", err);
    },
  });

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
      setValues({ ...initialValues });
      if (inputRef?.current) {
        inputRef.current.focus();
      }
    });
  }, [setActNewRecord]);

  useEffect(() => {
    if (loggedUser) {
      const { erpCadastroUser } = loggedUser;
      if (erpCadastroUser && erpCadastroUser.length > 0) {
        const { cadastroId: cadId } = erpCadastroUser[0];
        setCadastroId(cadId);
      }
    }
  }, [loggedUser]);

  useEffect(() => {
    if (dataEdit) setValues({ ...dataEdit });
  }, [dataEdit]);

  useEffect(() => {
    if (mainDB && mainDB.getCadastroUser && mainDB.getCadastroUser.length > 0) {
      setDbGrid([
        ...mainDB.getCadastroUser
          .filter((user: any) => user?.login !== loggedUser?.login)
          .map((item: any) => ({
            login: item.login,
            name: item.user.name,
            email: item.user.email,
            groupId: item.user.groupId,
            status: item.status,
          })),
      ]);
    }
  }, [mainDB]);

  const checkLogin = async (login: string): Promise<boolean> => {
    const { data: dbLogin } = await client().query({
      query: CHECK_LOGIN,
      variables: { login },
    });
    let check = false;
    if (!!dbLogin) {
      const { checkLogin } = dbLogin;
      if (!!checkLogin) {
        check = checkLogin;
      }
    }

    return check && mode === "INSERT";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    console.log("Vai gravar...");

    try {
      let userErrors = {};

      userErrors = { ...errors, ...validateFields(values, requiredFieldsUser) };

      if (!areAllErrorsEmpty(userErrors)) {
        setErrors({ ...userErrors, confirmPassword });
        return;
      }

      //valida o email
      if (!validarEmail(values.email)) {
        setErrors({ ...errors, email: "Email é inválido!" });
        return;
      }

      const existLogin = await checkLogin(values.login);
      if (existLogin) {
        setErrors({ ...errors, login: "Login já existente!" });
        return;
      }
      if (!confirmPassword) {
        setErrors({
          ...errors,
          confirmPassword: "É preciso confirmar a senha!",
        });
        return;
      }

      if (confirmPassword !== values.password) {
        setErrors({ ...errors, confirmPassword: "Senhas não batem!" });
        return;
      }

      setSpinMsg("Gravando");

      //grava o usuário depois terá que gravar o vínculo ao parceiro caso não seja INSERT

      /* TODO: colocar a parte da foto do usuário
      if (img) {
        //TODO: ajustar upload da imagem
        setSpin({ visible: true, msg: "Subindo a imagem..." });
        const { path } = await uploadFile(
          img,
          `img-externaluser_${values.email}`,
          "system"
        );
        userInput.imgurl = path;
      } */

      const userInput = { ...values };

      upsertUser({
        variables: {
          userInput,
        },
      });
    } catch (err) {}
  };

  const onChangeField = (value: any, field: string) => {
    setValues({ ...values, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const confirmSave = (data: any) => {
    if (mode === "INSERT" && loggedUser && loggedUser.erpCadastroUser) {
      setSpinMsg("Gravando a relação com o parceiro...");
      //como está inserindo salva no relacionamento com o parceiro
      const input = {
        cadastroId: loggedUser.erpCadastroUser[0].cadastroId,
        login: values.login,
      };

      upsertCadastro({
        variables: {
          input,
        },
      });
      return;
    }
    showNotification("Registro salvo com sucesso!", "success");
    setSpinMsg("");
  };

  const renderForm = () => (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex max-lg:flex-col justify-between py-1.5">
          <div className="lg:w-[14%]">
            <Input
              ref={inputRef}
              label="Login"
              type="text"
              error={errors?.login}
              placeholder=""
              value={values.login}
              onChange={(e) => onChangeField(e.target.value, "login")}
            />
          </div>
          <div className="lg:w-[50%]">
            <Input
              label="Nome"
              type="text"
              error={errors.name}
              placeholder="Informe o Nome"
              value={values.name}
              onChange={(e) => onChangeField(e.target.value, "name")}
            />
          </div>
          <div className="lg:w-[32%]">
            <ComboBox
              label="Grupo"
              data={[]}
              value={values.groupId}
              onChange={(value) => onChangeField(value, "groupId")}
            />
          </div>
        </div>
        <div className="flex max-lg:flex-col justify-between py-1.5">
          <div className="lg:w-[40%]">
            <Input
              label="E-mail"
              type="email"
              placeholder="seuemail@site.com.br"
              error={errors.email}
              value={values.email}
              onChange={(e) => onChangeField(e.target.value, "email")}
            />
          </div>
          <div className="lg:w-[20%]">
            <Input
              label="Senha"
              type="password"
              placeholder="************"
              error={errors.password}
              value={values.password}
              onChange={(e) => onChangeField(e.target.value, "password")}
            />
          </div>
          <div className="lg:w-[20%]">
            <Input
              label="Confirme a Senha"
              type="password"
              placeholder="************"
              error={errors.confirmPassword}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors({ ...errors, confirmPassword: "" });
              }}
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
          label="Usuários Cadastrados"
          data={dbGrid}
          columns={userColumns}
          hasDelete
          hasEdit
        />
      </div>
    </>
  );

  return renderForm();
};

export default UserScreen;
