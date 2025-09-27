import api from "./api/api";

const extractServices = {
  getExtracts: async (idCliente) => {
    try {
      const response = await api.get("extract", {
        headers: { "Client-ID-Ref": idCliente },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter extrato:", error);
      throw error;
    }
  },
};

export default extractServices;
