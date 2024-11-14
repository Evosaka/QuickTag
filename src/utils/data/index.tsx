import { Screen } from "@src/lib/types";

export const screens: Screen[] = [
  {
    name: "armazenamento",
    searchBar: false,
    menu: "Tipo Armazenamento",
    title: "Cadastro de Tipos de Armazenamento",
    type: "cadastro",
  },
  {
    name: "local-armazenamento",
    searchBar: false,
    menu: "Local Armazenamento",
    title: "Cadastro de Local de Armazenamento",
    type: "cadastro",
  },
  {
    name: "etiqueta",
    searchBar: false,
    menu: "Etiquetas",
    title: "Nova Etiqueta",
    type: "cadastro",
  },
  {
    name: "groups",
    searchBar: false,
    menu: "Grupos",
    title: "Cadastro de Grupos",
    type: "cadastro",
  },
  {
    name: "suppliers",
    searchBar: false,
    menu: "Fornecedores",
    title: "Cadastro de Fornecedor",
    type: "cadastro",
  },
  {
    name: "products",
    searchBar: false,
    menu: "Produtos",
    title: "Cadastro de Produtos",
    type: "cadastro",
  },
  {
    name: "units",
    searchBar: false,
    menu: "Unidades",
    title: "Cadastro de Unidades",
    type: "cadastro",
  },
  {
    name: "users",
    searchBar: false,
    menu: "Usuários",
    title: "Cadastro de Usuários",
    type: "cadastro",
  },
];

export const sidebarItems = [
  {
    id: 1,
    label: "Criar Etiquetas",
    icon: "ticket",
    path: "etiquetas",
  },
  {
    id: 2,
    label: "Validade",
    icon: "clock",
    path: "validade",
  },
  {
    id: 3,
    label: "Cadastro",
    icon: "clipboard-document-check",
    path: "cadastro",
  },
];

export const productBox = [
  {
    label: "produto",
    value: "236",
    icon: "cube-three",
    text: "Produtos Cadastrados",
  },
  {
    label: "produto",
    value: "16",
    icon: "cube-alert",
    text: "Vencem Hoje 00/00/00",
  },
  {
    label: "produto",
    value: "20",
    icon: "cube-cancel",
    text: "Produtos Vencidos",
  },
  {
    label: "produto",
    value: "200",
    icon: "cube-timer",
    text: "Produtos na Validade",
  },
  {
    label: "produto",
    value: "2d",
    icon: "clock",
    text: "Tempo Médio de Armazenamento",
  },
];

export const chart = [
  {
    label: "Jan",
    h1: "8",
    h2: "16",
    value: 37500,
  },
  {
    label: "Fev",
    h1: "8",
    h2: "16",
    value: 37500,
  },
  {
    label: "Mar",
    h1: "32",
    h2: "16",
    value: 37500,
  },
  {
    label: "Abr",
    h1: "8",
    h2: "16",
    value: 37500,
  },
  {
    label: "Mai",
    h1: "12",
    h2: "16",
    value: 37500,
  },
  {
    label: "Jun",
    h1: "8",
    h2: "20",
    value: 37500,
  },
  {
    label: "Jul",
    h1: "24",
    h2: "16",
    value: 37500,
  },
  {
    label: "Ago",
    h1: "8",
    h2: "16",
    value: 37500,
  },
  {
    label: "Set",
    h1: "8",
    h2: "16",
    value: 37500,
  },
  {
    label: "Out",
    h1: "8",
    h2: "16",
    value: 37500,
  },
  {
    label: "Nov",
    h1: "12",
    h2: "8",
    value: 37500,
  },
  {
    label: "Dez",
    h1: "32",
    h2: "40",
    value: 37500,
  },
];

export const tagsByGroupsColumns = [
  { name: "Posição", key: "position" },
  { name: "Grupo", key: "descGrupo" },
  { name: "Quantidade", key: "quantity" },
];

export const etiquetasColumns = [
  { name: "Produto", key: "descItem" },
  { name: "Grupo", key: "descGrupo" },
  { name: "Manipulado em", key: "dtManipulacao" },
  { name: "Validade", key: "dtValidade" },
  { name: "Impresso em", key: "dtImpressao" },
];

export const TableValidateTagsSchema = [
  { name: "Produto", key: "descItem" },
  // { name: "Peso", key: "peso" },
  { name: "Status", key: "status" },
  { name: "Tipo Armazenamento", key: "descGrupo" },
  { name: "Forn/Marca", key: "descFornecedor" },
  { name: "Armazenagem", key: "descArmazenamento" },
  { name: "Manipulado em", key: "dtManipulacao" },
  { name: "Validade", key: "dtValidade" },
  { name: "Impresso em", key: "dtImpressao" },
  { name: "Quantidade", key: "qtProduto" },
];
