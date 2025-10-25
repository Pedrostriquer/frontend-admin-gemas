// src/dbServices/catalogProductServices.js

import api from "./api/api";

const catalogProductServices = {
  /**
   * Busca todos os produtos do catálogo, com filtros opcionais.
   * @param {string} searchTerm - Termo para buscar por nome ou ID.
   * @param {string} statusFilter - Filtro por status ('Active' ou 'Inactive').
   * @returns {Promise<Array>} Lista de produtos.
   */
  getAllProducts: async (searchTerm, statusFilter) => {
    try {
      // O status 'todos' não é enviado, pois a API retorna todos por padrão.
      const status = statusFilter === "todos" ? null : statusFilter;

      const response = await api.get("CatalogProduct", {
        params: { searchTerm, statusFilter: status },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao buscar produtos do catálogo:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Cria um novo produto no catálogo.
   * @param {FormData} formData - Contém name, description, e a lista de 'images'.
   * @returns {Promise<Object>} O produto recém-criado.
   */
  createProduct: async (formData) => {
    try {
      const response = await api.post("CatalogProduct", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao criar produto:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Atualiza o status de um produto.
   * @param {number} id - ID do produto.
   * @param {string} newStatus - Novo status ('Active' ou 'Inactive').
   * @returns {Promise<void>}
   */
  updateProductStatus: async (id, newStatus) => {
    try {
      await api.patch(`CatalogProduct/${id}/status`, { status: newStatus });
    } catch (error) {
      console.error(
        `Erro ao atualizar status do produto ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Deleta um produto do catálogo.
   * @param {number} id - ID do produto a ser deletado.
   * @returns {Promise<void>}
   */
  deleteProduct: async (id) => {
    try {
      await api.delete(`CatalogProduct/${id}`);
    } catch (error) {
      console.error(
        `Erro ao deletar produto ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default catalogProductServices;
