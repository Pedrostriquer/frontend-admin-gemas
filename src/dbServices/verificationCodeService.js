import api from "./api/api";

const verificationCodeService = {
  enviarCodigoDeVerificacao: async () => {
    try {
      const response = await api.post("verification/generate", {});
      return response.data;
    } catch (error) {
      console.error("Erro ao enviar código:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Falha ao enviar código"
      );
    }
  },
  sendRegistrationCode: async (email) => {
    try {
      const response = await api.post("verification/generate-for-register", {
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao enviar código de registro:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Falha ao enviar código de verificação"
      );
    }
  },
};

export default verificationCodeService;