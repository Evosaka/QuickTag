import { gql } from "@apollo/client";

//PRODUCTS
export const GET_ETIQUETAS = gql`
  query ($status: String) {
    getErpEtiqueta(status: $status) {
      cadastroId
      id
      login
      grupoId
      descGrupo
      itemId
      descItem
      modeloId
      descModelo
      armazenamentoId
      descTipoArmazenamento
      descArmazenamento
      qtProduto
      unidade
      lote
      sif
      dtManipulacao
      dtValidadeOriginal
      hrManipulacao
      dtValidade
      hrValidade
      dtImpressao
      hrImpressao
      descFornecedor
      codBarras
      html
      remessaId
      status
    }
  }
`;

export const UPSERT_ETIQUETA = gql`
  mutation upsertErpEtiqueta(
    $qtEtiquetas: Int!
    $etiquetaInput: ErpEtiquetaInput!
  ) {
    upsertErpEtiqueta(qtEtiquetas: $qtEtiquetas, input: $etiquetaInput) {
      id
    }
  }
`;

export const DELETE_ETIQUETA = gql`
  mutation deleteErpEtiqueta($cadastroId: Int!, $id: Int!) {
    deleteErpEtiqueta(cadastroId: $cadastroId, id: $id)
  }
`;

export const CHANGE_STATUS_ETIQUETA = gql`
  mutation statusErpEtiqueta($cadastroId: Int!, $id: Int!, $status: String!) {
    statusErpEtiqueta(cadastroId: $cadastroId, id: $id, status: $status) {
      id
      status
    }
  }
`;

/// TIPO ARMAZENAMENTO
export const GET_ARMAZENAMENTO = gql`
  query ($status: String) {
    getArmazenamento(status: $status) {
      id
      name
      status
    }
  }
`;

export const UPSERT_ARMAZENAMENTO = gql`
  mutation upsertArmazenamento($armInput: ErpArmazenamentoInput!) {
    upsertArmazenamento(input: $armInput) {
      company
      id
      name
      status
    }
  }
`;

export const STATUS_ARMAZENAMENTO = gql`
  mutation statusArmazenamento($id: Int!, $status: String!) {
    statusArmazenamento(id: $id, status: $status) {
      id
      status
    }
  }
`;

/// LOCAL ARMAZENAMENTO
export const GET_LOCAL_ARMAZENAMENTO = gql`
  query ($status: String) {
    getLocalArmazenamento(status: $status) {
      id
      name
      status
    }
  }
`;

export const UPSERT_LOCAL_ARMAZENAMENTO = gql`
  mutation upsertArmazenamento($armInput: ErpLocalArmazenamentoInput!) {
    upsertLocalArmazenamento(input: $armInput) {
      company
      id
      name
      status
    }
  }
`;

export const STATUS__LOCAL_ARMAZENAMENTO = gql`
  mutation statusArmazenamento($id: Int!, $status: String!) {
    statusLocalArmazenamento(id: $id, status: $status) {
      id
      status
    }
  }
`;

///GRUPOS
export const GET_GRUPOS = gql`
  query ($status: String) {
    getGrupoItens(status: $status) {
      id
      name
      armazenamentoId
      descArmazenamento
      validMeses
      validDias
      validHoras
      validMinutos
      status
    }
  }
`;

///ETIQUETAS MODELOS e CAMPOS
export const GET_CAMPOS = gql`
  query {
    getErpEtiquetaCampos {
      id
      alias
      description
      databaseName
    }
  }
`;

export const GET_ETIQUETA_MODELOS = gql`
  query ($status: String) {
    getErpEtiquetaModelo(status: $status) {
      id
      name
      modeloId
      descModeloBase
      grupoId
      descGrupo
      itemId
      descItem
      descModelo
      status
    }
  }
`;

export const UPSERT_ETIQUETA_MODELOS = gql`
  mutation upsertErpEtiquetaModelo($modeloInput: ErpEtiquetaModeloInput!) {
    upsertErpEtiquetaModelo(input: $modeloInput) {
      company
      id
      name
      status
    }
  }
`;

export const STATUS_ETIQUETA_MODELOS = gql`
  mutation statusErpEtiquetaModelo($id: Int!, $status: String!) {
    statusErpEtiquetaModelo(id: $id, status: $status) {
      id
      status
    }
  }
`;

///UNIDADES
export const GET_UNIDADES = gql`
  query ($status: String) {
    getErpUnidades(status: $status) {
      company
      unidade
      name
      conversaoId
      qtUnidade
      status
    }
  }
`;

export const UPSERT_UNIDADE = gql`
  mutation upsertUnidade($unidadeInput: ErpUnidadeInput!) {
    upsertUnidade(input: $unidadeInput) {
      company
      unidade
      name
      conversaoId
      qtUnidade
      status
    }
  }
`;

// GRUPOS

export const UPSERT_GRUPOS = gql`
  mutation upsertGrupoItem($grupoInput: ErpGrupoItemInput!) {
    upsertGrupoItem(input: $grupoInput) {
      company
      id
      name
      status
    }
  }
`;

export const STATUS_GRUPO = gql`
  mutation statusGrupoItem($id: Int!, $status: String!) {
    statusGrupoItem(id: $id, status: $status) {
      id
      status
    }
  }
`;

//PRODUCTS
export const GET_ITENS = gql`
  query ($status: String) {
    getErpItens(status: $status) {
      id
      name
      description
      grupoId
      descGrupo
      categoriaId
      tipoId
      unidadeId
      imgpath
      marca
      vlItem
      tpDisposicao
      opcoes
      sif
      descArmazenamento
      descFornecedor
      descGrupo
      description
      status
      temSif
      temLote
      temValidade
      temFornecedor
    }
  }
`;

