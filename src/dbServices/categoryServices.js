import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BASE_ROUTE;

const categoryServices = {
    getAllCategories: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}Category`);
            // Simulação de dados adicionais até que a API os forneça
            const categoriesWithData = response.data.map((cat, index) => ({
                ...cat,
                status: index % 4 === 0 ? 'Inativo' : 'Ativo', // Adicionar lógica se a API retornar status
                productCount: Math.floor(Math.random() * 30) // Simulado
            }));
            return categoriesWithData;
        } catch (error) {
            console.error("Erro ao buscar categorias:", error.response?.data || error.message);
            throw error;
        }
    },

    getProductsForSelection: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}Product/search?PageSize=1000`);
            return response.data.items.map(p => ({ id: p.id, name: p.name }));
        } catch (error) {
            console.error("Erro ao buscar produtos para seleção:", error.response?.data || error.message);
            throw error;
        }
    },
    
    updateProductCategories: async (categoryIds, productIds) => {
        try {
            const updatePromises = productIds.map(productId => 
                axios.patch(`${API_BASE_URL}Product/${productId}/categories`, { categoryIds })
            );
            await Promise.all(updatePromises);
        } catch (error) {
            console.error("Erro ao associar produtos:", error.response?.data || error.message);
            throw error;
        }
    },

    createCategory: async (categoryData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}Category`, { name: categoryData.name });
            return response.data;
        } catch (error) {
            console.error("Erro ao criar categoria:", error.response?.data || error.message);
            throw error;
        }
    },

    updateCategory: async (id, categoryData) => {
        try {
            await axios.put(`${API_BASE_URL}Category/${id}`, categoryData);
        } catch (error) {
            console.error(`Erro ao atualizar categoria ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },
    
    // ✨✨✨ NOVA FUNÇÃO AQUI ✨✨✨
    updateCategoryStatus: async (id, status) => {
        // ATENÇÃO: Esta é uma simulação. A rota real da API para mudar status de categoria precisa ser confirmada.
        // Simulando sucesso imediato.
        try {
            console.log(`Simulando atualização de status para categoria ${id}: ${status}`);
            // Exemplo de como seria com uma API real:
            // await axios.patch(`${API_BASE_URL}/Category/${id}/status`, { status });
            return Promise.resolve();
        } catch (error) {
            console.error(`Erro ao atualizar status da categoria ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    deleteCategory: async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}Category/${id}`);
        } catch (error) {
            console.error(`Erro ao deletar categoria ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },
};

export default categoryServices;