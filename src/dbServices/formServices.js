import api from "./api/api";

const formServices = {
  getAllForms: async () => {
    try {
      const response = await api.get("Formulary");
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao buscar formulários:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getFormById: async (id) => {
    try {
      const response = await api.get(`Formulary/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao buscar formulário ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default formServices;
