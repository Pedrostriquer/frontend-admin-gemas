import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BASE_ROUTE;

const categoryServices = {
    /**
     * ATUALIZADO: Agora busca categorias e a contagem de produtos associados
     * diretamente do novo endpoint da API.
     */
    getAllCategories: async () => {
        try {
            // Chamada para o novo endpoint que já inclui a contagem de produtos
            const response = await axios.get(`${API_BASE_URL}Category/with-product-count`);
            
            // Mapeia a resposta para o formato que o frontend espera
            const categoriesWithData = response.data.map((cat, index) => ({
                ...cat,
                name: cat.categoryName, // Garante que a propriedade 'name' exista, caso o frontend a utilize
                productCount: cat.productsAssociated, // Utiliza a contagem de produtos vinda da API
                status: index % 4 === 0 ? 'Inativo' : 'Ativo', // Lógica de status mantida como simulação
            }));
            return categoriesWithData;
        } catch (error) {
            // Mensagem de erro atualizada para refletir a nova chamada
            console.error("Erro ao buscar categorias com contagem de produtos:", error.response?.data || error.message);
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
    
    updateCategoryStatus: async (id, status) => {
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