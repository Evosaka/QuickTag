import EtiquetaCard from "@components/etiqueta";
import { Etiqueta as EtiquetaTypes } from "@src/lib/types";
import { TagCardKanban } from "../TagCardKanban";

const TagsMappedCard: React.FC<{
  listTags: EtiquetaTypes[];
  refetch: () => void;
}> = ({ listTags, refetch }) => {
  return (
    <>
      <div className="w-full h-[35rem] overflow-y-auto overflow-x-hidden scrollbar flex-1">
        <ul className="p-1">
          {listTags?.map((item, index) => (
            <li className="p-2" key={index}>
              <TagCardKanban
                height={160}
                width={"100%"}
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
                dtValidadeOriginal={item?.dtValidadeOriginal}
                login={item?.login}
                key={index}
                refetch={refetch}
                status={item?.status}
                remessaId={item?.remessaId ?? ""}
                descArmazenamento={item?.descArmazenamento ?? "Sem descrição"}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TagsMappedCard;
