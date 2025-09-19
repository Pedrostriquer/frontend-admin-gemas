import axios from "axios";

// A rota base da sua API, vinda do seu arquivo .env
const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const ecommerceServices = {
  /**
   * Busca os dados do dashboard de e-commerce.
   * @param {string} token - O token de autenticação do usuário.
   * @returns {Promise<object>} Os dados do dashboard.
   */
  getDashboardData: async (token) => {
    try {
      // Faz a chamada GET para o endpoint do dashboard de e-commerce
      const response = await axios.get(`${BASE_ROUTE}ecommerce/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard de e-commerce:", error);
      throw error;
    }
  },
};

export default ecommerceServices;