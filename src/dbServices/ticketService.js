import axios from 'axios';
import adminService from "./adminService";

// Instância dedicada para a API pública que usa a API Key.
const apiPublic = axios.create({
  baseURL: 'https://api.softwarehousecaiuademello.com.br',
  headers: {
    'X-API-Key': '9ec2d512086c861b2452d0d083e47cc7b873f582720b7be605e8b6b074a43ada'
  }
});

const ticketService = {
  // createTicket e getAllTickets permanecem os mesmos.
  createTicket: async (ticketData) => {
    try {
      const admin = await adminService.getCurrentAdmin();
      const payload = { ...ticketData, platformName: "Gemas Brilhantes", requesterName: admin.name, contact: admin.email };
      const response = await apiPublic.post('/tickets/public', payload);
      return response.data;
    } catch (error) { console.error("Erro detalhado ao criar o ticket:", error.response?.data || error.message); throw error; }
  },

  getAllTickets: async (page = 1, searchTerm = '', status = '') => {
    try {
      const params = { page, pageSize: 12 };
      if (searchTerm) { params.searchTerm = searchTerm; }
      if (status) { params.status = status; }
      const response = await apiPublic.get('/tickets/platform/Gemas Brilhantes', { params });
      return response.data;
    } catch (error) { console.error("Erro ao buscar os tickets:", error.response?.data || error.message); throw error; }
  },
  
  getTicketById: async (id) => {
    try {
      const response = await apiPublic.get(`/tickets/${id}`);
      return response.data;
    } catch (error) { console.error(`Erro ao buscar o ticket ${id}:`, error.response?.data || error.message); throw error; }
  },

  /**
   * Adiciona uma mensagem a um ticket com o novo formato de payload.
   */
  addMessageToTicket: async (ticketId, messageText) => {
    try {
        // Busca o email do admin logado para usar como remetente
        const admin = await adminService.getCurrentAdmin();
        const payload = {
          text: messageText,
          sender: {
            email: admin.email 
          }
        };
        const response = await apiPublic.post(`/tickets/${ticketId}/messages`, payload);
        return response.data;
    } catch (error) {
        console.error(`Erro ao enviar mensagem para o ticket ${ticketId}:`, error.response?.data || error.message);
        throw error;
    }
  }
};

export default ticketService;