import api from "./api/api"; // Usa a instância do Axios com o Bearer Token

const leadsService = {
  /**
   * Busca a lista de leads com filtros e paginação.
   */
  getAllLeads: async (filters) => {
    const { pageNumber = 1, pageSize = 10, searchTerm = '', status = '' } = filters;
    
    try {
      const params = new URLSearchParams({
        pageNumber,
        pageSize,
      });

      if (searchTerm) {
        params.append('name', searchTerm);
      }
      // O filtro de status usa o parâmetro 'uncontactedOnly' da API
      if (status === 'uncontacted') {
        params.append('uncontactedOnly', true);
      }
      
      const response = await api.get('SimulationRequesters', { params });
      
      // A API retorna a paginação em um header, precisamos extraí-lo
      const paginationHeader = response.headers['x-pagination'];
      const meta = paginationHeader 
        ? JSON.parse(paginationHeader) 
        : { PageNumber: 1, PageSize: 10, TotalCount: 0, TotalPages: 1 };
        
      return { data: response.data, meta };
      
    } catch (error) {
      console.error("Erro ao buscar os leads:", error.response?.data || error);
      throw error;
    }
  },

  /**
   * Atualiza o status 'contacted' de um lead.
   */
  updateLeadStatus: async (id, contacted) => {
    try {
      const response = await api.patch(`SimulationRequesters/${id}/contacted`, { contacted });
      return response.data; // Retorna 200 OK em caso de sucesso
    } catch (error) {
      console.error(`Erro ao atualizar o status do lead ${id}:`, error.response?.data || error);
      throw error;
    }
  },

  /**
   * Exclui um lead.
   */
  deleteLead: async (id) => {
    try {
      const response = await api.delete(`SimulationRequesters/${id}`);
      return response.data; // Retorna 200 OK em caso de sucesso
    } catch (error) {
      console.error(`Erro ao excluir o lead ${id}:`, error.response?.data || error);
      throw error;
    }
  }
};

export default leadsService;