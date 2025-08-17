import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./WithdrawalsPageStyle";
import withdrawServices from "../../../dbServices/withdrawServices";
import { useAuth } from "../../../Context/AuthContext";

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

const formatCurrency = (value) => (value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const formatDate = (dateString) => (dateString ? new Date(dateString).toLocaleDateString("pt-BR") : "N/A");
const statusMap = { 1: "Pendente", 2: "Pago", 3: "Cancelado", 4: "Processando" };
const statusStyleMap = { 1: "Pendente", 2: "Aprovado", 3: "Negado", 4: "Pendente" };
const statusOptions = [
    { value: "Todos", label: "Todos os Status" },
    { value: 1, label: "Pendente" },
    { value: 2, label: "Pago" },
    { value: 3, label: "Cancelado" },
    { value: 4, label: "Processando" },
];

function WithdrawalsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ searchTerm: "", status: "Todos" });
  const [selectedIds, setSelectedIds] = useState(new Set());
  const debouncedFilters = useDebounce(filters, 500);

  const fetchWithdrawals = useCallback(async (page, currentFilters) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await withdrawServices.getWithdrawals(token, currentFilters, page, 10);
      setWithdrawals(data.items || []);
      setTotalPages(Math.ceil(data.totalCount / 10));
    } catch (error) {
      setWithdrawals([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedFilters]);

  useEffect(() => {
    fetchWithdrawals(currentPage, debouncedFilters);
  }, [debouncedFilters, currentPage, fetchWithdrawals]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleNavigateToDetail = (withdrawalId) => {
    navigate(`/platform/withdraws/${withdrawalId}`);
  };

  const handleGoToCreateWithdrawal = () => {
    navigate('/platform/withdraws/create');
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
      const pendingIdsOnPage = withdrawals.filter((w) => w.status === 1).map((w) => w.id);
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
    const action = newStatus === 2 ? "aprovar" : "negar";
    if (!window.confirm(`Tem certeza que deseja ${action} ${idsToUpdate.length} saque(s)?`)) return;

    try {
      await withdrawServices.updateWithdrawalStatus(token, idsToUpdate, newStatus);
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        idsToUpdate.forEach((id) => newSet.delete(id));
        return newSet;
      });
      fetchWithdrawals(currentPage, filters);
    } catch (error) {
      alert("Ocorreu um erro ao processar a solicitação.");
    }
  };

  const isAllSelectedOnPage = withdrawals.length > 0 && withdrawals.filter((w) => w.status === 1).every((w) => selectedIds.has(w.id));

  return (
    <div style={styles.withdrawalsPageContainer}>
      <header style={styles.withdrawalsPageHeader}>
        <h1 style={styles.headerH1}>Validar Saques</h1>
      </header>
      <div style={styles.tableControlsHeader}>
        <div style={styles.searchBox}>
          <i className="fa-solid fa-magnifying-glass" style={styles.searchIcon}></i>
          <input
            type="text"
            name="searchTerm"
            placeholder="Buscar por cliente, CPF ou telefone..."
            value={filters.searchTerm}
            onChange={handleFilterChange}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.actionsGroup}>
          <select name="status" value={filters.status} onChange={handleFilterChange} style={styles.filterSelect}>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button style={styles.createWithdrawalButton} onClick={handleGoToCreateWithdrawal}>
            <i className="fa-solid fa-plus"></i> Realizar Novo Saque
          </button>
        </div>
      </div>
      {selectedIds.size > 0 && (
        <div style={styles.bulkActionsBar}>
          <span>{selectedIds.size} selecionado(s)</span>
          <div>
            <button onClick={() => handleUpdateStatus(Array.from(selectedIds), 2)} style={{ ...styles.bulkActionButton, ...styles.approveBtn }}>Aprovar Selecionados</button>
            <button onClick={() => handleUpdateStatus(Array.from(selectedIds), 3)} style={{ ...styles.bulkActionButton, ...styles.denyBtn }}>Negar Selecionados</button>
          </div>
        </div>
      )}
      <div style={styles.withdrawalsTableCard}>
        <table style={styles.withdrawalsTable}>
          <thead>
            <tr>
              <th style={{ ...styles.tableHeaderCell, width: "40px" }}><input type="checkbox" onChange={handleSelectAllOnPage} checked={isAllSelectedOnPage} /></th>
              <th style={styles.tableHeaderCell}>Cliente</th>
              <th style={styles.tableHeaderCell}>CPF</th>
              <th style={styles.tableHeaderCell}>Data</th>
              <th style={styles.tableHeaderCell}>Valor</th>
              <th style={styles.tableHeaderCell}>Status</th>
              <th style={styles.tableHeaderCell}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>Buscando saques...</td></tr>
            ) : withdrawals.length > 0 ? (
              withdrawals.map((w) => (
                <tr key={w.id} style={{...styles.tableRow, ...(selectedIds.has(w.id) ? styles.tableRowSelected : {})}} onClick={() => handleNavigateToDetail(w.id)}>
                  <td style={styles.tableCell} onClick={(e) => e.stopPropagation()}>{w.status === 1 && (<input type="checkbox" checked={selectedIds.has(w.id)} onChange={() => handleSelect(w.id)} />)}</td>
                  <td style={styles.tableCell}>{w.client.name}</td>
                  <td style={styles.tableCell}>{w.client.cpfCnpj}</td>
                  <td style={styles.tableCell}>{formatDate(w.dateCreated)}</td>
                  <td style={styles.tableCell}>{formatCurrency(w.amountWithdrawn)}</td>
                  <td style={styles.tableCell}><span style={{ ...styles.statusBadge, ...styles[`status${statusStyleMap[w.status]}`] }}>{statusMap[w.status]}</span></td>
                  <td style={styles.tableCell} onClick={(e) => e.stopPropagation()}>
                    {w.status === 1 && (
                      <div style={styles.actionButtons}>
                        <button onClick={() => handleUpdateStatus([w.id], 2)} style={{ ...styles.actionButton, ...styles.approveBtn }}><i className="fa-solid fa-check"></i></button>
                        <button onClick={() => handleUpdateStatus([w.id], 3)} style={{ ...styles.actionButton, ...styles.denyBtn }}><i className="fa-solid fa-xmark"></i></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>Nenhuma solicitação de saque encontrada.</td></tr>
            )}
          </tbody>
        </table>
        <div style={styles.paginationContainer}>
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} style={{ ...styles.paginationButton, ...(currentPage === 1 && styles.paginationButtonDisabled) }}>Anterior</button>
          <span style={styles.paginationSpan}>Página {currentPage} de {totalPages || 1}</span>
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} style={{ ...styles.paginationButton, ...(currentPage === totalPages && styles.paginationButtonDisabled) }}>Próxima</button>
        </div>
      </div>
    </div>
  );
}

export default WithdrawalsPage;