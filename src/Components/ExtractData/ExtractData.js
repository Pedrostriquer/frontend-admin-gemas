// src/pages/ExtractData/ExtractData.js

import React, { useState, useEffect, useCallback } from "react";
import "./ExtractData.css";
import { useAuth } from "../../Context/AuthContext";

import clientServices from "../../dbServices/clientServices";
import consultantService from "../../dbServices/consultantService";
import contractServices from "../../dbServices/contractServices";
import withdrawServices from "../../dbServices/withdrawServices";
import productServices from "../../dbServices/productServices";
import categoryServices from "../../dbServices/categoryServices";
import formServices from "../../dbServices/formServices";
import saleServices from "../../dbServices/saleServices";
import promotionServices from "../../dbServices/promotionServices";
import extractDataServices from "../../dbServices/extractDataServices";

const formatCurrency = (value) =>
  (value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const formatDate = (dateString) =>
  dateString ? new Date(dateString).toLocaleDateString("pt-BR") : "N/A";
const formatStatus = (status, map) => map[status] || status;

// --- Configuração das Fontes de Dados (CORRIGIDA) ---
const DATA_SOURCES = {
  Clientes: {
    // Para Clientes, o searchTerm do filtro é usado diretamente
    fetchFunction: (token, filters, page) =>
      clientServices.getClients(token, filters.searchTerm, page, 10),
    downloadFunction: (token, filters) =>
      extractDataServices.downloadClientsCsv(token, filters.searchTerm),
    columns: [
      { header: "ID", accessor: "id" },
      { header: "Nome", accessor: "name" },
      { header: "CPF/CNPJ", accessor: "cpfCnpj" },
      { header: "Email", accessor: "email" },
      {
        header: "Saldo",
        accessor: "balance",
        render: (val) => formatCurrency(val),
      },
    ],
  },
  Consultores: {
    // ✨✨✨ CORREÇÃO APLICADA AQUI ✨✨✨
    // Para Consultores, se o searchTerm não existir, passamos uma string vazia ""
    fetchFunction: (token, filters, page) =>
      consultantService.getConsultants(
        token,
        filters.searchTerm || "",
        page,
        10
      ),
    downloadFunction: (token) =>
      extractDataServices.downloadConsultantsCsv(token), // O download não precisa de filtro
    columns: [
      { header: "ID", accessor: "id" },
      { header: "Nome", accessor: "name" },
      { header: "Email", accessor: "email" },
      { header: "CPF", accessor: "cpfCnpj" },
      {
        header: "Status",
        accessor: "status",
        render: (val) => formatStatus(val, { 1: "Ativo", 0: "Inativo" }),
      },
    ],
  },
  Contratos: {
    fetchFunction: (token, filters, page) =>
      contractServices.getContracts(token, { status: "Todos" }, page, 10),
    downloadFunction: (token) =>
      extractDataServices.downloadContractsCsv(token),
    columns: [
      { header: "ID", accessor: "id" },
      { header: "Cliente", accessor: "client.name" },
      {
        header: "Valor",
        accessor: "amount",
        render: (val) => formatCurrency(val),
      },
      {
        header: "Finaliza em",
        accessor: "endContractDate",
        render: (val) => formatDate(val),
      },
      {
        header: "Status",
        accessor: "status",
        render: (val) =>
          formatStatus(val, {
            1: "Pendente",
            2: "Valorizando",
            3: "Cancelado",
            4: "Finalizado",
          }),
      },
    ],
  },
  Saques: {
    fetchFunction: (token, filters, page) =>
      withdrawServices.getWithdrawals(token, { status: "Todos" }, page, 10),
    downloadFunction: (token) =>
      extractDataServices.downloadWithdrawsCsv(token),
    columns: [
      { header: "ID", accessor: "id" },
      { header: "Cliente", accessor: "client.name" },
      {
        header: "Data",
        accessor: "dateCreated",
        render: (val) => formatDate(val),
      },
      {
        header: "Valor",
        accessor: "amountWithdrawn",
        render: (val) => formatCurrency(val),
      },
      {
        header: "Status",
        accessor: "status",
        render: (val) =>
          formatStatus(val, { 1: "Pendente", 2: "Pago", 3: "Cancelado" }),
      },
    ],
  },
  // O resto das configurações permanece o mesmo
  Produtos: {
    fetchFunction: (token, filters, page) =>
      productServices.searchProducts(
        { status: "Todos", itemType: "Todos" },
        page,
        10
      ),
    columns: [
      { header: "ID", accessor: "id" },
      { header: "Nome", accessor: "name" },
      {
        header: "Tipo",
        accessor: "itemType",
        render: (val) => (val === 1 ? "Joia" : "Gema"),
      },
      {
        header: "Preço",
        accessor: "value",
        render: (val) => formatCurrency(val),
      },
      {
        header: "Status",
        accessor: "status",
        render: (val) => (val === 1 ? "Ativo" : "Inativo"),
      },
    ],
  },
  Categorias: {
    fetchFunction: async (token) => {
      const data = await categoryServices.getAllCategories();
      return { items: data, totalCount: data.length, pageSize: data.length };
    },
    columns: [
      { header: "ID", accessor: "id" },
      { header: "Nome", accessor: "name" },
      { header: "Status", accessor: "status" },
      { header: "Qtd. Produtos", accessor: "productCount" },
    ],
  },
  Formulários: {
    fetchFunction: async (token) => {
      const data = await formServices.getAllForms(token);
      return { items: data, totalCount: data.length, pageSize: data.length };
    },
    columns: [
      { header: "ID", accessor: "id" },
      {
        header: "Data",
        accessor: "dateCreated",
        render: (val) => formatDate(val),
      },
      { header: "Nome", accessor: "name" },
      { header: "Contato", accessor: "phoneNumber" },
      { header: "Objetivo", accessor: "objective" },
    ],
  },
  Promoções: {
    fetchFunction: async (token) => {
      const data = await promotionServices.getAllPromotions(token);
      return { items: data, totalCount: data.length, pageSize: data.length };
    },
    columns: [
      { header: "ID", accessor: "id" },
      { header: "Nome", accessor: "name" },
      { header: "Tipo", accessor: "discountType" },
      { header: "Valor", accessor: "discountValue" },
      { header: "Status", accessor: "status" },
    ],
  },
  Pedidos: {
    fetchFunction: (token, filters, page) =>
      saleServices.getAllSales(token, {}, page, 10),
    columns: [
      { header: "ID", accessor: "id" },
      { header: "Cliente", accessor: "client.name" },
      {
        header: "Data",
        accessor: "saleDate",
        render: (val) => formatDate(val),
      },
      {
        header: "Total",
        accessor: "totalValue",
        render: (val) => formatCurrency(val),
      },
      { header: "Status", accessor: "status" },
    ],
  },
};

const DATA_OPTIONS = [
  {
    group: "Plataforma",
    items: [
      { key: "Clientes", label: "Clientes", icon: "fa-solid fa-users" },
      {
        key: "Consultores",
        label: "Consultores",
        icon: "fa-solid fa-user-tie",
      },
      {
        key: "Contratos",
        label: "Contratos",
        icon: "fa-solid fa-file-signature",
      },
      { key: "Saques", label: "Saques", icon: "fa-solid fa-money-bill-wave" },
    ],
  },
  {
    group: "E-commerce",
    items: [
      { key: "Produtos", label: "Produtos", icon: "fa-solid fa-gem" },
      { key: "Categorias", label: "Categorias", icon: "fa-solid fa-sitemap" },
      {
        key: "Formulários",
        label: "Formulários",
        icon: "fa-solid fa-file-alt",
      },
      { key: "Promoções", label: "Promoções", icon: "fa-solid fa-tags" },
      { key: "Pedidos", label: "Pedidos", icon: "fa-solid fa-box-open" },
    ],
  },
];

function ExtractData() {
  const { token } = useAuth();
  const [activeGroup, setActiveGroup] = useState("Plataforma");
  const [selectedDataType, setSelectedDataType] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    searchTerm: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const currentConfig = selectedDataType
    ? DATA_SOURCES[selectedDataType]
    : null;

  const fetchData = useCallback(async () => {
    if (!selectedDataType || !currentConfig || !token) {
      setData([]);
      return;
    }
    setIsLoading(true);
    try {
      const result = await currentConfig.fetchFunction(
        token,
        filters,
        pagination.currentPage
      );
      setData(result.items || []);
      setPagination((prev) => ({
        ...prev,
        totalPages:
          result.pageSize > 0
            ? Math.ceil(result.totalCount / result.pageSize)
            : 1,
        totalCount: result.totalCount,
      }));
    } catch (error) {
      console.error(`Erro ao buscar ${selectedDataType}:`, error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDataType, currentConfig, token, filters, pagination.currentPage]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [filters, selectedDataType]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleGroupChange = (group) => {
    setActiveGroup(group);
    setSelectedDataType(null);
    setData([]);
  };

  const handleDownload = async () => {
    if (!currentConfig?.downloadFunction) {
      alert("A extração para este tipo de dado ainda não foi implementada.");
      return;
    }
    try {
      const response = await currentConfig.downloadFunction(token, filters);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const contentDisposition = response.headers["content-disposition"];
      let fileName = `${selectedDataType.toLowerCase()}_export.csv`;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length === 2)
          fileName = fileNameMatch[1];
      }
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao gerar o arquivo CSV:", error);
      alert("Não foi possível gerar o arquivo. Tente novamente.");
    }
  };

  const getNestedValue = (obj, path) =>
    path.split(".").reduce((acc, part) => acc && acc[part], obj);
  const changePage = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  return (
    <div className="extract-data-container">
      <header className="extract-data-header">
        <h1>Extrair Dados</h1>
        <p>
          Selecione uma fonte de dados, aplique filtros e extraia as informações
          que precisa.
        </p>
      </header>
      <section className="data-selector-container">
        <div className="group-selector">
          {DATA_OPTIONS.map(({ group }) => (
            <button
              key={group}
              className={`group-btn ${activeGroup === group ? "active" : ""}`}
              onClick={() => handleGroupChange(group)}
            >
              {group}
            </button>
          ))}
        </div>
        <div className="data-type-grid">
          {DATA_OPTIONS.find((g) => g.group === activeGroup)?.items.map(
            (item) => (
              <button
                key={item.key}
                className={`data-type-btn ${
                  selectedDataType === item.key ? "active" : ""
                }`}
                onClick={() => setSelectedDataType(item.key)}
              >
                <i className={item.icon}></i>
                {item.label}
              </button>
            )
          )}
        </div>
      </section>
      {selectedDataType && (
        <section className="data-display-section">
          <div className="filters-container">
            {selectedDataType === "Clientes" && (
              <>
                <div className="filter-item search-filter">
                  <label>Buscar</label>
                  <input
                    type="text"
                    name="searchTerm"
                    placeholder="Buscar por nome, CPF/CNPJ..."
                    value={filters.searchTerm}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="filter-item">
                  <label>Data de Início</label>
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="filter-item">
                  <label>Data de Fim</label>
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                  />
                </div>
              </>
            )}
            <div className="extract-button-wrapper">
              <button className="extract-button" onClick={handleDownload}>
                <i className="fa-solid fa-download"></i> Extrair Dados (CSV)
              </button>
            </div>
          </div>
          <div className="data-table-card">
            <table className="data-table">
              <thead>
                <tr>
                  {currentConfig?.columns.map((col) => (
                    <th key={col.header}>{col.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={currentConfig?.columns.length}>
                      Carregando dados...
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map((row, rowIndex) => (
                    <tr key={row.id || rowIndex}>
                      {currentConfig?.columns.map((col) => (
                        <td key={col.accessor}>
                          {col.render
                            ? col.render(getNestedValue(row, col.accessor))
                            : getNestedValue(row, col.accessor)}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={currentConfig?.columns.length}>
                      Nenhum dado encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => changePage(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1 || isLoading}
            >
              Anterior
            </button>
            <span>
              Página {pagination.currentPage} de {pagination.totalPages}
            </span>
            <button
              onClick={() => changePage(pagination.currentPage + 1)}
              disabled={
                pagination.currentPage >= pagination.totalPages || isLoading
              }
            >
              Próxima
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default ExtractData;
