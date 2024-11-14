import React, { useState } from "react";
import Icon from "@utils/Icons";
import {
  CheckCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { dateToBRL, formatToBRL } from "@utils/functions";

import ConfirmAlert from "../ConfirmAlert";
import { getColorByValidate } from "@src/utils/getColorByValidate";
import { convertYesOrNo } from "@src/utils/convertBooleanToString";

interface Column {
  name: string;
  key: string;
}
interface TableProps {
  data: any[];
  columns: Column[];
  label: string;
  showTopLabel?: boolean;
  className?: string;
  button?: string;
  hasEye?: boolean;
  hasEdit?: boolean;
  hasDelete?: boolean;
  hasBottom?: boolean;
  hasCheck?: boolean;
  hasPrinter?: boolean;
  max?: number;
  onDelete?: (record: any) => void;
  onEdit?: (record: any) => void;
  eyeClick?: () => void;
}

const DynamicTable: React.FC<TableProps> = ({
  data,
  columns,
  label,
  showTopLabel = true,
  className = "",
  button = "",
  hasEye = false,
  hasEdit = false,
  hasDelete = false,
  hasBottom = false,
  hasCheck = false,
  hasPrinter = false,
  max = data?.length,
  onDelete,
  onEdit,
  eyeClick,
}) => {
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [cancelRecord, setCancelRecord] = useState<any>();
  const [alertTitle, setAlertTitle] = useState<string>("Deseja cancelar?");

  const handleCancel = () => {
    onDelete ? onDelete(cancelRecord) : null;
    setIsAlertOpen(false);
  };

  return (
    <div className={`flex flex-col h-auto ${className}`}>
      <ConfirmAlert
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleCancel}
        title={alertTitle}
      />
      {showTopLabel && (
        <div className="h-6 flex flex-row mb-2">
          <label className="text-base text-gray-600 font-medium">{label}</label>
        </div>
      )}
      <div className="flex flex-col h-full justify-between rounded-xl shadow-[0px_8px_15px_0px_#00000040]">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden rounded-xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                    {hasCheck && (
                      <th scope="col" className="ps-6 py-3 text-start"></th>
                    )}
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        scope="col"
                        className={`px-5 py-3 ${
                          index < 1 || column.key === "name"
                            ? "text-left"
                            : "text-center"
                        } text-xs font-medium text-gray-500 uppercase`}
                      >
                        {column.name}
                      </th>
                    ))}
                    {(hasEye || hasEdit || hasDelete || button !== "") && (
                      <th
                        scope="col"
                        className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                      ></th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.map((item, index) => (
                    <tr key={index} className={`${index >= max && "hidden"}`}>
                      {hasCheck && (
                        <td className="h-px w-px whitespace-nowrap">
                          <div className="ps-6 py-3">
                            <label
                              htmlFor="hs-at-with-checkboxes-1"
                              className="flex"
                            >
                              <input
                                type="checkbox"
                                className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                id="hs-at-with-checkboxes-1"
                              />
                              <span className="sr-only">Checkbox</span>
                            </label>
                          </div>
                        </td>
                      )}
                      {columns.map((column, columnIndex) => {
                        const [colorByValidate] = getColorByValidate(
                          dateToBRL(item[column.key])
                        );

                        return (
                          <td
                            key={columnIndex}
                            className={`px-5 py-3 whitespace-nowrap text-sm text-gray-800 items-center ${
                              columnIndex < 1 || column.key === "name"
                                ? "text-left"
                                : "text-center"
                            }`}
                          >
                            {column.key === "value" ? (
                              formatToBRL(item[column.key])
                            ) : ["dtImpressao", "dtManipulacao"].includes(
                                column.key
                              ) ? (
                              dateToBRL(item[column.key])
                            ) : column.key === "dtValidade" ? (
                              <div
                                className="text-sm rounded-full text-white p-2  text-center"
                                style={{
                                  backgroundColor: colorByValidate,
                                }}
                              >
                                {`${dateToBRL(item[column.key])} - ${
                                  item.hrValidade
                                }`}
                              </div>
                            ) : [
                                "temSif",
                                "temLote",
                                "temValidade",
                                "temFornecedor",
                              ].includes(column.key) ? (
                              convertYesOrNo(item[column.key])
                            ) : (
                              item[column.key]
                            )}
                          </td>
                        );
                      })}
                      {(hasEye || hasEdit || hasDelete || button !== "") && (
                        <td className="gap-3 px-2 py-3 whitespace-nowrap text-right flex justify-end text-sm font-medium items-center">
                          {hasEye && (
                            <button onClick={eyeClick}>
                              <Icon name="eye" className="mx-1.5" />
                            </button>
                          )}
                          {hasEdit && (
                            <PencilSquareIcon
                              name="editicon"
                              className="h-5 w-5 text-gray-400 cursor-pointer"
                              onClick={() => {
                                const { __typename, ...restItem } = item;
                                onEdit ? onEdit(restItem) : null;
                              }}
                            />
                          )}
                          {hasDelete &&
                            (!item?.status ||
                              (item?.status && item.status === "ATIVO")) && (
                              <TrashIcon
                                name="deleteicon"
                                className="h-5 w-5 text-red-400 cursor-pointer"
                                onClick={() => {
                                  const { __typename, ...restItem } = item;
                                  setAlertTitle(
                                    item?.status
                                      ? "Deseja Cancelar?"
                                      : "Deseja Excluir?"
                                  );
                                  setCancelRecord(restItem);
                                  setIsAlertOpen(true);
                                }}
                              />
                            )}
                          {hasDelete &&
                            item?.status &&
                            item.status === "CANCELADO" && (
                              <CheckCircleIcon
                                name="activeicon"
                                className="h-5 w-5 text-green-400 cursor-pointer"
                                onClick={() => {
                                  const { __typename, ...restItem } = item;
                                  setAlertTitle("Deseja Reativar?");
                                  setCancelRecord(restItem);
                                  setIsAlertOpen(true);
                                }}
                              />
                            )}
                          {hasPrinter && (
                            <a href="#">
                              <Icon name="printer" className="mx-1.5" />
                            </a>
                          )}
                          {button !== "" && (
                            <button className="bg-[#18BCFF] text-white p-1 text-xs rounded-full">
                              {button}
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {hasBottom && (
          <div className="bg-[#18BCFF] items-center text-white flex justify-between px-5 py-3 rounded-b-lg">
            <label className="text-lg">Total</label>
            <label className="text-2xl font-semibold">R$15.000</label>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicTable;
