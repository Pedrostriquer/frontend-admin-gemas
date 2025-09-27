import api from "./api/api";

const extractDataServices = {
  downloadClientsCsv: async (searchFilter) => {
    try {
      const config = {
        responseType: "blob",
      };
      if (searchFilter) {
        config.params = { searchFilter };
      }
      const response = await api.get("ExtractData/clients", config);
      return response;
    } catch (error) {
      console.error("Erro ao baixar CSV de clientes:", error);
      throw error;
    }
  },

  downloadConsultantsCsv: async () => {
    try {
      const response = await api.get("ExtractData/consultants", {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      console.error("Erro ao baixar CSV de consultores:", error);
      throw error;
    }
  },

  downloadContractsCsv: async () => {
    try {
      const response = await api.get("ExtractData/contracts", {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      console.error("Erro ao baixar CSV de contratos:", error);
      throw error;
    }
  },

  downloadWithdrawsCsv: async () => {
    try {
      const response = await api.get("ExtractData/withdraws", {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      console.error("Erro ao baixar CSV de saques:", error);
      throw error;
    }
  },
};

export default extractDataServices;
