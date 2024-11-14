import { v4 as uuidv4 } from "uuid";

export const generateShortId = () => {
  const uuid: string = uuidv4().replace(/-/g, "");
  return uuid.substring(0, 10);
};
