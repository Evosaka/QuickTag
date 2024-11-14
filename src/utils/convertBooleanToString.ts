export const convertYesOrNo = (value: boolean | string) => {
  if (value === "S" || value === true) return "Sim";
  if (value === "N" || value === false) return "Não";

  return "Não";
};
