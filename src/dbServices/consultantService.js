import api from "./api/api";

const consultantService = {
  createConsultant: async (consultantData) => {
    try {
      const response = await api.post("consultant", consultantData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar consultor:", error);
      throw error.response?.data || error;
    }
  },

  getConsultants: async (searchTerm, pageNumber = 1, pageSize = 10) => {
    try {
      const response = await api.get("consultant/search", {
        params: { searchTerm, pageNumber, pageSize },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar consultores:", error);
      throw error;
    }
  },

  getConsultantById: async (id) => {
    try {
      const response = await api.get(`consultant/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar consultor por ID:", error);
      throw error;
    }
  },

  getClientsForConsultant: async (
    consultantId,
    pageNumber = 1,
    pageSize = 5
  ) => {
    try {
      const response = await api.get(`client/by-consultant/${consultantId}`, {
        params: { pageNumber, pageSize },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar clientes do consultor:", error);
      throw error;
    }
  },

  updateConsultant: async (id, consultantData) => {
    try {
      const response = await api.put(`consultant/${id}`, consultantData);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar consultor:", error);
      throw error;
    }
  },

  addBalance: async (consultantId, amount) => {
    try {
      const response = await api.post(
        `consultant/${consultantId}/add-balance`,
        {
          amount,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar saldo ao consultor:", error);
      throw error.response?.data || error;
    }
  },
};

export default consultantService;
