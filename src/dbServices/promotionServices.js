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
      // Ao criar uma nova promoção, o backend deve atribuir um status padrão (provavelmente "Scheduled")
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

  // ###############################################################
  // ### CORREÇÃO FINAL: ENVIANDO O STATUS COMO TEXTO (STRING) ###
  // ###############################################################
  updatePromotionStatus: async (id, newStatusString) => {
    try {
      // O frontend usa o status "virtual" de "Inactive" para reativar promoções.
      // O backend espera um status real. Mapeamos "Inactive" para "Scheduled".
      const statusToSend = newStatusString === 'Inactive' ? 'Scheduled' : newStatusString;

      // Envia o corpo da requisição com a string de status correta,
      // exatamente como no teste bem-sucedido da API.
      await api.patch(`Promotion/${id}/status`, { newStatus: statusToSend });

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