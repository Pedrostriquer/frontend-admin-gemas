import api from "./api/api";

const saleServices = {
  getAllSales: async (filters, pageNumber = 1, pageSize = 10) => {
    try {
      const params = new URLSearchParams({
        PageNumber: pageNumber,
        PageSize: pageSize,
        SortDirection: filters.sort || "desc",
      });
      if (filters.searchTerm)
        params.append("ClientSearchTerm", filters.searchTerm);

      const url = `Sale?${params.toString()}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao buscar vendas:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getSaleById: async (id) => {
    try {
      const response = await api.get(`Sale/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao buscar venda ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getSaleItems: async (id) => {
    try {
      const response = await api.get(`Sale/${id}/items`);
      return response.data;
    } catch (error)
    {
      console.error(
        `Erro ao buscar itens da venda ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updateSaleStatus: async (id, newStatus) => {
    try {
      await api.patch(`Sale/${id}/status`, { newStatus });
    } catch (error) {
      console.error(
        `Erro ao atualizar status da venda ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default saleServices;