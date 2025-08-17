// src/dbServices/contractServices.js (Arquivo completo atualizado)

import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const normalizeSearchString = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const withdrawServices = {
  getById: async (token, id) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}withdraw/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar saques:", error);
      throw error;
    }
  },
  getBankAccountByClientId: async (token, clientId) => {
    try {
      const response = await axios.get(
        // Esta URL bate exatamente com o seu backend!
        `${BASE_ROUTE}bank-account/client/${clientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null; // Perfeito para tratar cliente sem conta
      }
      console.error("Erro ao buscar conta bancária:", error);
      throw error;
    }
  },
  getWithdrawals: async (token, filters, pageNumber = 1, pageSize = 10) => {
    try {
      const normalizedFilter = normalizeSearchString(filters.searchTerm);

      let url = `${BASE_ROUTE}withdraw/search?searchTerm=${normalizedFilter}&pageNumber=${pageNumber}&pageSize=${pageSize}`;

      if (filters.status && filters.status !== "Todos") {
        url += `&status=${filters.status}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar saques:", error);
      throw error;
    }
  },
  criarSaqueAdmin: async (token, data) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}withdraw/admin-create`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao criar saque como admin:", error);
      throw error;
    }
  },
  obterSaquesCliente: async (token, data, idCliente) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}withdraw/my-withdraws`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-ID-Ref": idCliente,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar saque:", error);
      throw error;
    }
  },
  criarSaqueCliente: async (token, data, idCliente) => {
    try {
      const response = await axios.post(`${BASE_ROUTE}withdraw`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-ID-Ref": idCliente,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar saque:", error);
      throw error;
    }
  },
  updateWithdrawalStatus: async (token, ids, newStatus) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}withdraw/update-status`,
        { ids, newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar status do saque:", error);
      throw error;
    }
  },
};

export default withdrawServices;
