import api from "./api/api";

const depositAccountService = {
  getAll: async () => {
    try {
      const response = await api.get("deposit-accounts");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar contas de depósito:", error);
      throw error.response?.data || error;
    }
  },

  create: async (accountData) => {
    try {
      const response = await api.post("deposit-accounts", accountData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar conta de depósito:", error);
      throw error.response?.data || error;
    }
  },

  update: async (accountId, accountData) => {
    try {
      const response = await api.put(
        `deposit-accounts/${accountId}`,
        accountData
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar conta de depósito:", error);
      throw error.response?.data || error;
    }
  },

  delete: async (accountId) => {
    try {
      await api.delete(`deposit-accounts/${accountId}`);
    } catch (error) {
      console.error("Erro ao deletar conta de depósito:", error);
      throw error.response?.data || error;
    }
  },
};

export default depositAccountService;
