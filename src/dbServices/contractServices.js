import api from "./api/api";

const normalizeSearchString = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const contractServices = {
  setReinvestmentAvailability: async (contractId, isAvailable) => {
    try {
      const response = await api.post(
        `contract/${contractId}/reinvestment-availability`,
        { isAvailable }
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

  atualizarAutoReinvestimentoCliente: async (
    contractId,
    autoReinvestState,
    idCliente
  ) => {
    try {
      const body = { autoReinvestState: autoReinvestState };
      const response = await api.patch(
        `contract/${contractId}/auto-reinvest`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
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

  updateContractStatus: async (ids, newStatus) => {
    try {
      const response = await api.post("contract/update-status", {
        ids,
        newStatus,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar status do contrato:", error);
      throw error;
    }
  },

  getContracts: async (filters, pageNumber = 1, pageSize = 10) => {
    try {
      const params = {
        searchTerm: normalizeSearchString(filters.searchTerm),
        pageNumber,
        pageSize,
      };
      if (filters.status && filters.status !== "Todos") {
        params.status = filters.status;
      }
      const response = await api.get("contract/search", { params });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar contratos:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`contract/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar contratos:", error);
      throw error;
    }
  },

  obterRegras: async () => {
    try {
      const response = await api.get("contract/rules");
      return response.data;
    } catch (error) {
      console.error("Erro ao obter regras:", error);
      throw error;
    }
  },

  obterContratoCliente: async (id, idCliente) => {
    try {
      const response = await api.get(`contract/${id}`, {
        headers: { "Client-ID-Ref": idCliente },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter contrato:", error);
      throw error;
    }
  },

  simularContrato: async (data) => {
    try {
      const response = await api.post("contract/simulate", data);
      return response.data;
    } catch (error) {
      console.error("Erro ao simular contrato:", error);
      throw error;
    }
  },

  criarContratoCliente: async (data, idCliente) => {
    try {
      const response = await api.post("contract", data, {
        headers: { "Client-ID-Ref": idCliente },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar contrato:", error);
      throw error;
    }
  },

  obterMesesDisponiveis: async () => {
    try {
      const response = await api.get("contract/rules/available-months");
      return response.data;
    } catch (error) {
      console.error("Erro ao obter meses disponíveis:", error);
      throw error;
    }
  },

  reinvestirLucroCliente: async (data, idCliente) => {
    try {
      const response = await api.post("reinvestment", data, {
        headers: { "Client-ID-Ref": idCliente },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter meses disponíveis:", error);
      throw error;
    }
  },

  obterContratosDoCliente: async (idCliente) => {
    try {
      const response = await api.get("contract/my-contracts", {
        headers: { "Client-ID-Ref": idCliente },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter contratos do cliente:", error);
      throw error;
    }
  },

  cancelContract: async (contractId, withdrawMoney) => {
    try {
      const response = await api.post(
        `contract/cancel/${contractId}?withdrawMoney=${withdrawMoney}`,
        null
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao cancelar contrato:", error);
      throw error.response?.data || error;
    }
  },

  getContractRules: async () => {
    try {
      const response = await api.get("contractrules");
      return response.data;
    } catch (error) {
      console.error("Erro ao obter regras de contrato:", error);
      throw error;
    }
  },

  createContractRule: async (ruleData) => {
    try {
      const response = await api.post("contractrules", ruleData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar regra de contrato:", error);
      throw error;
    }
  },

  updateContractRule: async (ruleId, ruleData) => {
    try {
      const response = await api.put(`contractrules/${ruleId}`, ruleData);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar regra de contrato:", error);
      throw error;
    }
  },

  getContractSettings: async () => {
    try {
      const response = await api.get("contractsettings");
      return response.data;
    } catch (error) {
      console.error("Erro ao obter configurações de contrato:", error);
      throw error;
    }
  },

  updateContractSettings: async (settingsData) => {
    try {
      const response = await api.put("contractsettings", settingsData);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar configurações de contrato:", error);
      throw error;
    }
  },

  deleteContractRule: async (ruleId) => {
    try {
      const response = await api.delete(`contractrules/${ruleId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar regra de contrato:", error);
      throw error;
    }
  },

  uploadContractFiles: async (contractId, certificateFiles, mediaFiles) => {
    const formData = new FormData();
    certificateFiles.forEach((file) => {
      formData.append("certificates", file, file.name);
    });
    mediaFiles.forEach((file) => {
      formData.append("media", file, file.name);
    });
    try {
      const response = await api.post(
        `contract/${contractId}/files`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao fazer upload dos arquivos do contrato:", error);
      throw error.response?.data || error;
    }
  },

  deleteContractFile: async (contractId, fileUrl, fileType) => {
    try {
      const response = await api.delete(
        `contract/${contractId}/files?fileUrl=${encodeURIComponent(
          fileUrl
        )}&fileType=${fileType}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar arquivo do contrato:", error);
      throw error.response?.data || error;
    }
  },

  deleteAllContractFiles: async (contractId, fileType) => {
    try {
      const response = await api.delete(
        `contract/${contractId}/files/all?fileType=${fileType}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar todos os arquivos do contrato:", error);
      throw error.response?.data || error;
    }
  },

  addOrUpdateTracking: async (contractId, trackingData) => {
    try {
      const response = await api.post(
        `contract/${contractId}/tracking`,
        trackingData
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao salvar dados de rastreio:", error);
      throw error.response?.data || error;
    }
  },

  getPaymentDetails: async (paymentId) => {
    try {
      const response = await api.get(`payment/${paymentId}/details`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar detalhes do pagamento:", error);
      throw error.response?.data || error;
    }
  },

  approveLocalPayment: async (paymentId) => {
    try {
      const response = await api.post(
        `payment/test/approve-local/${paymentId}`,
        {}
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao aprovar pagamento de teste:", error);
      throw error.response?.data || error;
    }
  },

  appreciateContractForDay: async (contractId) => {
    try {
      const response = await api.post(
        `contract/${contractId}/appreciate-day`,
        {}
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao rodar valorização diária:", error);
      throw error.response?.data || error;
    }
  },
};

export default contractServices;
