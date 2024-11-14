export type ComboType = {
  value: number | string;
  caption: string;
};

export type ErrorType<T> = {
  [P in keyof T]?: string;
};

export interface NumberProps {
  decimals: number;
  size: number;
  isMoney?: boolean;
}

export enum StatusTagEnum {
  ATIVO = "ATIVO",
  EXCLUÍDO = "EXCLUÍDO",
  BAIXADO = "BAIXADO",
}

export interface SubUser {
  name: string;
  email: string;
  groupId?: number;
}
export interface CadastroUser {
  company: string;
  cadastroId: number;
  login: string;
  user: SubUser;
}

export interface LoggedUser {
  company: string;
  login: string;
  name: string;
  email: string;
  password: string;
  groupId?: number;
  imgurl?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  erpCadastroUser?: CadastroUser[];
}

export interface Campo {
  id: number;
  alias: string;
  description: string;
  databaseName: string;
}
export interface Armazenamento {
  id: number;
  name: string;
  status: string;
}

export interface Fornecedor {
  company?: string;
  id?: number;
  name: string;
  status: string;
  cpfcnpj: string;
  cityId: string;
  fantasia: string;
  ehCliente: boolean;
  ehParceiro: boolean;
  ehFornecedor: boolean;
  tpPessoa: "F" | "J";
  phone?: string;
  email?: string;
  rgie?: string;
  cep?: string;
  state?: string;
  bairro?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  imgurl?: string;
  celPhone?: string;
  dtCadastro?: string;
}

export interface Etiqueta {
  cadastroId: number;
  id: number;
  remessaId?: string;
  login: string;
  armazenamentoId?: number;
  descTipoArmazenamento?: string;
  grupoId?: number;
  descGrupo?: string;
  itemId: number;
  descItem?: string;
  modeloId: number;
  descModelo?: string;
  qtProduto: number;
  unidade?: string;
  lote?: string;
  sif?: string;
  dtValidadeOriginal?: string;
  dtManipulacao?: string;
  hrManipulacao?: string;
  dtValidade?: string;
  hrValidade?: string;
  dtImpressao?: string;
  hrImpressao?: string;
  descFornecedor?: string;
  descArmazenamento?: string;
  codBarras?: string;
  html: string;
  status: string;
  localArmazenamentoId?: number;
}

export interface Group {
  id: number;
  name: string;
  armazenamentoId?: number;
  descArmazenamento?: string;
  validMeses?: number;
  validDias?: number;
  validHoras?: number;
  validMinutos?: number;
  status: string;
}

export interface TipoArmazenamentoByItem {
  itemId: number;
  armazenamentoId?: number;
  item?: { id: number; name: string };
  armazenamento?: { id: number; name: string };
  validMeses?: number;
  validDias?: number;
  validHoras?: number;
  validMinutos?: number;
  status: string;
}

export interface RowDataSheets {
  [key: string]: string | number;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  grupoId: number;
  categoriaId: number;
  tipoId: number;
  unidadeId: string;
  imgpath: string;
  marca: string;
  vlItem: number;
  tpDisposicao: string;
  opcoes: string;
  status: string;
  sif?: string;
  descArmazenamento: string;
  descFornecedor: string;
  temSif?: boolean;
  temLote?: boolean;
  temFornecedor?: boolean;
  temValidade?: boolean;
  localArmazenamentoId?: number;
}

export interface TagModel {
  id: number;
  name: string;
  modeloId?: number;
  grupoId?: number;
  itemId?: number;
  descModelo: string;
  status: string;
}

export interface Unidade {
  unidade: string;
  name: string;
  status: string;
  conversaoId?: string;
  qtUnidade?: number;
}
export interface User {
  login: string;
  name: string;
  email: string;
  password: string;
  groupId?: number;
  imgurl?: string;
  status?: string;
}

export interface Dropitems {
  icon: string;
  title: string;
  path?: string;
}

export interface Screen {
  name: string;
  searchBar: boolean;
  menu: string;
  title: string;
  type: string;
}

//Tipos para erros

export const requiredFieldsArmazenamento: Partial<
  Record<keyof Group, boolean>
> = {
  name: true,
  status: true,
};

export const requiredFieldsUnidade: Partial<Record<keyof Unidade, boolean>> = {
  name: true,
  unidade: true,
  status: true,
};

export const requiredFieldsFornecedor: Partial<
  Record<keyof Fornecedor, boolean>
> = {
  name: true,
  cpfcnpj: false,
  status: true,
};

export function requiredFieldsEtiqueta(
  sif: boolean | undefined,
  lote: boolean | undefined,
  validade: boolean | undefined,
  fornecedor: boolean | undefined
): Partial<Record<keyof Etiqueta, boolean>> {
  return {
    cadastroId: true,
    armazenamentoId: true,
    descFornecedor: fornecedor,
    login: false,
    itemId: true,
    grupoId: true,
    modeloId: false,
    qtProduto: true,
    html: true,
    status: true,
    sif: sif || false,
    lote: lote || false,
    dtValidadeOriginal: validade || false,
  };
}

export const requiredFieldsGroup: Partial<Record<keyof Group, boolean>> = {
  name: true,
  status: true,
};

export const requiredFieldsItem: Partial<Record<keyof Item, boolean>> = {
  id: false,
  name: true,
  description: false,
  grupoId: true,
  categoriaId: false,
  tipoId: false,
  unidadeId: true,
  imgpath: false,
  marca: false,
  vlItem: false,
  tpDisposicao: false,
  opcoes: false,
  status: false,
};

export const requiredFieldsTagModel: Partial<Record<keyof TagModel, boolean>> =
  {
    id: false,
    name: true,
    modeloId: false,
    grupoId: false,
    itemId: false,
    descModelo: true,
    status: false,
  };

export const requiredFieldsUser: Partial<Record<keyof User, boolean>> = {
  login: true,
  name: true,
  email: true,
  password: true,
  // groupId e imgurl são opcionais, então não listados aqui
};
