// src/services/categoryServices.js

import api from "./api/api";

const categoryServices = {
    getAllCategories: async () => {
        try {
            // A API já retorna os dados que precisamos, vamos apenas ajustar os nomes dos campos.
            const response = await api.get('Category/with-product-count');
            
            // Mapeia a resposta da API para o formato que o frontend espera, sem adicionar um status falso.
            const categoriesWithData = response.data.map(cat => ({
                id: cat.id, // Supondo que a API também retorne o ID aqui, se não, pode ser necessário ajustar.
                name: cat.categoryName,
                productCount: cat.productsAssociated,
            }));
            // Se o endpoint /with-product-count não retorna o ID, você pode precisar fazer outra chamada ou ajustar o backend.
            // Para este exemplo, vamos assumir que o ID está presente ou que o nome é único por enquanto.
            // Se o ID não vier de /with-product-count, será preciso buscar de /api/Category e combinar os dados.
            // A forma mais simples é ajustar o backend para incluir o ID na rota /with-product-count.
            // Por enquanto, vamos pegar todos os Ids da rota principal e juntar.
            
            const allCategoriesResponse = await api.get('Category');
            const idMap = new Map(allCategoriesResponse.data.map(c => [c.name, c.id]));

            const finalCategories = response.data.map(cat => ({
                id: idMap.get(cat.categoryName), // Pega o ID correspondente pelo nome
                name: cat.categoryName,
                productCount: cat.productsAssociated,
            }));


            return finalCategories;
        } catch (error) {
            console.error("Erro ao buscar categorias com contagem de produtos:", error.response?.data || error.message);
            throw error;
        }
    },

    getProductsForSelection: async () => {
        try {
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
            // O corpo da requisição deve ser apenas { name: "string" }
            const response = await api.post('Category', { name: categoryData.name });
            return response.data;
        } catch (error) {
            console.error("Erro ao criar categoria:", error.response?.data || error.message);
            throw error;
        }
    },

    updateCategory: async (id, categoryData) => {
        try {
            // O corpo da requisição PUT é { id: 0, name: "string" } conforme o swagger
            await api.put(`Category/${id}`, { id: id, name: categoryData.name });
        } catch (error) {
            console.error(`Erro ao atualizar categoria ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },
    
    // REMOVIDA - A função updateCategoryStatus foi removida pois não existe na API
    // updateCategoryStatus: async (id, status) => { ... },

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