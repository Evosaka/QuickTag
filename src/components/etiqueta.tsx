import { useRef, useState } from "react";

import Icon from "@utils/Icons";
import Button from "./button";
import ConfirmAlert from "./ConfirmAlert";
import { useMutation } from "@apollo/client";
import { dateToBRL } from "@src/utils/functions";
import { useReactToPrint } from "react-to-print";
import showNotification from "@src/utils/notifications";
import { CHANGE_STATUS_ETIQUETA } from "@src/lib/graphql/consts";
import { getColorByValidate } from "@src/utils/getColorByValidate";
import TagModelToPrint from "./TagModelToPrint/TagModelToPrint";

interface EtiquetaProps {
  cadastroId: number;
  label: string;
  id: number;
  qtProduto: number;
  unidade?: string;
  status: string;
  dtManipulacao?: string;
  dtValidade?: string;
  validade: "prazo" | "hoje" | "breve" | "vencido";
  descFornecedor?: string;
  dtImpressao?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  descArmazenamento: string;
  hasCheck?: boolean;
  login: string;
  remessaId: string;
  tpArmazenamento?: string;
  dtValidadeOriginal?: string;
  refetch: () => void;
}

export default function Etiqueta({
  label,
  cadastroId,
  refetch,
  qtProduto,
  unidade,
  id,
  dtManipulacao,
  descArmazenamento,
  tpArmazenamento,
  dtValidade,
  validade,
  status,
  descFornecedor,
  dtImpressao,
  className = "",
  width = 190,
  height = 230,
  dtValidadeOriginal,
  hasCheck = false,
  remessaId,
  login,
}: EtiquetaProps) {
  const [deleteEtiqueta] = useMutation(CHANGE_STATUS_ETIQUETA);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] =
    useState<boolean>(false);
  const [colorByValidate] = getColorByValidate(dateToBRL(dtValidade));
  const printComponentRef = useRef<HTMLDivElement>(null);
  const isDeleted = status === "EXCLUÍDO";
  const isDownloaded = status === "BAIXADO";

  const values = {
    cadastroId,
    qtProduto,
    unidade,
    id,
    dtManipulacao,
    descArmazenamento,
    dtValidade,
    descFornecedor,
    dtImpressao,
    login: "",
    itemId: 0,
    modeloId: 0,
    html: "",
    status: "Ativo",
    remessaId: "",
  };

  const handleDeleteTag = () => {
    deleteEtiqueta({
      variables: { cadastroId, id, status: "EXCLUÍDO" },
      update(cache) {
        showNotification("Etiqueta deletada com sucesso!", "success");
        setIsAlertOpen(false);
        refetch();
      },
      onError(error) {
        showNotification("Erro ao deletar etiqueta", "error");
        setIsAlertOpen(false);
      },
    });
  };

  const handleDownloadTag = () => {
    deleteEtiqueta({
      variables: { cadastroId, id, status: "BAIXADO" },
      update(cache) {
        showNotification("Etiqueta baixada com sucesso!", "success");
        setIsDownloadModalOpen(false);
        refetch();
      },
      onError(error) {
        showNotification("Erro ao baixar etiqueta", "error");
        setIsDownloadModalOpen(false);
      },
    });
  };

  const handlePrint = useReactToPrint({
    content: () => printComponentRef.current,
  });

  return (
    <div
      className={`rounded-lg shadow border border-slate-200 flex ${
        isDownloaded && "bg-amber-200"
      } ${isDeleted && "bg-stone-300"} ${hasCheck && ""} ${className} `}
      style={{ width: width, height: height }}
    >
      <div className={`p-3 pt-2 pr-1 ${!hasCheck && "hidden"}`}>
        <input
          type="checkbox"
          className="shrink-0 border-gray-200 rounded "
          id="hs-checkbox-group-1"
        />
      </div>
      <div className="flex flex-col justify-between w-full p-2">
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-500 font-bold">{label}</label>
          </div>
          <label className="text-xs text-gray-500">{`Status: ${status}`}</label>
          <label className="text-xs text-gray-500">
            {`${qtProduto} ${unidade}`}
          </label>
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500">
            {descArmazenamento && `Armazenamento: ${descArmazenamento}`}
          </label>
          <label className="text-xs text-gray-500">
            Validade Original: {dateToBRL(dtValidadeOriginal)}
          </label>
          <label className="text-xs text-gray-500">
            Manipulado em: {dateToBRL(dtManipulacao)}
          </label>
          <div
            className="text-xs rounded-full text-white px-1 -ml-1 rounded-"
            style={{
              backgroundColor:
                !isDeleted && !isDownloaded ? colorByValidate : "inherit",
              color: isDeleted || isDownloaded ? "#6b7280" : "inherit",
            }}
          >
            Validade: {`${dateToBRL(dtValidade)}`}
          </div>
          <label className="text-xs text-gray-500">
            Fornecedor: {descFornecedor}
          </label>
        </div>
        <div className="flex justify-between">
          <label className="text-xs text-gray-500">
            Impresso: {dateToBRL(dtImpressao) || "00/00/0000"}
          </label>
        </div>
        <div className="flex w-full items-center justify-center border">
          <span className={`text-[12px] text-gray-500`}>{remessaId}</span>
        </div>
        {!isDeleted && !isDownloaded && (
          <div className="flex items-center gap-1">
            <Button
              onClick={() => setIsDownloadModalOpen(true)}
              mode="outline"
              className="border-none"
            >
              <Icon name="clipboard-document-check" color="#979797" size={16} />
            </Button>
            <Button
              onClick={() => setIsAlertOpen(true)}
              mode="outline"
              className="border-none"
            >
              <Icon name="trash" color="#979797" size={16} />
            </Button>
            <Button
              onClick={() => setIsPrintModalOpen(true)}
              mode="outline"
              className="border-none"
            >
              <Icon name="printer" color="#979797" size={16} />
            </Button>
          </div>
        )}
      </div>
      <ConfirmAlert
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onConfirm={handleDownloadTag}
        title={"Tem certeza que deseja BAIXAR essa etiqueta?"}
      ></ConfirmAlert>
      <ConfirmAlert
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleDeleteTag}
        title={"Tem certeza que deseja EXCLUIR essa etiqueta?"}
      />
      <ConfirmAlert
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        onConfirm={handlePrint}
        title={"Tem certeza que deseja IMPRIMIR essa etiqueta?"}
      >
        <div
          ref={printComponentRef}
          className="flex items-center justify-center p-4"
        >
          <TagModelToPrint
            qtEtiquetas={qtProduto}
            productName={label}
            values={values}
            nameUser={login}
          />
        </div>
      </ConfirmAlert>
    </div>
  );
}
