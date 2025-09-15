import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BASE_ROUTE;

const productServices = {
    searchProducts: async (filters, pageNumber = 1, pageSize = 5) => {
        try {
            const params = new URLSearchParams();
            if (filters.searchTerm) params.append('Name', filters.searchTerm);
            if (filters.itemType && filters.itemType !== 'Todos') params.append('ItemType', filters.itemType);
            if (filters.sort) params.append('SortBy', filters.sort);
            if (filters.minPrice) params.append('MinPrice', filters.minPrice);
            if (filters.maxPrice) params.append('MaxPrice', filters.maxPrice);
            if (filters.status && filters.status !== 'Todos') {
                params.append('Status', filters.status === 'Ativo' ? 1 : 0);
            }
            if (filters.categories && filters.categories.length > 0) {
                filters.categories.forEach(catId => params.append('CategoryId', catId));
            }
            params.append('PageNumber', pageNumber);
            params.append('PageSize', pageSize);

            const response = await axios.get(`${API_BASE_URL}Product/search`, { params });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar produtos:", error.response?.data || error.message);
            throw error;
        }
    },
    
    // ✨✨✨ FUNÇÃO ADICIONADA DE VOLTA AQUI, MIGA! ✨✨✨
    getProductById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}Product/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar produto ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    getAllCategories: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}Category`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar categorias:", error.response?.data || error.message);
            throw error;
        }
    },
    
    createProduct: async (productData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}Product`, productData);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar produto:", error.response?.data || error.message);
            throw error;
        }
    },

    updateProduct: async (id, productData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}Product/${id}`, productData);
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar produto:", error.response?.data || error.message);
            throw error;
        }
    },

    deleteProducts: async (ids) => {
        try {
            const deletePromises = ids.map(id => axios.delete(`${API_BASE_URL}Product/${id}`));
            await Promise.all(deletePromises);
        } catch (error) {
            console.error("Erro ao deletar produtos:", error.response?.data || error.message);
            throw error;
        }
    },

    updateProductsStatus: async (ids, status) => {
        try {
            const updatePromises = ids.map(id => axios.patch(`${API_BASE_URL}Product/${id}/status`, { status }));
            await Promise.all(updatePromises);
        } catch (error) {
            console.error("Erro ao atualizar status dos produtos:", error.response?.data || error.message);
            throw error;
        }
    },

    uploadProductMedia: async (productId, file) => {
        // FormData é o formato necessário para enviar arquivos via HTTP
        const formData = new FormData();
        formData.append('file', file); // 'file' deve corresponder ao nome do parâmetro no controller
    
        try {
            const response = await axios.post(`${API_BASE_URL}product/${productId}/upload-media`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                // Opcional: para barras de progresso
                // onUploadProgress: progressEvent => {
                //     console.log(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                // }
            });
            // O controller retorna um objeto { mediaUrl: '...' }
            return response.data.mediaUrl;
        } catch (error) {
            console.error("Erro no upload da mídia:", error);
            // Lança o erro para que o componente que chamou possa tratá-lo
            throw error.response?.data?.message || "Não foi possível fazer o upload do arquivo.";
        }
    }
};

export default productServices;