import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BASE_ROUTE;

const promotionServices = {
    getAllPromotions: async (token) => {
        try {
            const response = await axios.get(`${API_BASE_URL}Promotion`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar promoções:", error.response?.data || error.message);
            throw error;
        }
    },

    createPromotion: async (token, promotionData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}Promotion`, promotionData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao criar promoção:", error.response?.data || error.message);
            throw error;
        }
    },
    
    updatePromotion: async (token, id, promotionData) => {
        try {
            await axios.put(`${API_BASE_URL}Promotion/${id}`, promotionData, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error(`Erro ao atualizar promoção ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    updatePromotionStatus: async (token, id, newStatus) => {
        try {
            await axios.patch(`${API_BASE_URL}Promotion/${id}/status`, { newStatus }, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error(`Erro ao atualizar status da promoção ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    deletePromotion: async (token, id) => {
        try {
            await axios.delete(`${API_BASE_URL}Promotion/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error(`Erro ao deletar promoção ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },
};

export default promotionServices;