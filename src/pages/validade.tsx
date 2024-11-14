import Menu from "@components/Menu";
import Button from "@components/button";
import DashboardBox from "@components/dashboardBox";
import DynamicTable from "@components/DynamicTable";
import Input from "@components/Input";
import Icon from "@utils/Icons";
import { productBox, TableValidateTagsSchema } from "@utils/data";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Etiqueta as EtiquetaTypes, StatusTagEnum } from "@src/lib/types";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_ETIQUETA, GET_ETIQUETAS } from "@src/lib/graphql/consts";
import {
  getColorByValidate,
  StatusValidation,
} from "@src/utils/getColorByValidate";
import { dateToBRL } from "@src/utils/functions";
import TagsMappedCard from "@src/components/TagsMappedCard";
import showNotification from "@src/utils/notifications";
import ConfirmAlert from "@src/components/ConfirmAlert";
import { colors } from "@src/utils/theme";
import Spin from "@src/components/Spin";

export default function Validade() {
  const [isList, setIsList] = useState(false);
  const [deleteEtiqueta] = useMutation(DELETE_ETIQUETA);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState(false);
  const [etiquetas, setEtiquetas] = useState<EtiquetaTypes[]>([]);
  const [statusToFilter, setStatusToFilter] = useState<StatusTagEnum | "">("");

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const toggleType = () => {
    setIsList(!isList);
  };

  const { data: mainDB, refetch } = useQuery(GET_ETIQUETAS, {
    variables: !statusToFilter ? {} : { status: statusToFilter },
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

  const tagsExpired: EtiquetaTypes[] = useMemo(() => {
    return etiquetas.filter((tag) => {
      const [, statusByValidate] = getColorByValidate(
        dateToBRL(tag?.dtValidade)
      );
      return statusByValidate === StatusValidation.expired;
    });
  }, [etiquetas]);

  const tagsExpiresToday: EtiquetaTypes[] = useMemo(() => {
    return etiquetas.filter((tag) => {
      const [, statusByValidate] = getColorByValidate(
        dateToBRL(tag?.dtValidade)
      );
      return statusByValidate === StatusValidation.willExpiredToday;
    });
  }, [etiquetas]);

  const tagsExpiresTomorrow: EtiquetaTypes[] = useMemo(() => {
    return etiquetas.filter((tag) => {
      const [, statusByValidate] = getColorByValidate(
        dateToBRL(tag?.dtValidade)
      );
      return statusByValidate === StatusValidation.willExpired;
    });
  }, [etiquetas]);

  const tagsOnTime: EtiquetaTypes[] = useMemo(() => {
    return etiquetas.filter((tag) => {
      const [, statusByValidate] = getColorByValidate(
        dateToBRL(tag?.dtValidade)
      );
      return statusByValidate === StatusValidation.onTime;
    });
  }, [etiquetas]);

  useEffect(() => {
    if (etiquetas?.length > 0) {
      const uniqueMap = new Map(); // Usamos um Map para manter os objetos únicos

      etiquetas.forEach((item) => {
        // Usamos grupoId como chave. Se o grupoId já existir, o objeto não será adicionado novamente
        if (!uniqueMap.has(item.grupoId)) {
          uniqueMap.set(item.grupoId, item);
        }
      });
    }
  }, [etiquetas]);

  const handleDeleteTag = useCallback((cadastroId: number, id: number) => {
    deleteEtiqueta({
      variables: { cadastroId, id },
      update(cache) {
        showNotification("Etiqueta deletada com sucesso!", "success");
        setIsDeleteAlertOpen(false);
        refetch();
      },
      onError(error) {
        showNotification("Erro ao deletar etiqueta", "error");
        setIsDeleteAlertOpen(false);
      },
    });
  }, []);

  return (
    <Menu page="validade">
      {!etiquetas?.length && (
        <div className="fixed inset-0 z-[100]">
          <Spin msg={"Buscando dados, aguarde..."} />
        </div>
      )}
      <div className="flex flex-col justify-start  p-5 min-h-screen">
        <h1 className="text-[#242168] text-2xl font-bold">
          Controle de Validades
        </h1>
        <div className="flex max-lg:flex-col justify-between pb-4 overflow-x-auto">
          <DashboardBox
            item={{
              icon: "cube-three",
              value: etiquetas?.length,
              text: "Produtos Cadastrados",
            }}
          />
          <DashboardBox
            item={{
              icon: "cube-alert",
              value: tagsExpiresToday?.length,
              text: "Vencem Hoje",
            }}
          />
          <DashboardBox
            item={{
              icon: "cube-cancel",
              value: tagsExpired?.length,
              text: "Produtos Vencidos",
            }}
          />
          <DashboardBox
            item={{
              icon: "cube-timer",
              value: tagsOnTime?.length + tagsExpiresTomorrow?.length,
              text: "Produtos na Validade",
            }}
          />
          <DashboardBox
            item={{
              icon: "clock",
              value: "5d",
              text: "Tempo médio de Armazenamento",
            }}
          />
        </div>
        <div className="flex max-lg:flex-col justify-between pt-2">
          <div className="lg:w-3/4 flex  max-lg:py-2 ">
            <div className="w-full border">
              <Input
                label="Pesquise pelo nome do produto"
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
          {/* <div className="lg:w-1/4 flex lg:ml-2 max-lg:py-2">
            <div className="w-full">
              <Input
                label="Últimos Cadastrados"
                placeholder="label"
                type="text"
                showTopLabel={false}
              />
            </div>
            <div className="w-10 h-10 rounded-md bg-zinc-400 p-2.5 ml-2">
              <Icon name="filter" color="white" size={20} />
            </div>
          </div> */}
        </div>
        <div className="flex-wrap whitespace-pre-wrap">
          <div className="flex flex-row w-full justify-between py-4">
            <div className="flex items-center ps-6">
              {isChecked && (
                <div className="flex items-center justify-between pl-2">
                  <button className="bg-[#041B63] w-[5.5rem] py-1 mx-2 text-white text-xs rounded-md ">
                    Baixar
                  </button>
                  <button className="bg-[#041B63] w-[5.5rem] py-1 mx-2 text-white text-xs rounded-md ">
                    Re-imprimir
                  </button>
                  <button
                    onClick={() => setIsDeleteAlertOpen(true)}
                    className="bg-[#041B63] w-[5.5rem] py-1 mx-2 text-white text-xs rounded-md "
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
            <div className="sm:flex-wrap flex justify-between w-full items-center">
              <div className="flex max-sm:flex-wrap items-center gap-4 p-4">
                <span className="text-xl font-semibold">Filtros:</span>
                <Button
                  backgroundColor={colors.primary}
                  className="border-l-rose-950"
                  onClick={() => setStatusToFilter("")}
                >
                  Todos
                </Button>
                <Button
                  backgroundColor={colors.secondary}
                  onClick={() => setStatusToFilter(StatusTagEnum.ATIVO)}
                >
                  Ativos
                </Button>
                <Button
                  backgroundColor={"#ebcc51"}
                  onClick={() => setStatusToFilter(StatusTagEnum.BAIXADO)}
                >
                  Baixados
                </Button>
                <Button
                  backgroundColor={colors.gray}
                  onClick={() => setStatusToFilter(StatusTagEnum.EXCLUÍDO)}
                >
                  Excluídos
                </Button>
              </div>
              <div>
                <label className="text-sm text-gray-400 font-medium">
                  {etiquetas?.length} registros
                </label>
                <button
                  className="ml-3 px-4 h-7 bg-gray-400 rounded-md"
                  onClick={() => setIsList(false)}
                >
                  <div className="flex flex-row text-white items-center">
                    <Icon name={"list-bullet"} color="white" />
                    <span className="text-sm text-white font-medium ml-3">
                      {"KanBan"}
                    </span>
                  </div>
                </button>
                <button
                  className="ml-3 px-4 h-7 bg-gray-400 rounded-md"
                  onClick={() => setIsList(true)}
                >
                  <div className="flex flex-row text-white items-center">
                    <Icon name={"table-cells"} color="white" />
                    <span className="text-sm text-white font-medium ml-3">
                      {"Lista"}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          {isList ? (
            <DynamicTable
              columns={TableValidateTagsSchema}
              data={etiquetas}
              label="Tabela de validades"
              showTopLabel={false}
              hasCheck
              hasEye
              hasEdit
              hasDelete
              hasPrinter
            />
          ) : (
            <div className="overflow-x-scroll min-w-full">
              <div className="grid grid-cols-4 gap-x-4 w-[70rem] min-w-full">
                <div className="flex flex-row justify-between items-center w-[19rem] mb-2">
                  <h3 className="text-base font-black text-gray-800">
                    Vencidos
                  </h3>
                </div>
                <div className="flex flex-row justify-between items-center w-[19rem] mb-2">
                  <h3 className="text-base font-black text-gray-800">
                    Vencem hoje
                  </h3>
                </div>
                <div className="flex flex-row justify-between items-center w-[19rem] mb-2">
                  <h3 className="text-base font-black text-gray-800">
                    Vencem em Breve
                  </h3>
                </div>
                <div className="flex flex-row justify-between items-center  w-[19rem] mb-2">
                  <h3 className="text-base font-black text-gray-800">
                    Dentro do Vencimento
                  </h3>
                </div>

                <TagsMappedCard listTags={tagsExpired} refetch={refetch} />
                <TagsMappedCard listTags={tagsExpiresToday} refetch={refetch} />
                <TagsMappedCard
                  listTags={tagsExpiresTomorrow}
                  refetch={refetch}
                />
                <TagsMappedCard listTags={tagsOnTime} refetch={refetch} />
              </div>
            </div>
          )}
        </div>
      </div>
      <ConfirmAlert
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onConfirm={() => handleDeleteTag(1, 1)}
        title={"Tem certeza que deseja excluir essa etiqueta?"}
      />
    </Menu>
  );
}
