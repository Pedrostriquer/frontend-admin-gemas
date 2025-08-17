import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ClientsPageStyle";
import clientServices from "../../../dbServices/clientServices";
import { useAuth } from "../../../Context/AuthContext";
import ImageWithLoader from "../ImageWithLoader/ImageWithLoader";

const formatCurrency = (value) =>
  (value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const ITEMS_PER_PAGE = 10;

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

function ClientsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hoveredRow, setHoveredRow] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchClients = useCallback(
    async (page, search) => {
      if (!token) return;
      setIsLoading(true);
      try {
        const data = await clientServices.getClients(
          token,
          search,
          page,
          ITEMS_PER_PAGE
        );
        setClients(data.items || []);
        setTotalPages(Math.ceil(data.totalCount / ITEMS_PER_PAGE));
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        setClients([]);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchClients(currentPage, debouncedSearchTerm);
  }, [debouncedSearchTerm, currentPage, fetchClients]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  return (
    <div style={styles.clientsPageContainer}>
      <header style={styles.clientsPageHeader}>
        <h1 style={styles.clientsPageHeaderH1}>Clientes</h1>
      </header>

      <div style={styles.tableControlsHeader}>
        <div style={styles.searchBox}>
          <i
            className="fa-solid fa-magnifying-glass"
            style={styles.searchBoxIcon}
          ></i>
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.actionsGroup}>
          <button
            onClick={() => navigate("/clients/create")}
            style={styles.addClientButton}
          >
            <i className="fa-solid fa-plus"></i> Adicionar Cliente
          </button>
        </div>
      </div>

      <div style={styles.clientsTableCard}>
        <table style={styles.clientsTable}>
          <thead>
            <tr>
              <th style={{ ...styles.tableCell, width: '60px' }}></th>
              <th style={styles.tableCell}>Id</th>
              <th style={styles.tableCell}>Nome</th>
              <th style={styles.tableCell}>CPF/CNPJ</th>
              <th style={styles.tableCell}>Email</th>
              <th style={styles.tableCell}>Celular</th>
              <th style={styles.tableCell}>Saldo em Conta</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Carregando...
                </td>
              </tr>
            ) : clients.length > 0 ? (
              clients.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => navigate(`/platform/clients/${client.id}`)}
                  onMouseEnter={() => setHoveredRow(client.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    ...styles.tableRow,
                    ...(hoveredRow === client.id && styles.tableRowHover),
                  }}
                >
                  <td style={styles.tableCell}>
                    <ImageWithLoader
                      src={client.profilePictureUrl || 'https://i.ibb.co/tZ1b1b1/default-profile.png'}
                      alt={client.name}
                      style={styles.tableAvatar}
                    />
                  </td>
                  <td style={styles.tableCell}>#{client.id}</td>
                  <td style={styles.tableCell}>{client.name}</td>
                  <td style={styles.tableCell}>{client.cpfCnpj}</td>
                  <td style={styles.tableCell}>
                    <div style={styles.emailCell}>{client.email}</div>
                  </td>
                  <td style={styles.tableCell}>{client.phoneNumber}</td>
                  <td style={styles.tableCell}>
                    {formatCurrency(client.balance)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Nenhum cliente encontrado.
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

export default ClientsPage;