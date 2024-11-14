import React, { useMemo } from "react";

import { Etiqueta } from "@src/lib/types";
import { dateToBRL, returnValueOrDefaultValue } from "@src/utils/functions";
import { GET_CADASTRO_COMPANY } from "@src/lib/graphql/consts";
import { useQuery } from "@apollo/client";

interface TagModelToPrintProps {
  values: Etiqueta;
  products?: { value: number; caption: string }[];
  //   armazenamentos?: { value: number; caption: string }[];
  productName?: string;
  qtEtiquetas: number;
  nameUser?: string;
  id?: string;
  names?: {
    login: string;
    name: string;
  }[];
}

const TagModelToPrint: React.FC<TagModelToPrintProps> = ({
  values,
  products,
  productName,
  nameUser,
  names,
  id,
}) => {
  const { data: dbCadastroCompany } = useQuery(GET_CADASTRO_COMPANY, {
    variables: { status: "ATIVO", id: values?.cadastroId },
  });

  return (
    <div
      id={id}
      className=" flex flex-col justify-between p-5 mr-3 w-[22rem] h-[28rem] max-lg:my-5 rounded-md border border-neutral-500 text-gray-800 "
    >
      <div className="flex justify-between font-bold items-center ">
        <h1 className="text-xl">
          {productName
            ? productName
            : values?.itemId && products
            ? products.find((item) => item.value === values.itemId)?.caption
            : "Nome do Produto"}
        </h1>
      </div>
      <div className="flex justify-between text-base items-center">
        <label className="font-bold">Forn/Marca:</label>
        <label className="font-normal">
          {returnValueOrDefaultValue(
            values?.descFornecedor,
            "Nome do Fornecedor/Marca"
          )}
        </label>
      </div>
      <div className="flex flex-col font-bold">
        <label className="text-base">
          Quantidade:{" "}
          {values.qtProduto &&
            values?.unidade &&
            ` ${values.qtProduto} ${values?.unidade}`}
        </label>
        <label className="text-base">
          Válido até:{" "}
          {returnValueOrDefaultValue(
            dateToBRL(values?.dtValidade),
            " 00/00/0000 "
          )}
          - {returnValueOrDefaultValue(values?.hrValidade, " 00h00")}
        </label>
      </div>
      <div className="border w-full border-black" />
      <div className="flex flex-col">
        <div className="flex justify-between text-base items-center">
          <label className="font-bold">Validade Original:</label>
          <label className="font-normal">
            {dateToBRL(values?.dtValidadeOriginal) ?? "00/00/0000"}
          </label>
        </div>
        <div className="flex justify-between text-base items-center">
          <label className="font-bold">Manipulado em:</label>
          <label className="font-normal">
            {returnValueOrDefaultValue(
              dateToBRL(values?.dtManipulacao),
              " 00/00/0000 "
            )}
            - {returnValueOrDefaultValue(values?.hrManipulacao, " 00h00")}
          </label>
        </div>
        <div className="flex justify-between text-base items-center">
          <label className="font-bold">Armazenamento: </label>
          <span>&nbsp;</span>
          <label className="font-normal">
            {values?.descArmazenamento && values?.descArmazenamento}
          </label>
        </div>

        {values?.lote && (
          <div className="flex justify-between text-base items-center">
            <label className="font-bold">LOTE:</label>
            <label className="font-normal">{values?.lote}</label>
          </div>
        )}

        {values?.sif && (
          <div className="flex justify-between text-base items-center">
            <label className="font-bold">SIF:</label>
            <label className="font-normal">{values?.sif}</label>
          </div>
        )}
      </div>
      <div className="flex justify-between h-40">
        <div className="flex flex-col justify-between w-[100%] mt-2">
          <div className="border w-full border-black z-50" />
          <div className="flex text-base items-center">
            <label className="font-bold">Responsável: </label>
            <span>&nbsp;</span>
            <label className="font-normal text-xs">
              {nameUser
                ? nameUser
                : values?.login
                ? names?.find((name) => name?.login === values.login)?.name
                : "Nome do Responsável"}
            </label>
          </div>
          <div className="flex flex-col text-sm">
            <div className="flex items-center">
              <label className="font-bold">Empresa: </label>
              <span>&nbsp;</span>
              <label className="font-normal">
                {dbCadastroCompany?.getCadastro[0]?.fantasia}
              </label>
            </div>
            <div className="flex items-center">
              <label className="font-bold">CNPJ: </label>
              <span>&nbsp;</span>
              <label className="font-normal">
                {dbCadastroCompany?.getCadastro[0]?.cpfcnpj}
              </label>
            </div>
            <div className="flex items-center">
              <label className="font-bold">CEP: </label>
              <span>&nbsp;</span>
              <label className="font-normal">
                {dbCadastroCompany?.getCadastro[0]?.cep}
              </label>
            </div>
            <label>
              {dbCadastroCompany?.getCadastro[0]?.endereco},{" "}
              {dbCadastroCompany?.getCadastro[0]?.numero}
            </label>
            <label>
              {dbCadastroCompany?.getCadastro[0]?.bairro} |{" "}
              {dbCadastroCompany?.getCadastro[0]?.state}
            </label>
          </div>
          {values.remessaId && (
            <div className="h-[100%] w-[100%] mt-4 flex flex-col justify-center items-center border-black bg-slate-300">
              <label className="text-sm ">{values?.remessaId}</label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagModelToPrint;
