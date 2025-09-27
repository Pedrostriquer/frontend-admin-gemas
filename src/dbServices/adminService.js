// src/services/adminServices.js

import api from "./api/api"; // <-- 1. IMPORTA A INSTÂNCIA CENTRAL

const adminServices = {
  getAllAdmins: async () => {
    try {
      // Usa 'api' e não precisa mais do header de autorização
      const response = await api.get("admin");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar usuários administradores:", error);
      throw error;
    }
  },

  getCurrentAdmin: async () => {
    try {
      const response = await api.get("admin/me");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados do admin logado:", error);
      throw error;
    }
  },
};

export default adminServices;