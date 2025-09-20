import axios from "axios";

// URL base da API
const API_BASE_URL = process.env.REACT_APP_BASE_ROUTE;

const formServices = {
    /**
     * Obtém todos os formulários.
     * @param {string} token - O token de autenticação do admin.
     */
    getAllForms: async (token) => {
        try {
            // ✨✨✨ CORREÇÃO AQUI, MIGA! ✨✨✨
            // A rota agora é "/Formulary" com "F" maiúsculo
            const response = await axios.get(`${API_BASE_URL}Formulary`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar formulários:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Obtém um formulário específico pelo seu ID.
     * @param {string} token - O token de autenticação do admin.
     * @param {number} id - O ID do formulário.
     */
    getFormById: async (token, id) => {
        try {
            // ✨✨✨ CORREÇÃO AQUI TAMBÉM ✨✨✨
            const response = await axios.get(`${API_BASE_URL}Formulary/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar formulário ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },
};

export default formServices;