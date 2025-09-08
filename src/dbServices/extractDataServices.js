// src/dbServices/extractDataServices.js

import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const extractDataServices = {
  // Esta função continua com o filtro, pois é SÓ PARA CLIENTES
  downloadClientsCsv: async (token, searchFilter) => {
    try {
      const filterQuery = searchFilter ? `searchFilter=${encodeURIComponent(searchFilter)}` : "";
      const response = await axios.get(
        `${BASE_ROUTE}ExtractData/clients?${filterQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );
      return response;
    } catch (error) {
      console.error("Erro ao baixar CSV de clientes:", error);
      throw error;
    }
  },

  // As funções abaixo agora são simples, sem filtros
  downloadConsultantsCsv: async (token) => {
    try {
      const response = await axios.get(
        `${BASE_ROUTE}ExtractData/consultants`, // URL sem filtros
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );
      return response;
    } catch (error) {
      console.error("Erro ao baixar CSV de consultores:", error);
      throw error;
    }
  },

  downloadContractsCsv: async (token) => {
    try {
      const response = await axios.get(
        `${BASE_ROUTE}ExtractData/contracts`, // URL sem filtros
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );
      return response;
    } catch (error) {
      console.error("Erro ao baixar CSV de contratos:", error);
      throw error;
    }
  },

  downloadWithdrawsCsv: async (token) => {
    try {
      const response = await axios.get(
        `${BASE_ROUTE}ExtractData/withdraws`, // URL sem filtros
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );
      return response;
    } catch (error) {
      console.error("Erro ao baixar CSV de saques:", error);
      throw error;
    }
  },
};

export default extractDataServices;