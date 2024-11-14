import { ErrorType, NumberProps } from "@lib/types";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Estende dayjs para suportar o parsing de formatos customizados
dayjs.extend(customParseFormat);

export function areAllErrorsEmpty(errors: { [key: string]: string }): boolean {
  for (let key in errors) {
    if (errors.hasOwnProperty(key) && errors[key] !== "") {
      return false;
    }
  }
  return true;
}

export function convertDateFormat(dateString: string): string {
  // Parseia a data usando o formato DD/MM/YYYY
  const date = dayjs(dateString, "DD/MM/YYYY");

  // Retorna a data formatada para YYYY-MM-DD
  return date.format("YYYY-MM-DD");
}

export function dateToBRL(dateString?: string): string {
  if (!dateString) return "";
  // Parseia a data usando o formato DD/MM/YYYY
  const date = dayjs(dateString, "YYYY-MM-DD");

  // Retorna a data formatada para YYYY-MM-DD
  return date.format("DD/MM/YYYY");
}

export function formatToBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Valida se uma string está no formato DD/MM/YYYY e representa uma data válida.
 *
 * @param dateString A string da data a ser validada.
 * @returns `true` se a string for uma data válida no formato especificado, caso contrário `false`.
 */
export function isValidDate(dateString: string): boolean {
  // Tenta parsear a string usando o formato especificado
  const date = dayjs(dateString, "DD/MM/YYYY", true);

  // Verifica se o parsing foi bem-sucedido e a data é válida
  if (!date.isValid()) {
    return false;
  }

  // Verifica se a string original corresponde à data formatada para evitar falsos positivos
  // como "30/02/2020" que poderia ser interpretado como "02/03/2020"
  return dateString === date.format("DD/MM/YYYY");
}

/**
 * Valida se uma string é um número, incluindo inteiros e pontos flutuantes.
 *
 * @param numString A string a ser validada.
 * @returns `true` se a string for um número válido, caso contrário `false`.
 */
export function isValidNumber(numberString: string): boolean {
  // Remove os pontos usados como separadores de milhar
  const withoutThousandsSeparator = numberString.replace(/\./g, "");

  // Substitui a vírgula por um ponto para obter o formato decimal correto
  const formattedNumberString = withoutThousandsSeparator.replace(",", ".");

  // Tenta converter a string formatada em um número
  const number = Number(formattedNumberString);

  // Verifica se o resultado é um número válido e não é NaN
  if (isNaN(number)) {
    return false;
  }

  // Verifica se a string formatada corresponde ao número formatado,
  // para evitar falsos positivos como "01.000,00" ou "1,1,1"
  return formattedNumberString === number.toString();
}

export function retNumber(numberString: string): number {
  // Remove os pontos usados como separadores de milhar
  const withoutThousandsSeparator = numberString.replace(/\./g, "");

  // Substitui a vírgula por um ponto para obter o formato decimal correto
  const formattedNumberString = withoutThousandsSeparator.replace(",", ".");

  // Tenta converter a string formatada em um número
  const number = Number(formattedNumberString);

  // Verifica se o resultado é um número válido e não é NaN
  if (isNaN(number)) {
    return 0;
  } else {
    return number;
  }
}

export function isValidTime(timeString: string): boolean {
  // Tenta parsear a string usando o formato especificado
  const time = dayjs(timeString, "HH:mm", true);

  // Verifica se o parsing foi bem-sucedido e o horário é válido
  if (!time.isValid()) {
    return false;
  }

  // Verifica se a string original corresponde ao horário formatado
  // para evitar falsos positivos como "24:00" ou "12:60"
  return timeString === time.format("HH:mm");
}

export const maskedValue = (
  value?: string,
  mask?: string,
  number?: NumberProps
): string => {
  if (!value) return "";
  let v: string = value.replace(/\D/g, "");

  if (v === "") return "";

  let newValue: string = "";
  let newMask: string = mask ? mask : "";

  if (number) {
    let vTo: string = number.size ? v.substring(0, number.size) : v;

    vTo = putZeros(vTo.toString(), (number.decimals || 0) + 1);

    const dec: string =
      number.decimals > 0 ? vTo.slice(number.decimals * -1) : "";

    const milhar: string = vTo
      .substring(0, vTo.length - (number.decimals || 0))
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    newValue = number.decimals > 0 ? `${milhar},${dec}` : milhar;
  } else {
    let contZero = 0;
    for (var i = 0; i < newMask.length; i++) {
      if (contZero < v.length) {
        if (newMask.substr(i, 1) === "0") {
          newValue += v.substr(contZero, 1);
          contZero++;
        } else {
          newValue += newMask.substr(i, 1);
        }
      }
    }
  }

  return newValue;
};

function putZeros(value: string, minLength: number): string {
  while (value.length < minLength) {
    value = "0" + value;
  }
  return value;
}

export function validateFields<T>(
  values: T,
  requiredFields: Partial<Record<keyof T, boolean>>
): ErrorType<T> {
  const errors: ErrorType<T> = {};

  for (const key in requiredFields) {
    const value = values[key];
    const isFieldRequired = requiredFields[key];
    const isFieldEmpty =
      value === undefined ||
      value === "" ||
      (typeof value === "number" && value === 0);

    if (isFieldRequired && isFieldEmpty) {
      errors[key] = `${key} não preenchido!`;
    }
  }

  return errors;
}

export function validarEmail(email: string): boolean {
  const regex = /^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w+$/;
  return regex.test(email);
}

export const returnValueOrDefaultValue = (
  value: string | number | undefined,
  defaultValue: string
) => {
  if (!value) return defaultValue;

  return value;
};