export const UPSERT_ITENS = gql`
  mutation upsertErpItem($itemInput: ErpItemInput!) {
    upsertErpItem(input: $itemInput) {
      id
      name
      description
      grupoId
      descGrupo
      categoriaId
      tipoId
      unidadeId
      imgpath
      marca
      status
      descFornecedor
      descArmazenamento
      sif
    }
  }
`;

export const STATUS_ITEM = gql`
  mutation statusErpItem($id: Int!, $status: String!) {
    statusErpItem(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const UPDATE_PATH_IMG = gql`
  mutation updateItemImg($id: Int!, $pathImage: String!) {
    updateItemImg(id: $id, pathImage: $pathImage) {
      id
      imgpath
    }
  }
`;

// FORNECEDOR

export const UPSERT_CADASTRO_FORNECEDOR = gql`
  mutation upsertCadastro($cadastroInput: CadastroInput!) {
    upsertCadastro(input: $cadastroInput) {
      company
      id
      name
      fantasia
      phone
      email
      rgie
      cpfcnpj
      cep
      state
      cityId
      bairro
      endereco
      numero
      complemento
      dtCadastro
      imgurl
      celPhone
      status
      ehCliente
      ehFornecedor
      ehParceiro
      tpPessoa
    }
  }
`;

export const GET_CADASTRO_FORNECEDOR = gql`
  query (
    $id: Int
    $status: String
    $cpfcnpj: String
    $ehCliente: Boolean
    $ehFornecedor: Boolean
    $ehParceiro: Boolean
    $page: Int
    $qtPerPage: Int
    $searchText: String
  ) {
    getCadastro(
      id: $id
      status: $status
      cpfcnpj: $cpfcnpj
      ehCliente: $ehCliente
      ehFornecedor: $ehFornecedor
      ehParceiro: $ehParceiro
      page: $page
      qtPerPage: $qtPerPage
      searchText: $searchText
    ) {
      company
      id
      name
      fantasia
      phone
      email
      rgie
      cpfcnpj
      cep
      state
      cityId
      bairro
      endereco
      numero
      complemento
      dtCadastro
      imgurl
      celPhone
      status
      ehCliente
      ehFornecedor
      ehParceiro
      tpPessoa
      totPages
      totRegisters
    }
  }
`;

//COMPANY

export const GET_CADASTRO_COMPANY = gql`
  query (
    $id: Int
    $status: String
    $cpfcnpj: String
    $ehCliente: Boolean
    $ehFornecedor: Boolean
    $ehParceiro: Boolean
    $page: Int
    $qtPerPage: Int
    $searchText: String
  ) {
    getCadastro(
      id: $id
      status: $status
      cpfcnpj: $cpfcnpj
      ehCliente: $ehCliente
      ehFornecedor: $ehFornecedor
      ehParceiro: $ehParceiro
      page: $page
      qtPerPage: $qtPerPage
      searchText: $searchText
    ) {
      company
      id
      name
      fantasia
      phone
      email
      rgie
      cpfcnpj
      cep
      state
      cityId
      bairro
      endereco
      numero
      complemento
      dtCadastro
      imgurl
      celPhone
      status
      ehCliente
      ehFornecedor
      ehParceiro
      tpPessoa
      totPages
      totRegisters
    }
  }
`;

// USUÁRIOS
export const CHECK_LOGIN = gql`
  query ($login: String!) {
    checkLogin(login: $login)
  }
`;

export const GET_CADASTRO_USER = gql`
  query ($cadastroId: Int!, $login: String) {
    getCadastroUser(cadastroId: $cadastroId, login: $login) {
      cadastroId
      login
      status
      user {
        name
        email
        groupId
      }
    }
  }
`;

export const GET_USER = gql`
  query ($login: String!) {
    getUser(login: $login) {
      name
      email
      imgurl
    }
  }
`;

export const UPSERT_CADASTRO_USER = gql`
  mutation upsertCadastroUser($input: ErpCadastroUserInput!) {
    upsertCadastroUser(input: $input) {
      cadastroId
    }
  }
`;

export const UPSERT_USER = gql`
  mutation upsertUser($userInput: UserInput!) {
    upsertUser(input: $userInput) {
      company
      login
    }
  }
`;

// RELACIONAMENTO TIPO DE ARMAZENAMENTO => PRODUTO ID

export const GET_ARMAZENAMENTO_BY_PRODUTO = gql`
  query ($itemId: Int, $armazenamentoId: Int) {
    getErpItemArmazenamento(
      itemId: $itemId
      armazenamentoId: $armazenamentoId
    ) {
      itemId
      armazenamentoId
      validMeses
      validDias
      validHoras
      validMinutos
      status
      item {
        id
        name
      }
      armazenamento {
        id
        name
      }
    }
  }
`;

export const UPSERT_ARMAZENAMENTO_PRODUTO = gql`
  mutation upsertErpItemArmazenamento($input: ErpItemArmazenamentoInput!) {
    upsertErpItemArmazenamento(input: $input) {
      itemId
      armazenamentoId
    }
  }
`;

export const GET_PRODUTOS_ARMAZENAMENTO = gql`
  query ($armazenamentoId: Int!, $status: String) {
    getItensByArmazenamentoId(
      armazenamentoId: $armazenamentoId
      status: $status
    ) {
      id
      name
      description
      grupoId
      categoriaId
      tipoId
      unidadeId
      imgpath
      marca
      vlItem
      tpDisposicao
      opcoes
      status
    }
  }
`;
