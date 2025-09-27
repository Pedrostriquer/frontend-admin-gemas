import api from "./api/api";

const messageService = {
  getMessages: async () => {
    try {
      const response = await api.get("messages");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      throw error;
    }
  },

  createMessage: async (messageData) => {
    try {
      const response = await api.post("messages", messageData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar mensagem:", error);
      throw error;
    }
  },

  deleteMessage: async (id) => {
    try {
      await api.delete(`messages/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar mensagem ${id}:`, error);
      throw error;
    }
  },
};

export default messageService;
