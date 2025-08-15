// src/dbServices/contractServices.js (Arquivo completo atualizado)

import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const contractServices = {
  obterRegras: async (token) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}contract/rules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter regras:", error);
      throw error;
    }
  },

  obterContratoCliente: async (token, id, idCliente) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}contract/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-ID-Ref": idCliente,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter contrato:", error);
      throw error;
    }
  },

  simularContrato: async (token, data) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}contract/simulate`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao simular contrato:", error);
      throw error;
    }
  },

  criarContratoCliente: async (token, data, idCliente) => {
    try {
      const response = await axios.post(`${BASE_ROUTE}contract`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-ID-Ref": idCliente,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar contrato:", error);
      throw error;
    }
  },

  obterMesesDisponiveis: async (token) => {
    try {
      const response = await axios.get(
        `${BASE_ROUTE}contract/rules/available-months`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao obter meses disponíveis:", error);
      throw error;
    }
  },

  reinvestirLucroCliente: async (token, data, idCliente) => {
    try {
      const response = await axios.post(`${BASE_ROUTE}reinvestment`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-ID-Ref": idCliente,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter meses disponíveis:", error);
      throw error;
    }
  },

  obterContratosDoCliente: async (token, idCliente) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}contract/my-contracts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-ID-Ref": idCliente,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter contratos do cliente:", error);
      throw error;
    }
  },

  atualizarAutoReinvestimentoCliente: async (
    token,
    contractId,
    autoReinvestState,
    idCliente
  ) => {
    try {
      const response = await axios.patch(
        `${BASE_ROUTE}contract/${contractId}/auto-reinvest`,
        autoReinvestState,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Client-ID-Ref": idCliente,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar auto-reinvestimento:", error);
      throw error;
    }
  },
};

export default contractServices;
