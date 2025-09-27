import api from "./api/api";

const promotionServices = {
  getAllPromotions: async () => {
    try {
      const response = await api.get("Promotion");
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao buscar promoções:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  createPromotion: async (promotionData) => {
    try {
      const response = await api.post("Promotion", promotionData);
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao criar promoção:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updatePromotion: async (id, promotionData) => {
    try {
      await api.put(`Promotion/${id}`, promotionData);
    } catch (error) {
      console.error(
        `Erro ao atualizar promoção ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updatePromotionStatus: async (id, newStatus) => {
    try {
      await api.patch(`Promotion/${id}/status`, { newStatus });
    } catch (error) {
      console.error(
        `Erro ao atualizar status da promoção ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  deletePromotion: async (id) => {
    try {
      await api.delete(`Promotion/${id}`);
    } catch (error) {
      console.error(
        `Erro ao deletar promoção ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default promotionServices;