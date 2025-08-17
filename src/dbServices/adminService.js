import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const adminServices = {
  getAllAdmins: async (token) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar usuários administradores:", error);
      throw error;
    }
  },

  // --- NOVA FUNÇÃO ADICIONADA AQUI ---
  getCurrentAdmin: async (token) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}admin/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados do admin logado:", error);
      throw error;
    }
  },
};

export default adminServices;