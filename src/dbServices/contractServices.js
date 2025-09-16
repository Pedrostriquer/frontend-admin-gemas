// src/dbServices/contractServices.js

import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const normalizeSearchString = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const contractServices = {
  setReinvestmentAvailability: async (token, contractId, isAvailable) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}contract/${contractId}/reinvestment-availability`,
        { isAvailable },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao alterar disponibilidade de reinvestimento:",
        error
      );
      throw error.response?.data || error;
    }
  },

  // --- FUNÇÃO CORRIGIDA AQUI ---
  atualizarAutoReinvestimentoCliente: async (
    token,
    contractId,
    autoReinvestState,
    idCliente // Este parâmetro pode não ser necessário se a validação for só pelo token
  ) => {
    try {
      // O corpo da requisição agora é um objeto
      const body = { autoReinvestState: autoReinvestState };
      const response = await axios.patch(
        `${BASE_ROUTE}contract/${contractId}/auto-reinvest`,
        body, // Enviando o objeto
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            // A validação no backend que você me mostrou usa o token,
            // então o Client-ID-Ref pode não ser estritamente necessário aqui, mas mantemos por consistência.
            "Client-ID-Ref": idCliente,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar auto-reinvestimento:", error);
      throw error;
    }
  },

  updateContractStatus: async (token, ids, newStatus) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}contract/update-status`,
        { ids, newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar status do contrato:", error);
      throw error;
    }
  },
  getContracts: async (token, filters, pageNumber = 1, pageSize = 10) => {
    try {
      const normalizedFilter = normalizeSearchString(filters.searchTerm);

      let url = `${BASE_ROUTE}contract/search?searchTerm=${normalizedFilter}&pageNumber=${pageNumber}&pageSize=${pageSize}`;

      if (filters.status && filters.status !== "Todos") {
        url += `&status=${filters.status}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar contratos:", error);
      throw error;
    }
  },
  getById: async (token, id) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}contract/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar contratos:", error);
      throw error;
    }
  },

  obterRegras: async (token) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}contract/rules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter regras:", error);
      throw error;
    }
  },

  obterContratoCliente: async (token, id, idCliente) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}contract/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-ID-Ref": idCliente,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter contrato:", error);
      throw error;
    }
  },

  simularContrato: async (token, data) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}contract/simulate`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao simular contrato:", error);
      throw error;
    }
  },

  criarContratoCliente: async (token, data, idCliente) => {
    try {
      const response = await axios.post(`${BASE_ROUTE}contract`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-ID-Ref": idCliente,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar contrato:", error);
      throw error;
    }
  },

  obterMesesDisponiveis: async (token) => {
    try {
      const response = await axios.get(
        `${BASE_ROUTE}contract/rules/available-months`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao obter meses disponíveis:", error);
      throw error;
    }
  },

  reinvestirLucroCliente: async (token, data, idCliente) => {
    try {
      const response = await axios.post(`${BASE_ROUTE}reinvestment`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-ID-Ref": idCliente,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter meses disponíveis:", error);
      throw error;
    }
  },

  obterContratosDoCliente: async (token, idCliente) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}contract/my-contracts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-ID-Ref": idCliente,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter contratos do cliente:", error);
      throw error;
    }
  },

  cancelContract: async (token, contractId, withdrawMoney) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}contract/cancel/${contractId}?withdrawMoney=${withdrawMoney}`,
        null, // O corpo da requisição é vazio
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao cancelar contrato:", error);
      throw error.response?.data || error;
    }
  },

  getContractRules: async (token) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}contractrules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter regras de contrato:", error);
      throw error;
    }
  },

  createContractRule: async (token, ruleData) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}contractrules`,
        ruleData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao criar regra de contrato:", error);
      throw error;
    }
  },

  updateContractRule: async (token, ruleId, ruleData) => {
    try {
      const response = await axios.put(
        `${BASE_ROUTE}contractrules/${ruleId}`,
        ruleData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar regra de contrato:", error);
      throw error;
    }
  },
  getContractSettings: async (token) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}contractsettings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter configurações de contrato:", error);
      throw error;
    }
  },

  updateContractSettings: async (token, settingsData) => {
    try {
      const response = await axios.put(
        `${BASE_ROUTE}contractsettings`,
        settingsData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar configurações de contrato:", error);
      throw error;
    }
  },

  deleteContractRule: async (token, ruleId) => {
    try {
      const response = await axios.delete(
        `${BASE_ROUTE}contractrules/${ruleId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar regra de contrato:", error);
      throw error;
    }
  },

  uploadContractFiles: async (
    token,
    contractId,
    certificateFiles,
    mediaFiles
  ) => {
    const formData = new FormData();

    certificateFiles.forEach((file) => {
      formData.append("certificates", file, file.name);
    });

    mediaFiles.forEach((file) => {
      formData.append("media", file, file.name);
    });

    try {
      const response = await axios.post(
        `${BASE_ROUTE}contract/${contractId}/files`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao fazer upload dos arquivos do contrato:", error);
      throw error.response?.data || error;
    }
  },

  deleteContractFile: async (token, contractId, fileUrl, fileType) => {
    try {
      const response = await axios.delete(
        `${BASE_ROUTE}contract/${contractId}/files?fileUrl=${encodeURIComponent(
          fileUrl
        )}&fileType=${fileType}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar arquivo do contrato:", error);
      throw error.response?.data || error;
    }
  },

  deleteAllContractFiles: async (token, contractId, fileType) => {
    try {
      const response = await axios.delete(
        `${BASE_ROUTE}contract/${contractId}/files/all?fileType=${fileType}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar todos os arquivos do contrato:", error);
      throw error.response?.data || error;
    }
  },

  addOrUpdateTracking: async (token, contractId, trackingData) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}contract/${contractId}/tracking`,
        trackingData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao salvar dados de rastreio:", error);
      throw error.response?.data || error;
    }
  },

  getPaymentDetails: async (token, paymentId) => {
    try {
      const response = await axios.get(
        `${BASE_ROUTE}payment/${paymentId}/details`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar detalhes do pagamento:", error);
      throw error.response?.data || error;
    }
  },

  // NOVO: Função para aprovar um pagamento localmente (para testes)
  approveLocalPayment: async (token, paymentId) => {
    try {
      // Geralmente ações assim são feitas com POST, mesmo sem corpo de requisição
      const response = await axios.post(
        `${BASE_ROUTE}payment/test/approve-local/${paymentId}`,
        {}, // Corpo da requisição vazio
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao aprovar pagamento de teste:", error);
      throw error.response?.data || error;
    }
  },
};

export default contractServices;
