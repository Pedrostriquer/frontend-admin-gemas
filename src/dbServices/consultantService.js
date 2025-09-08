import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const consultantService = {
  createConsultant: async (token, consultantData) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}consultant`,
        consultantData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao criar consultor:", error);
      throw error.response?.data || error;
    }
  },

  getConsultants: async (token, searchTerm, pageNumber = 1, pageSize = 10) => {
    try {
      const response = await axios.get(
        `${BASE_ROUTE}consultant/search?searchTerm=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar consultores:", error);
      throw error;
    }
  },

  getConsultantById: async (token, id) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}consultant/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error)
    {
      console.error("Erro ao buscar consultor por ID:", error);
      throw error;
    }
  },

  // NOVA FUNÇÃO PARA BUSCAR OS CLIENTES DO CONSULTOR
  getClientsForConsultant: async (token, consultantId, pageNumber = 1, pageSize = 5) => {
    try {
      const response = await axios.get(
        // Usando a nova rota do backend
        `${BASE_ROUTE}client/by-consultant/${consultantId}`, 
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { pageNumber, pageSize } // Passando os parâmetros de paginação
        }
      );
      return response.data; // Espera-se que retorne { items: [], totalCount: X }
    } catch (error) {
      console.error("Erro ao buscar clientes do consultor:", error);
      throw error;
    }
  },

  updateConsultant: async (token, id, consultantData) => {
    try {
      const response = await axios.put(
        `${BASE_ROUTE}consultant/${id}`,
        consultantData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar consultor:", error);
      throw error;
    }
  },

  addBalance: async (token, consultantId, amount) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}consultant/${consultantId}/add-balance`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar saldo ao consultor:", error);
      throw error.response?.data || error;
    }
  },
};

export default consultantService;