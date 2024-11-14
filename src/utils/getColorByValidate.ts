export const colorWillExpire = "#FFA800 ";
export const colorExpired = "#FF0505 ";
export const colorOntime = "#98CB08 ";

export const getColorByValidate = (
  validateDateString: string
): [string, StatusValidation] => {
  if (!validateDateString) return ["", StatusValidation.expired];

  const day = new Date();
  day.setHours(0, 0, 0, 0);

  const validateDateParts = validateDateString.split("/");
  if (validateDateParts.length !== 3) {
    return [colorExpired, StatusValidation.expired];
  }

  const validateDate = new Date(
    parseInt(validateDateParts[2]),
    parseInt(validateDateParts[1]) - 1,
    parseInt(validateDateParts[0])
  );

  validateDate.setHours(0, 0, 0, 0);
  const tomorrow = new Date(day);
  tomorrow.setDate(day.getDate() + 1);

  if (validateDate.getTime() < day.getTime())
    return [colorExpired, StatusValidation.expired];

  if (validateDate.getTime() === day.getTime())
    return [colorWillExpire, StatusValidation.willExpiredToday];

  if (validateDate.getTime() === tomorrow.getTime())
    return [colorWillExpire, StatusValidation.willExpired];

  if (validateDate.getTime() > tomorrow.getTime())
    return [colorOntime, StatusValidation.onTime];

  return ["", StatusValidation.expired];
};

export enum StatusValidation {
  expired = "VENCIDO",
  willExpired = "VENCE AMANHÃ",
  willExpiredToday = "VENCE HOJE",
  onTime = "NO PRAZO",
}
