import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./AssociateConsultantModalStyle";
import { useAuth } from "../../../../../Context/AuthContext";
import consultantService from "../../../../../dbServices/consultantService";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

function AssociateConsultantModal({ isOpen, onClose, onAssociate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const { token } = useAuth();

  useEffect(() => {
    if (debouncedSearch.length < 2) {
      setResults([]);
      return;
    }
    const searchConsultants = async () => {
      setIsSearching(true);
      try {
        const data = await consultantService.getConsultants(
          token,
          debouncedSearch
        );
        setResults(data.items || []);
      } catch (error) {
        console.error("Erro ao buscar consultores", error);
      } finally {
        setIsSearching(false);
      }
    };
    searchConsultants();
  }, [debouncedSearch, token]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div style={styles.modalBackdrop} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Associar Consultor</h3>
        </div>
        <div style={styles.searchBox}>
          <i
            className="fa-solid fa-magnifying-glass"
            style={styles.searchIcon}
          ></i>
          <input
            type="text"
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar consultor por nome..."
          />
        </div>
        <ul style={styles.resultsList}>
          {isSearching ? (
            <li style={styles.noResults}>Buscando...</li>
          ) : results.length > 0 ? (
            results.map((consultant) => (
              <li
                key={consultant.id}
                style={styles.resultItem}
                onClick={() => onAssociate(consultant.id)}
              >
                <span>{consultant.name}</span>
              </li>
            ))
          ) : (
            searchTerm.length > 2 && (
              <li style={styles.noResults}>Nenhum resultado.</li>
            )
          )}
        </ul>
        <div style={styles.modalFooter}>
          <button style={styles.closeButton} onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AssociateConsultantModal;
