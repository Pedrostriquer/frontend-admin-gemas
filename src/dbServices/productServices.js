import api from "./api/api";

const productServices = {
  searchProducts: async (filters, pageNumber = 1, pageSize = 5) => {
    try {
      const params = new URLSearchParams();
      if (filters.searchTerm) params.append("Name", filters.searchTerm);
      if (filters.itemType && filters.itemType !== "Todos")
        params.append("ItemType", filters.itemType);
      if (filters.sort) params.append("SortBy", filters.sort);
      if (filters.minPrice) params.append("MinPrice", filters.minPrice);
      if (filters.maxPrice) params.append("MaxPrice", filters.maxPrice);
      if (filters.status && filters.status !== "Todos") {
        params.append("Status", filters.status === "Ativo" ? 1 : 2);
      }
      if (filters.categories && filters.categories.length > 0) {
        filters.categories.forEach((catId) =>
          params.append("CategoryId", catId)
        );
      }
      params.append("PageNumber", pageNumber);
      params.append("PageSize", pageSize);

      const response = await api.get("Product/search", { params });
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao buscar produtos:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`Product/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao buscar produto ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getAllCategories: async () => {
    try {
      const response = await api.get("Category");
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao buscar categorias:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post("Product", productData);
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao criar produto:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`Product/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao atualizar produto:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  deleteProducts: async (ids) => {
    try {
      const deletePromises = ids.map((id) => api.delete(`Product/${id}`));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error(
        "Erro ao deletar produtos:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updateProductsStatus: async (ids, status) => {
    try {
      const updatePromises = ids.map((id) =>
        api.patch(`Product/${id}/status`, { status })
      );
      await Promise.all(updatePromises);
    } catch (error) {
      console.error(
        "Erro ao atualizar status dos produtos:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  uploadProductMedia: async (productId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(
        `product/${productId}/upload-media`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.mediaUrl;
    } catch (error) {
      console.error("Erro no upload da mídia:", error);
      throw (
        error.response?.data?.message ||
        "Não foi possível fazer o upload do arquivo."
      );
    }
  },

  updateProductStock: async (productId, newStock) => {
    try {
      await api.patch(`product/${productId}/stock`, {
        stock: newStock,
      });
    } catch (error) {
      console.error(
        `Erro ao atualizar estoque do produto ${productId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updateProductCode: async (productId, newCode) => {
    try {
      await api.patch(`product/${productId}/code`, {
        code: newCode,
      });
    } catch (error) {
      console.error(
        `Erro ao atualizar código do produto ${productId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default productServices;