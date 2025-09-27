import api from "./api/api";

const indicationService = {
  getRule: async () => {
    try {
      const response = await api.get("indicationrule");
      return response.data;
    } catch (error) {
      console.error("Erro ao obter regra de indicação:", error);
      throw error;
    }
  },

  updateRule: async (ruleData) => {
    try {
      const response = await api.put("indicationrule", ruleData);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar regra de indicação:", error);
      throw error;
    }
  },
};

export default indicationService;
