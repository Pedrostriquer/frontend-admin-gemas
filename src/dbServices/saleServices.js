import axios from "axios";

const API_BASE_URL ="https://gemasbackend.demelloagent.app/api";

const saleServices = {
    getAllSales: async (token, filters, pageNumber = 1, pageSize = 10) => {
        try {
            const params = new URLSearchParams({
                PageNumber: pageNumber,
                PageSize: pageSize,
                SortDirection: filters.sort || 'desc',
            });
            if (filters.searchTerm) params.append('ClientSearchTerm', filters.searchTerm);

            const url = `${API_BASE_URL}/Sale?${params.toString()}`;
            console.log("Chamando API de Vendas com a URL:", url);

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar vendas:", error.response?.data || error.message);
            throw error;
        }
    },

    getSaleById: async (token, id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/Sale/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar venda ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    getSaleItems: async (token, id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/Sale/${id}/items`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar itens da venda ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    updateSaleStatus: async (token, id, newStatus) => {
        try {
            await axios.patch(`${API_BASE_URL}/Sale/${id}/status`, { newStatus }, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error(`Erro ao atualizar status da venda ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },
};

export default saleServices;