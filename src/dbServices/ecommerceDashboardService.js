import api from "./api/api";

const ecommerceDashboardService = {
  getDashboardData: async () => {
    try {
      const response = await api.get("ecommerce/dashboard");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard de e-commerce:", error);
      throw error.response?.data || error;
    }
  },
};

export default ecommerceDashboardService;
