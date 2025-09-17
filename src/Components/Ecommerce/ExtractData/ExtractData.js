import React, { useState, useEffect, useCallback } from "react";
import "./ExtractData.css";
import { useAuth } from "../../Context/AuthContext";

// Importe todos os services necessários
import clientServices from "../../dbServices/clientServices";
import consultantService from "../../dbServices/consultantService";
import contractServices from "../../dbServices/contractServices";
import withdrawServices from "../../dbServices/withdrawServices";
import productServices from "../../dbServices/productServices";
import categoryServices from "../../dbServices/categoryServices";
import formServices from "../../dbServices/formServices";
import saleServices from "../../dbServices/saleServices";
import promotionServices from "../../dbServices/promotionServices";
import { useLoad } from "../../../Context/LoadContext";

// --- Utilitários de Formatação ---
const formatCurrency = (value) =>
  (value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const formatDate = (dateString) =>
  dateString ? new Date(dateString).toLocaleDateString("pt-BR") : "N/A";
const formatStatus = (status, map) => map[status] || status;

// --- Configuração das Fontes de Dados (CORRIGIDA E COMPLETA) ---
const DATA_SOURCES = {
  // --- PLATAFORMA ---
  Clientes: {
    fetchFunction: (token, filters) =>
      clientServices.getClients(token, filters.searchTerm, 1, 1000),
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
    fetchFunction: (token, filters) =>
      consultantService.getConsultants(token, filters.searchTerm, 1, 1000),
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
    fetchFunction: (token, filters) =>
      contractServices.getContracts(
        token,
        { ...filters, status: "Todos" },
        1,
        1000
      ),
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
    fetchFunction: (token, filters) =>
      withdrawServices.getWithdrawals(
        token,
        { ...filters, status: "Todos" },
        1,
        1000
      ),
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
  // --- E-COMMERCE ---
  Produtos: {
    fetchFunction: (token, filters) =>
      productServices.searchProducts(
        { ...filters, status: "Todos", itemType: "Todos" },
        1,
        1000
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
    // ✨ CORREÇÃO: A função getAllCategories retorna um array, então nós o envolvemos em um objeto { items: ... }
    fetchFunction: async (token) => {
      const data = await categoryServices.getAllCategories();
      return { items: data };
    },
    columns: [
      { header: "ID", accessor: "id" },
      { header: "Nome", accessor: "name" },
      { header: "Status", accessor: "status" },
      { header: "Qtd. Produtos", accessor: "productCount" },
    ],
  },
  Formulários: {
    // ✨ CORREÇÃO: Mesma lógica para getAllForms
    fetchFunction: async (token) => {
      const data = await formServices.getAllForms(token);
      return { items: data };
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
    // ✨ CORREÇÃO: Mesma lógica para getAllPromotions
    fetchFunction: async (token) => {
      const data = await promotionServices.getAllPromotions(token);
      return { items: data };
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
    fetchFunction: (token, filters) =>
      saleServices.getAllSales(token, filters, 1, 1000),
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
  const [activeGroup, setActiveGroup] = useState("Plataforma"); // Novo estado para o seletor de grupo
  const [selectedDataType, setSelectedDataType] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    sort: "desc",
    searchTerm: "",
  });
  const currentConfig = selectedDataType
    ? DATA_SOURCES[selectedDataType]
    : null;
  const { startLoading, stopLoading } = useLoad();

  const fetchData = useCallback(async () => {
    if (!selectedDataType || !currentConfig || !token) {
      setData([]);
      return;
    }
    setIsLoading(true);
    try {
      startLoading();
      const result = await currentConfig.fetchFunction(token, filters);
      setData(result.items || []);
    } catch (error) {
      console.error(`Erro ao buscar ${selectedDataType}:`, error);
      setData([]);
    } finally {
      setIsLoading(false);
      stopLoading();
    }
  }, [selectedDataType, currentConfig, token, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleGroupChange = (group) => {
    setActiveGroup(group);
    setSelectedDataType(null); // Reseta a seleção de dados ao trocar de grupo
    setData([]);
  };

  const getNestedValue = (obj, path) =>
    path.split(".").reduce((acc, part) => acc && acc[part], obj);

  return (
    <div className="extract-data-container">
      <header className="extract-data-header">
        <h1>Extrair Dados</h1>
        <p>
          Selecione uma fonte de dados, aplique filtros e extraia as informações
          que precisa.
        </p>
      </header>

      {/* ✨ NOVO SELETOR DE GRUPO E DADOS */}
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
            <div className="filter-item">
              <label>Ordenação</label>
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
              >
                <option value="desc">Mais Recentes</option>
                <option value="asc">Mais Antigos</option>
              </select>
            </div>
            <button className="extract-button">
              <i className="fa-solid fa-download"></i> Extrair Dados (CSV)
            </button>
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
        </section>
      )}
    </div>
  );
}

export default ExtractData;
