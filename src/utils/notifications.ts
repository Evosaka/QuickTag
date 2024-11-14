import { toast } from "react-toastify";

const showNotification = (
  message: string,
  type: "success" | "error" | "info" | "warning" = "info"
) => {
  toast[type](message);
};

export default showNotification;
