import api from "./api/api";

const normalizeSearchString = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const withdrawServices = {
  getById: async (id) => {
    try {
      const response = await api.get(`withdraw/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar saque:", error);
      throw error;
    }
  },
  getBankAccountByClientId: async (clientId) => {
    try {
      const response = await api.get(`bank-account/client/${clientId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      console.error("Erro ao buscar conta bancária:", error);
      throw error;
    }
  },
  getWithdrawals: async (filters, pageNumber = 1, pageSize = 10) => {
    try {
      const params = {
        searchTerm: normalizeSearchString(filters.searchTerm),
        pageNumber,
        pageSize,
      };
      if (filters.status && filters.status !== "Todos") {
        params.status = filters.status;
      }
      const response = await api.get("withdraw/search", { params });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar saques:", error);
      throw error;
    }
  },
  criarSaqueAdmin: async (data) => {
    try {
      const response = await api.post("withdraw/admin-create", data);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar saque como admin:", error);
      throw error;
    }
  },
  getRules: async () => {
    try {
      const response = await api.get("withdrawrule/current");
      return response.data;
    } catch (error) {
      console.error("Erro ao obter regras de saque:", error);
      throw error;
    }
  },
  updateRules: async (rulesData) => {
    try {
      const response = await api.put("withdrawrule/update", rulesData);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar regras de saque:", error);
      throw error;
    }
  },
  obterSaquesCliente: async (idCliente) => {
    try {
      const response = await api.get("withdraw/my-withdraws", {
        headers: {
          "Client-ID-Ref": idCliente,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar saques do cliente:", error);
      throw error;
    }
  },
  criarSaqueCliente: async (data, idCliente) => {
    try {
      const response = await api.post("withdraw", data, {
        headers: {
          "Client-ID-Ref": idCliente,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar saque:", error);
      throw error;
    }
  },
  updateWithdrawalStatus: async (ids, newStatus) => {
    try {
      const response = await api.post("withdraw/update-status", {
        ids,
        newStatus,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar status do saque:", error);
      throw error;
    }
  },
};

export default withdrawServices;