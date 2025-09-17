import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const valorizationServices = {
  /**
   * Busca a configuração atual de valorização.
   */
  getConfig: async (token) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}valorization/config`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar configuração de valorização:", error);
      throw error.response?.data || error;
    }
  },

  /**
   * Atualiza a configuração de valorização.
   * @param {string} token - O token de autenticação.
   * @param {object} configData - Os dados para atualizar. Ex: { valorizationTime: "23:00:00", valorizationStatus: true }
   */
  updateConfig: async (token, configData) => {
    try {
      const response = await axios.put(
        `${BASE_ROUTE}valorization/config`,
        configData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar configuração de valorização:", error);
      throw error.response?.data || error;
    }
  },
};

export default valorizationServices;
