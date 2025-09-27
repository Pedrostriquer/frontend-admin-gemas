// src/services/clientServices.js

import api from "./api/api"; // <-- MUDANÇA: Importa a instância central 'api'

const normalizeSearchString = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const clientServices = {
  // CASO ESPECIAL: Mantém headers customizados. O token do admin é passado diretamente.
  loginAsClient: async (clientId) => {
    try {
      const response = await api.post(
        'auth/login/as-client',
        {},
        {
          headers: {
            "X-Client-ID": clientId,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao tentar logar como cliente:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`client/${id}`); // Interceptor cuida do token
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  
  getClients: async (searchFilter, pageNumber = 1, pageSize = 10) => {
    try {
      const normalizedFilter = normalizeSearchString(searchFilter);
      // Usando 'params' para uma URL mais limpa
      const response = await api.get('client/search', {
        params: { searchFilter: normalizedFilter, pageNumber, pageSize }
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  
  editClient: async (id, updates) => {
    try {
      const response = await api.patch(`client/${id}`, updates, {
        headers: { "Client-ID-Ref": id }, // Interceptor adicionará 'Authorization'
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  updateClientPartial: async (id, updates) => {
    try {
      const response = await api.patch(`client/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar parcialmente o cliente:", error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  informacoesCarteiraCliente: async (id) => {
    try {
      const response = await api.get('withdraw/client/wallet-info', {
        headers: { "Client-ID-Ref": id }, // Interceptor adicionará 'Authorization'
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  
  cadastrar: async (info) => {
    try {
      const response = await api.post('client', info);
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error.response?.data || error.message);
      throw (error.response?.data || new Error("Não foi possível completar o cadastro."));
    }
  },
  
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('verification/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error("Erro ao solicitar redefinição de senha:", error.response?.data || error.message);
      throw (error.response?.data || new Error("Não foi possível solicitar a redefinição de senha."));
    }
  },
  
  resetPassword: async (verificationCode, newPassword) => {
    try {
      const response = await api.post('client/reset-password', { verificationCode, newPassword });
      return response.data;
    } catch (error) {
      console.error("Erro ao redefinir senha:", error.response?.data || error.message);
      throw (error.response?.data || new Error("Não foi possível redefinir a senha."));
    }
  },

  addExtraBalance: async (clientId, amount, description) => {
    try {
      const response = await api.post('extra', { clientId, amount, description });
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar saldo extra:", error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  changePasswordByAdmin: async (clientId, newPassword) => {
    try {
      const response = await api.post(`client/${clientId}/change-password-admin`, { newPassword });
      return response.data;
    } catch (error) {
      console.error("Erro ao alterar senha:", error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  associateConsultant: async (clientId, consultantId) => {
    try {
      const response = await api.post(`client/${clientId}/associate-consultant/${consultantId}`, null);
      return response.data;
    } catch (error) {
      console.error("Erro ao associar consultor:", error);
      throw error.response?.data || error;
    }
  },

  removeConsultant: async (clientId) => {
    try {
      const response = await api.delete(`client/${clientId}/remove-consultant`);
      return response.data;
    } catch (error) {
      console.error("Erro ao remover consultor:", error);
      throw error.response?.data || error;
    }
  },

  deleteProfilePicture: async (id) => {
    try {
      const response = await api.delete(`client/${id}/profile-picture`);
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar a foto:", error.response?.data || error.message);
      throw (error.response?.data || new Error("Não foi possível deletar a foto."));
    }
  },

  getBankAccountByClientId: async (clientId) => {
    try {
      const response = await api.get(`BankAccount/client/${clientId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao obter conta bancária do cliente:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default clientServices;