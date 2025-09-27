// src/services/blogServices.js

import api from "./api/api"; // <-- 1. IMPORTA A INSTÂNCIA CENTRAL

const blogServices = {
  // --- Post Endpoints ---
  searchPosts: async ({ status, searchTerm, pageNumber, pageSize }) => {
    try {
      // Usa 'api' em vez de 'axios' e não precisa da BASE_ROUTE
      const response = await api.get("posts/search", {
        params: { status, searchTerm, pageNumber, pageSize },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar posts:", error.response?.data || error.message);
      throw error;
    }
  },

  getPostById: async (id) => {
    try {
      const response = await api.get(`posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar post ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  createPost: async (postData) => {
    try {
      const response = await api.post("posts", postData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar post:", error.response?.data || error.message);
      throw error;
    }
  },

  updatePost: async (id, postData) => {
    try {
      const response = await api.put(`posts/${id}`, postData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar post ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  updatePostStatus: async (id, status) => {
    try {
      const response = await api.patch(`posts/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar status do post ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // --- BlogCategories Endpoints ---
  getBlogCategories: async () => {
    try {
      const response = await api.get("blog-categories");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar categorias do blog:", error.response?.data || error.message);
      throw error;
    }
  },

  createBlogCategory: async (categoryName) => {
    try {
      const response = await api.post("blog-categories", { categoryName });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar categoria:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteBlogCategory: async (id) => {
    try {
      const response = await api.delete(`blog-categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar categoria ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  uploadPostImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("posts/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error.response?.data || error.message);
      throw error;
    }
  },

  deletePostImage: async (imageUrl) => {
    try {
      await api.delete("posts/delete-image", { data: { imageUrl } });
    } catch (error) {
      console.error("Erro ao deletar imagem:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default blogServices;