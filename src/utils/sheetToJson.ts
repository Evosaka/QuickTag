import { RowDataSheets } from "@src/lib/types";
import * as XLSX from "xlsx";

export const sheetToJson = (worksheet: XLSX.WorkSheet) => {
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as Array<
    Array<string | number>
  >;

  const keys = jsonData[0] as string[];
  jsonData.shift();

  const filteredData = jsonData.filter((row) =>
    row.some((cell) => cell !== "")
  );

  const result = filteredData.map((row: Array<string | number>) => {
    const obj: RowDataSheets = {};
    keys.forEach((key, index) => {
      obj[key] = row[index];
    });
    return obj;
  });

  return result;
};
