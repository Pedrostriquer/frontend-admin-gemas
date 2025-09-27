import api from "./api/api";

const valorizationServices = {
  getConfig: async () => {
    try {
      const response = await api.get("valorization/config");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar configuração de valorização:", error);
      throw error.response?.data || error;
    }
  },

  updateConfig: async (configData) => {
    try {
      const response = await api.put("valorization/config", configData);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar configuração de valorização:", error);
      throw error.response?.data || error;
    }
  },
};

export default valorizationServices;