import { useRef, useState } from "react";

import Icon from "@utils/Icons";
import { useMutation } from "@apollo/client";
import { dateToBRL } from "@src/utils/functions";
import { useReactToPrint } from "react-to-print";
import showNotification from "@src/utils/notifications";
import { CHANGE_STATUS_ETIQUETA } from "@src/lib/graphql/consts";
import { getColorByValidate } from "@src/utils/getColorByValidate";
import Button from "../button";
import ConfirmAlert from "../ConfirmAlert";
import TagModelToPrint from "../TagModelToPrint/TagModelToPrint";
import Input from "../Input";

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

export default function TagCardKanban({
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
  width = 250,
  height = 230,
  dtValidadeOriginal,
  hasCheck = false,
  remessaId,
  login,
}: EtiquetaProps) {
  const [deleteEtiqueta] = useMutation(CHANGE_STATUS_ETIQUETA);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [qtEtiquetasInput, setQtEtiquetasInput] = useState(1);
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
    dtValidadeOriginal,
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

  const generateCopies = () => {
    const copies = [];
    for (let i = 0; i < qtEtiquetasInput; i++) {
      copies.push(
        <TagModelToPrint
          key={i}
          qtEtiquetas={qtEtiquetasInput}
          productName={label}
          values={values}
          nameUser={login}
        />
      );
    }
    return copies;
  };

  return (
    <div
      className={`rounded-lg shadow border border-slate-200 flex justify-items-center ps-2   ${
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
          <label className="text-xs text-gray-500">
            {`${qtProduto} ${unidade}`}
          </label>
          <label className="text-xs text-gray-500">{`Status: ${status}`}</label>
        </div>
        <div className="flex flex-col">
          <div
            className="text-xs rounded-full text-white px-1 -ml-1 p-0 rounded-"
            style={{
              backgroundColor:
                !isDeleted && !isDownloaded ? colorByValidate : "inherit",
              color: isDeleted || isDownloaded ? "#6b7280" : "inherit",
            }}
          >
            Validade: {`${dateToBRL(dtValidade)}`}
          </div>
        </div>
        <div className="flex w-full items-center justify-center border">
          <span className={`text-[12px] text-gray-500`}>{remessaId}</span>
        </div>
        {!isDeleted && !isDownloaded && (
          <div className="flex  w-full items-end">
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
        <div className="container mx-auto p-4">
          <div className="flex flex-col items-center w-full border p-4 justify-center">
            <span className="text-lg font-medium">
              Insira a quantidade etiquetas para impressões:
            </span>
            <Input
              inputClass="w-40"
              label=""
              type="counter"
              value={qtEtiquetasInput}
              onCounterChange={(newValue) => {
                if (newValue > 0) setQtEtiquetasInput(newValue);
              }}
            />
          </div>
          <div className="max-h-screen overflow-auto p-4 bg-white rounded shadow">
            <div className="h-[50vh]">
              <div
                ref={printComponentRef}
                className="flex flex-col  items-center justify-center p-4"
              >
                <div>{generateCopies()}</div>
              </div>
            </div>
          </div>
        </div>
      </ConfirmAlert>
    </div>
  );
}
