import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const normalizeSearchString = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const clientServices = {
  loginAsClient: async (adminToken, clientId) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}auth/login/as-client`,
        {},
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
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

  getById: async (token, id) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}client/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getClients: async (token, searchFilter, pageNumber = 1, pageSize = 10) => {
    try {
      const normalizedFilter = normalizeSearchString(searchFilter);
      const response = await axios.get(
        `${BASE_ROUTE}client/search?searchFilter=${normalizedFilter}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  editClient: async (id, updates, token) => {
    try {
      const response = await axios.patch(`${BASE_ROUTE}client/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}`, "Client-ID-Ref": id },
      });
      return response.data;
    } catch (error) {
      console.log(error);

      throw error;
    }
  },
  informacoesCarteiraCliente: async (token, id) => {
    try {
      const response = await axios.get(
        `${BASE_ROUTE}withdraw/client/wallet-info`,
        {
          headers: { Authorization: `Bearer ${token}`, "Client-ID-Ref": id },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);

      throw error;
    }
  },
  cadastrar: async (info) => {
    try {
      const response = await axios.post(`${BASE_ROUTE}client`, info);
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao cadastrar cliente:",
        error.response?.data || error.message
      );
      throw (
        error.response?.data ||
        new Error("Não foi possível completar o cadastro.")
      );
    }
  },
  requestPasswordReset: async (email) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}verification/forgot-password`,
        { email }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao solicitar redefinição de senha:",
        error.response?.data || error.message
      );
      throw (
        error.response?.data ||
        new Error("Não foi possível solicitar a redefinição de senha.")
      );
    }
  },
  resetPassword: async (verificationCode, newPassword) => {
    try {
      const response = await axios.post(`${BASE_ROUTE}client/reset-password`, {
        verificationCode,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao redefinir senha:",
        error.response?.data || error.message
      );
      throw (
        error.response?.data || new Error("Não foi possível redefinir a senha.")
      );
    }
  },
  addExtraBalance: async (token, clientId, amount, description) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}extra`,
        { clientId, amount, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao adicionar saldo extra:",
        error.response?.data || error
      );
      throw error.response?.data || error;
    }
  },

  changePasswordByAdmin: async (token, clientId, newPassword) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}client/${clientId}/change-password-admin`,
        { newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao alterar senha:", error.response?.data || error);
      throw error.response?.data || error;
    }
  },
  associateConsultant: async (token, clientId, consultantId) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}client/${clientId}/associate-consultant/${consultantId}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao associar consultor:", error);
      throw error.response?.data || error;
    }
  },

  removeConsultant: async (token, clientId) => {
    try {
      const response = await axios.delete(
        `${BASE_ROUTE}client/${clientId}/remove-consultant`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao remover consultor:", error);
      throw error.response?.data || error;
    }
  },

  deleteProfilePicture: async (id, token) => {
    try {
      const response = await axios.delete(
        `${BASE_ROUTE}client/${id}/profile-picture`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao deletar a foto:",
        error.response?.data || error.message
      );
      throw (
        error.response?.data || new Error("Não foi possível deletar a foto.")
      );
    }
  },

  getBankAccountByClientId: async (token, clientId) => {
    try {
      const response = await axios.get(
        `${BASE_ROUTE}BankAccount/client/${clientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao obter conta bancária do cliente:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default clientServices;
