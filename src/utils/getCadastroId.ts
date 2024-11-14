import Cookies from "js-cookie";

export const getCadastroId = () => {
  const userData = Cookies.get("user");
  const parsedUserData = userData && JSON.parse(userData);
  const cadastroId = parsedUserData?.erpCadastroUser[0]?.cadastroId;
  return cadastroId;
};
