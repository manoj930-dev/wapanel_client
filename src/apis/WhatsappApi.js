import axios from "axios";
import { toast } from "react-toastify";

const wa_api = axios.create({
  baseURL: "http://localhost:5001/api",
});

wa_api.interceptors.response.use(
  (response) => response,
  (error) => {
    const code = error?.response?.data?.code;
    const status = error?.response?.status;

    if (
      code === "SESSION_EXPIRED" ||
      status === 401 ||
      status === 440
    ) {
      // 🔥 FORCE LOGOUT
      localStorage.removeItem("wa_token");
      localStorage.removeItem("wa_step");

      toast.error("WhatsApp session expired. Please login again.");

      setTimeout(() => {
        window.location.href = "/whatsapp";
      }, 1200);
    }

    return Promise.reject(error);
  }
);

export default wa_api;
