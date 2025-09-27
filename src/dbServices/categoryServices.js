// src/services/categoryServices.js

import api from "./api/api";

const categoryServices = {
    getAllCategories: async () => {
        try {
            // Usa 'api' e a rota relativa SEM a barra inicial
            const response = await api.get('Category/with-product-count');
            
            const categoriesWithData = response.data.map((cat, index) => ({
                ...cat,
                name: cat.categoryName,
                productCount: cat.productsAssociated,
                status: index % 4 === 0 ? 'Inativo' : 'Ativo',
            }));
            return categoriesWithData;
        } catch (error) {
            console.error("Erro ao buscar categorias com contagem de produtos:", error.response?.data || error.message);
            throw error;
        }
    },

    getProductsForSelection: async () => {
        try {
            // Usando o objeto 'params' para mais clareza
            const response = await api.get('Product/search', { params: { PageSize: 1000 } });
            return response.data.items.map(p => ({ id: p.id, name: p.name }));
        } catch (error) {
            console.error("Erro ao buscar produtos para seleção:", error.response?.data || error.message);
            throw error;
        }
    },
    
    updateProductCategories: async (categoryIds, productIds) => {
        try {
            const updatePromises = productIds.map(productId => 
                // A rota é construída de forma relativa
                api.patch(`Product/${productId}/categories`, { categoryIds })
            );
            await Promise.all(updatePromises);
        } catch (error) {
            console.error("Erro ao associar produtos:", error.response?.data || error.message);
            throw error;
        }
    },

    createCategory: async (categoryData) => {
        try {
            const response = await api.post('Category', { name: categoryData.name });
            return response.data;
        } catch (error) {
            console.error("Erro ao criar categoria:", error.response?.data || error.message);
            throw error;
        }
    },

    updateCategory: async (id, categoryData) => {
        try {
            await api.put(`Category/${id}`, categoryData);
        } catch (error) {
            console.error(`Erro ao atualizar categoria ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },
    
    updateCategoryStatus: async (id, status) => {
        try {
            console.log(`Simulando atualização de status para categoria ${id}: ${status}`);
            // Exemplo de como seria com a API real:
            // await api.patch(`Category/${id}/status`, { status });
            return Promise.resolve();
        } catch (error) {
            console.error(`Erro ao atualizar status da categoria ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    deleteCategory: async (id) => {
        try {
            await api.delete(`Category/${id}`);
        } catch (error) {
            console.error(`Erro ao deletar categoria ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },
};

export default categoryServices;