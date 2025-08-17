import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const indicationService = {
  getRule: async (token) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}indicationrule`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter regra de indicação:", error);
      throw error;
    }
  },

  updateRule: async (token, ruleData) => {
    try {
      const response = await axios.put(`${BASE_ROUTE}indicationrule`, ruleData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar regra de indicação:", error);
      throw error;
    }
  },
};

export default indicationService;