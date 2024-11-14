/***
 * TELA DE CADASTRO DE MODELOS
 * TODO:
 *   -->
 */

import React, { useEffect, useState, useCallback } from "react";
import { useQuery } from "@apollo/client";

import AccordionItem from "@components/accordionItem";
import EtiquetaCard from "@components/etiqueta";
import Icon from "@utils/Icons";
import Input from "@components/Input";
import Menu from "@components/Menu";
import NavButton from "@components/NavButton";

import { Etiqueta } from "@lib/types";
import { GET_ETIQUETAS } from "@lib/graphql/consts";

const TagGestaoScreen = () => {
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [groups, setGroups] = useState<{ value: number; caption: string }[]>(
    []
  );

  const { data: mainDB, refetch } = useQuery(GET_ETIQUETAS, {
    variables: { status: "ATIVO" },
  });

  useEffect(() => {
    setEtiquetas([]);
    if (mainDB && mainDB.getErpEtiqueta && mainDB.getErpEtiqueta.length > 0) {
      setEtiquetas([...mainDB.getErpEtiqueta]);
    }
  }, [mainDB]);

  const searchTags = useCallback(
    (value: string) => {
      if (value === "") {
        return setEtiquetas([...mainDB.getErpEtiqueta]);
      }

      const filteredsTags = [...mainDB.getErpEtiqueta]?.filter((tag) =>
        tag.descItem
          ?.toLocaleLowerCase()
          .includes(value.toLocaleLowerCase().trim())
      );

      setEtiquetas(filteredsTags);
    },
    [mainDB, etiquetas]
  );

  useEffect(() => {
    setGroups([]);
    if (etiquetas.length > 0) {
      const uniqueMap = new Map(); // Usamos um Map para manter os objetos únicos

      etiquetas.forEach((item) => {
        // Usamos grupoId como chave. Se o grupoId já existir, o objeto não será adicionado novamente
        if (!uniqueMap.has(item.grupoId)) {
          uniqueMap.set(item.grupoId, item);
        }
      });

      // Convertendo os valores do Map de volta para um array
      const uniqueArray = Array.from(uniqueMap.values());

      // Ordenando o array resultante por descGrupo
      setGroups([
        ...uniqueArray
          .sort((a, b) => a.descGrupo.localeCompare(b.descGrupo))
          .map((et) => ({ value: et.grupoId, caption: et.descGrupo })),
      ]);
    }
  }, [etiquetas]);

  return (
    // <Menu page="">
    <div className="flex flex-col justify-between p-5">
      <h1 className="text-[#242168] text-2xl font-bold">Gestão de Etiquetas</h1>
      <div className="flex max-lg:flex-col justify-between py-2">
        <div className="lg:w-[59%] flex  max-lg:py-2 ">
          <div className="w-full">
            <Input
              label="Pesquisa"
              placeholder="label"
              type="text"
              showTopLabel={false}
              onChange={(e) => searchTags(e.target?.value)}
            />
          </div>
          <div className="w-10 h-10 rounded-md bg-zinc-400 p-2.5 ml-2">
            <Icon name="magnify" color="white" size={20} />
          </div>
        </div>

        <NavButton label="Nova Etiqueta" href="/cadastro/etiqueta" />
      </div>
      <div className="lg:mt-10">
        <div className="hs-accordion-group">
          {groups.map((gr, index) => (
            <AccordionItem
              key={`grp-${index}`}
              title={gr.caption}
              block
              index={index}
            >
              <div className="grid grid-rows-1 grid-flow-col gap-4 overflow-x-auto scrollbar p-2">
                {etiquetas
                  .filter((e) => e.grupoId === gr.value)
                  .map((item, index) => (
                    <EtiquetaCard
                      cadastroId={item?.cadastroId}
                      label={item?.descItem ? item.descItem : "Sem descrição"}
                      id={item?.id}
                      qtProduto={item?.qtProduto}
                      unidade={item?.unidade}
                      dtManipulacao={item?.dtManipulacao}
                      //@ts-expect-error
                      validade={item?.validade}
                      dtValidade={item?.dtValidade}
                      dtImpressao={item?.dtImpressao}
                      descFornecedor={item?.descFornecedor}
                      status={item?.status}
                      className="mx-2"
                      key={index}
                      refetch={refetch}
                      dtValidadeOriginal={item?.dtValidadeOriginal}
                      login={item?.login}
                      remessaId={item?.remessaId ?? "Sem ID"}
                      descArmazenamento={
                        item?.descArmazenamento ?? "Sem descrição"
                      }
                    />
                  ))}
              </div>
            </AccordionItem>
          ))}
        </div>
      </div>
    </div>
    // </Menu>
  );
};

export default TagGestaoScreen;
