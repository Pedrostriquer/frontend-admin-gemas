import axios from "axios";

// Certifique-se de que a variável de ambiente está configurada corretamente no seu arquivo .env
const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const blogServices = {
  // --- Post Endpoints ---

  /**
   * ✨ FUNÇÃO ATUALIZADA para corresponder à nova API com busca e paginação ✨
   * Busca posts com base no status, termo de busca e paginação.
   * @param {object} params - Os parâmetros de busca.
   * @param {number} params.status - O status dos posts a serem buscados (1, 2 ou 3).
   * @param {string} params.searchTerm - O termo para buscar no título dos posts.
   * @param {number} params.pageNumber - O número da página atual.
   * @param {number} params.pageSize - A quantidade de itens por página.
   * @returns {Promise<object>} Uma promessa que resolve para o objeto retornado pela API (ex: { items: [], totalCount: 0, ... })
   */
  searchPosts: async ({ status, searchTerm, pageNumber, pageSize }) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}posts/search`, {
        params: {
          status,
          searchTerm,
          pageNumber,
          pageSize,
        },
      });
      // A API deve retornar um objeto contendo a lista de posts e informações de paginação.
      // Ex: { items: [...], totalCount: 100, pageNumber: 1, pageSize: 10 }
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao buscar posts:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getPostById: async (id) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao buscar post ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  createPost: async (postData) => {
    try {
      const response = await axios.post(`${BASE_ROUTE}posts`, postData);
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao criar post:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updatePost: async (id, postData) => {
    try {
      const response = await axios.put(`${BASE_ROUTE}posts/${id}`, postData);
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao atualizar post ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updatePostStatus: async (id, status) => {
    try {
      // A API espera um objeto no corpo da requisição
      const response = await axios.patch(`${BASE_ROUTE}posts/${id}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao atualizar status do post ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // --- BlogCategories Endpoints (sem alterações, apenas garantindo o BASE_ROUTE correto) ---

  getBlogCategories: async () => {
    try {
      const response = await axios.get(`${BASE_ROUTE}blog-categories`);
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao buscar categorias do blog:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  createBlogCategory: async (categoryName) => {
    try {
      const response = await axios.post(`${BASE_ROUTE}blog-categories`, {
        categoryName,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao criar categoria:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  deleteBlogCategory: async (id) => {
    try {
      const response = await axios.delete(`${BASE_ROUTE}blog-categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao deletar categoria ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  uploadPostImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file); // 'file' é o nome que a API espera para IFormFile

      const response = await axios.post(
        `${BASE_ROUTE}posts/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // A API retorna { "imageUrl": "..." }
      return response.data.imageUrl;
    } catch (error) {
      console.error(
        "Erro ao fazer upload da imagem:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Solicita a exclusão de uma imagem do Firebase através da API.
   * @param {string} imageUrl - A URL da imagem a ser excluída.
   * @returns {Promise<void>}
   */
  deletePostImage: async (imageUrl) => {
    try {
      // O corpo da requisição DELETE precisa estar dentro da propriedade 'data' do objeto de configuração do Axios
      await axios.delete(`${BASE_ROUTE}posts/delete-image`, {
        data: { imageUrl },
      });
    } catch (error) {
      console.error(
        "Erro ao deletar imagem:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default blogServices;
