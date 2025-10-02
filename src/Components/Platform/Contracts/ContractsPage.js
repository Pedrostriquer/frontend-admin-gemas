import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ContractsPageStyle";
import contractServices from "../../../dbServices/contractServices";
import { useAuth } from "../../../Context/AuthContext";
import formatServices from "../../../formatServices/formatServices";
import { useLoad } from "../../../Context/LoadContext";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const formatCurrency = (value) =>
  (value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const formatDate = (dateString) =>
  dateString ? new Date(dateString).toLocaleDateString("pt-BR") : "N/A";
const statusMap = {
  1: "Pendente",
  2: "Valorizando",
  3: "Cancelado",
  4: "Finalizado",
  5: "Recomprado",
};
const statusStyleMap = {
  1: "Pendente",
  2: "Valorizando",
  3: "Cancelado",
  4: "Finalizado",
};
const statusOptions = [
  { value: "Todos", label: "Todos os Status" },
  { value: 1, label: "Pendente" },
  { value: 2, label: "Valorizando" },
  { value: 4, label: "Finalizado" },
  { value: 3, label: "Cancelado" },
];

function ContractsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ searchTerm: "", status: "Todos" });
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [hoveredRow, setHoveredRow] = useState(null);
  const debouncedFilters = useDebounce(filters, 500);
  const { startLoading, stopLoading } = useLoad();

  // ***** CORREÇÃO APLICADA AQUI *****
  // A dependência foi restaurada para a versão original e correta,
  // contendo apenas o 'token' para evitar o loop.
  const fetchContracts = useCallback(
    async (page, currentFilters) => {
      if (!token) return;
      setIsLoading(true);
      startLoading();
      try {
        const data = await contractServices.getContracts(
          currentFilters,
          page,
          10
        );
        setContracts(data.items || []);
        setTotalPages(Math.ceil(data.totalCount / 10));
      } catch (error) {
        setContracts([]);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
        stopLoading();
      }
    },
    [token] // Apenas 'token' como dependência
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedFilters]);

  useEffect(() => {
    fetchContracts(currentPage, debouncedFilters);
  }, [debouncedFilters, currentPage, fetchContracts]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleNavigateToContract = (contractId) => {
    navigate(`/platform/contracts/${contractId}`);
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleSelectAllOnPage = (e) => {
    const { checked } = e.target;
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      const pendingIdsOnPage = contracts
        .filter((c) => c.status === 1)
        .map((c) => c.id);
      if (checked) {
        pendingIdsOnPage.forEach((id) => newSet.add(id));
      } else {
        pendingIdsOnPage.forEach((id) => newSet.delete(id));
      }
      return newSet;
    });
  };

  const handleUpdateStatus = async (idsToUpdate, newStatus) => {
    if (idsToUpdate.length === 0) return;
    const action = newStatus === 2 ? "ativar" : "cancelar";
    if (
      !window.confirm(
        `Tem certeza que deseja ${action} ${idsToUpdate.length} contrato(s)?`
      )
    )
      return;

    try {
      startLoading();
      await contractServices.updateContractStatus(
        idsToUpdate,
        newStatus
      );
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        idsToUpdate.forEach((id) => newSet.delete(id));
        return newSet;
      });
      fetchContracts(currentPage, filters);
    } catch (error) {
      alert("Ocorreu um erro ao processar a solicitação.");
    } finally {
      stopLoading();
    }
  };

  const isAllSelectedOnPage =
    contracts.length > 0 &&
    contracts.filter((c) => c.status === 1).length > 0 &&
    contracts.filter((c) => c.status === 1).every((c) => selectedIds.has(c.id));

  return (
    <div style={styles.contractsPageContainer}>
      <header style={styles.contractsPageHeader}>
        <h1 style={styles.contractsPageHeaderH1}>Contratos</h1>
      </header>
      <div style={styles.tableControlsHeader}>
        <div style={styles.searchBox}>
          <i
            className="fa-solid fa-magnifying-glass"
            style={styles.searchBoxIcon}
          ></i>
          <input
            type="text"
            name="searchTerm"
            placeholder="Buscar por Cliente, CPF ou ID..."
            value={filters.searchTerm}
            onChange={handleFilterChange}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.filters}>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            style={styles.filterSelect}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedIds.size > 0 && (
        <div style={styles.bulkActionsBar}>
          <span>{selectedIds.size} selecionado(s)</span>
          <div>
            <button
              onClick={() => handleUpdateStatus(Array.from(selectedIds), 2)}
              style={{ ...styles.bulkActionButton, ...styles.approveBtn }}
            >
              {" "}
              Ativar Selecionados{" "}
            </button>
            <button
              onClick={() => handleUpdateStatus(Array.from(selectedIds), 3)}
              style={{ ...styles.bulkActionButton, ...styles.denyBtn }}
            >
              {" "}
              Cancelar Selecionados{" "}
            </button>
          </div>
        </div>
      )}
      <div style={styles.contractsTableCard}>
        <table style={styles.contractsTable}>
          <thead>
            <tr>
              <th style={{ ...styles.tableCell, width: "40px" }}>
                <input
                  type="checkbox"
                  onChange={handleSelectAllOnPage}
                  checked={isAllSelectedOnPage}
                />
              </th>
              <th style={{ ...styles.tableCell, ...styles.tableHeader }}>ID</th>
              <th style={{ ...styles.tableCell, ...styles.tableHeader }}>
                Data de Criação
              </th>
              <th style={{ ...styles.tableCell, ...styles.tableHeader }}>
                Cliente
              </th>
              <th style={{ ...styles.tableCell, ...styles.tableHeader }}>
                CPF/CNPJ
              </th>
              <th style={{ ...styles.tableCell, ...styles.tableHeader }}>
                Valor Investido
              </th>
              <th style={{ ...styles.tableCell, ...styles.tableHeader }}>
                Finaliza em
              </th>
              <th style={{ ...styles.tableCell, ...styles.tableHeader }}>
                Status
              </th>
              <th style={{ ...styles.tableCell, ...styles.tableHeader }}>
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan="9"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Buscando contratos...
                </td>
              </tr>
            ) : contracts.length > 0 ? (
              contracts.map((contract) => (
                <tr
                  key={contract.id}
                  onMouseEnter={() => setHoveredRow(contract.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    ...styles.tableRow,
                    ...(hoveredRow === contract.id && styles.tableRowHover),
                    ...(selectedIds.has(contract.id) &&
                      styles.tableRowSelected),
                  }}
                >
                  <td
                    style={styles.tableCell}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {contract.status === 1 && (
                      <input
                        type="checkbox"
                        checked={selectedIds.has(contract.id)}
                        onChange={() => handleSelect(contract.id)}
                      />
                    )}
                  </td>
                  <td
                    style={styles.tableCell}
                    onClick={() => handleNavigateToContract(contract.id)}
                  >
                    #{contract.id}
                  </td>
                  <td
                    style={styles.tableCell}
                    onClick={() => handleNavigateToContract(contract.id)}
                  >
                    {formatDate(contract.dateCreated)}
                  </td>
                  <td
                    style={styles.tableCell}
                    onClick={() => handleNavigateToContract(contract.id)}
                  >
                    {contract.client.name}
                  </td>
                  <td
                    style={styles.tableCell}
                    onClick={() => handleNavigateToContract(contract.id)}
                  >
                    {formatServices.formatDocument(contract.client.cpfCnpj)}
                  </td>
                  <td
                    style={styles.tableCell}
                    onClick={() => handleNavigateToContract(contract.id)}
                  >
                    {formatCurrency(contract.amount)}
                  </td>
                  <td
                    style={styles.tableCell}
                    onClick={() => handleNavigateToContract(contract.id)}
                  >
                    {formatDate(contract.endContractDate)}
                  </td>
                  <td
                    style={styles.tableCell}
                    onClick={() => handleNavigateToContract(contract.id)}
                  >
                    <span
                      style={{
                        ...styles.statusBadge,
                        ...styles[`status${statusStyleMap[contract.status]}`],
                      }}
                    >
                      {statusMap[contract.status]}
                    </span>
                  </td>
                  <td
                    style={styles.tableCell}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {contract.status === 1 && (
                      <div style={styles.actionButtons}>
                        <button
                          onClick={() => handleUpdateStatus([contract.id], 2)}
                          style={{
                            ...styles.actionButton,
                            ...styles.approveBtn,
                          }}
                        >
                          <i className="fa-solid fa-check"></i>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus([contract.id], 3)}
                          style={{ ...styles.actionButton, ...styles.denyBtn }}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Nenhum contrato encontrado para os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div style={styles.paginationContainer}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            style={{
              ...styles.paginationButton,
              ...(currentPage === 1 && styles.paginationButtonDisabled),
            }}
          >
            Anterior
          </button>
          <span style={styles.paginationSpan}>
            Página {currentPage} de {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            style={{
              ...styles.paginationButton,
              ...(currentPage === totalPages &&
                styles.paginationButtonDisabled),
            }}
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContractsPage;