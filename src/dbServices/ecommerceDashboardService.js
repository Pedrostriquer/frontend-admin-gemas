import axios from "axios";

// Pega a URL base da sua API a partir das variáveis de ambiente
const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

/**
 * Serviço para buscar os dados consolidados do dashboard de E-commerce.
 */
const ecommerceDashboardService = {
  /**
   * Busca todos os dados necessários para o dashboard de e-commerce.
   * @param {string} token - O token JWT de um usuário administrador para autenticação.
   * @returns {Promise<object>} Um objeto contendo todas as métricas do dashboard.
   */
  getDashboardData: async (token) => {
    try {
      // Faz a requisição para o endpoint que você criou no backend
      const response = await axios.get(`${BASE_ROUTE}ecommerce/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Retorna os dados recebidos da API
      return response.data;
    } catch (error) {
      // Em caso de erro, loga no console e lança o erro para o componente tratar
      console.error("Erro ao buscar dados do dashboard de e-commerce:", error);
      throw error.response?.data || error;
    }
  },
};

export default ecommerceDashboardService;
