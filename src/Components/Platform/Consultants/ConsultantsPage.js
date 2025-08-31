import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ConsultantsPageStyle";
import { useAuth } from "../../../Context/AuthContext";
import consultantService from "../../../dbServices/consultantService";
import formatServices from "../../../formatServices/formatServices";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const statusMap = { 1: "Ativo", 0: "Inativo" };

function ConsultantsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [consultants, setConsultants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchConsultants = useCallback(
    async (page, search) => {
      if (!token) return;
      setIsLoading(true);
      try {
        const data = await consultantService.getConsultants(
          token,
          search,
          page,
          10
        );
        setConsultants(data.items || []);
        setTotalPages(Math.ceil(data.totalCount / 10));
      } catch (error) {
        setConsultants([]);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchConsultants(currentPage, debouncedSearchTerm);
  }, [debouncedSearchTerm, currentPage, fetchConsultants]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const handleNavigate = (id) => navigate(`/platform/consultants/${id}`);

  return (
    <div style={styles.pageContainer}>
      <header style={styles.pageHeader}>
        <h1 style={styles.headerTitle}>Consultores</h1>
      </header>

      <div style={styles.controlsHeader}>
        <div style={styles.searchBox}>
          <i
            className="fa-solid fa-magnifying-glass"
            style={styles.searchIcon}
          ></i>
          <input
            type="text"
            placeholder="Buscar por nome, email ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <button
          style={styles.createButton}
          onClick={() => navigate("/platform/consultants/create")}
        >
          <i className="fa-solid fa-plus"></i> Novo Consultor
        </button>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>ID</th>
              <th style={styles.tableHeader}>Nome</th>
              <th style={styles.tableHeader}>Email</th>
              <th style={styles.tableHeader}>CPF</th>
              <th style={styles.tableHeader}>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Carregando...
                </td>
              </tr>
            ) : consultants.length > 0 ? (
              consultants.map((consultant) => (
                <tr
                  key={consultant.id}
                  style={{
                    ...styles.tableRow,
                    ...(hoveredRow === consultant.id && styles.tableRowHover),
                  }}
                  onMouseEnter={() => setHoveredRow(consultant.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => handleNavigate(consultant.id)}
                >
                  <td style={styles.tableCell}>#{consultant.id}</td>
                  <td style={styles.tableCell}>{consultant.name}</td>
                  <td style={styles.tableCell}>{consultant.email}</td>
                  <td style={styles.tableCell}>
                    {formatServices.formatCpfCnpj(consultant.cpfCnpj)}
                  </td>
                  <td style={styles.tableCell}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        ...styles[
                          statusMap[consultant.status] === "Ativo"
                            ? "statusAtivo"
                            : "statusInativo"
                        ],
                      }}
                    >
                      {statusMap[consultant.status]}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Nenhum consultor encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
          disabled={currentPage >= totalPages}
          style={{
            ...styles.paginationButton,
            ...(currentPage >= totalPages && styles.paginationButtonDisabled),
          }}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

export default ConsultantsPage;
