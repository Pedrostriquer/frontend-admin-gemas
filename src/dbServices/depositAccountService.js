import axios from "axios";

// Pega a URL base da sua API a partir das variáveis de ambiente
const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const depositAccountService = {
  /**
   * Busca todas as contas de depósito.
   * @param {string} token - O token JWT para autenticação.
   * @returns {Promise<Array>} Uma lista de contas de depósito.
   */
  getAll: async (token) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}deposit-accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar contas de depósito:", error);
      throw error.response?.data || error;
    }
  },

  /**
   * Cria uma nova conta de depósito.
   * @param {string} token - O token JWT para autenticação.
   * @param {object} accountData - Os dados da nova conta.
   * @returns {Promise<object>} O objeto da conta criada.
   */
  create: async (token, accountData) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}deposit-accounts`,
        accountData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao criar conta de depósito:", error);
      throw error.response?.data || error;
    }
  },

  /**
   * Atualiza uma conta de depósito existente.
   * @param {string} token - O token JWT para autenticação.
   * @param {number} accountId - O ID da conta a ser atualizada.
   * @param {object} accountData - Os novos dados da conta.
   * @returns {Promise<object>} O objeto da conta atualizada.
   */
  update: async (token, accountId, accountData) => {
    try {
      const response = await axios.put(
        `${BASE_ROUTE}deposit-accounts/${accountId}`,
        accountData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar conta de depósito:", error);
      throw error.response?.data || error;
    }
  },

  /**
   * Deleta uma conta de depósito.
   * @param {string} token - O token JWT para autenticação.
   * @param {number} accountId - O ID da conta a ser deletada.
   * @returns {Promise<void>}
   */
  delete: async (token, accountId) => {
    try {
      await axios.delete(`${BASE_ROUTE}deposit-accounts/${accountId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Erro ao deletar conta de depósito:", error);
      throw error.response?.data || error;
    }
  },
};

export default depositAccountService;
