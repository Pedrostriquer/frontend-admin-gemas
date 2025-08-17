import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateWithdrawalPageStyle";
import { useAuth } from "../../../../Context/AuthContext";
import withdrawServices from "../../../../dbServices/withdrawServices";
import clientServices from "../../../../dbServices/clientServices";

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

const formatCurrency = (v) =>
  (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function CreateWithdrawalPage() {
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
      const fetchClients = async () => {
        setIsSearching(true);
        try {
          const response = await clientServices.getClients(token, debouncedSearchTerm);
          setSearchResults(response.items || []);
        } catch (error) {
          console.error("Erro ao buscar clientes:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      };
      fetchClients();
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm, token]);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setSearchTerm(client.name);
    setSearchResults([]);
    handleNext();
  };

  const handleConfirmWithdrawal = async () => {
    setIsSubmitting(true);
    try {
      const data = { 
        clientId: selectedClient.id, 
        amount: parseFloat(amount) 
      };
      await withdrawServices.criarSaqueAdmin(token, data);
      handleNext();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Ocorreu um erro ao criar o saque. Tente novamente.";
      alert(errorMsg);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Buscar Cliente por Nome ou CPF</label>
            <input
              type="text"
              style={styles.formInput}
              placeholder="Digite pelo menos 3 caracteres para buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div style={styles.searchResults}>
              {isSearching ? (
                <p style={styles.searchMessage}>Buscando clientes...</p>
              ) : searchResults.length > 0 ? (
                searchResults.map((client) => (
                  <div key={client.id} style={styles.searchResultItem} onClick={() => handleSelectClient(client)}>
                    <strong>{client.name}</strong> - {client.cpfCnpj}
                  </div>
                ))
              ) : debouncedSearchTerm.length > 2 ? (
                <p style={styles.searchMessage}>Nenhum cliente encontrado.</p>
              ) : null}
            </div>
          </div>
        );
      case 2:
        return (
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Valor do Saque para {selectedClient.name}</label>
            <p style={{ textAlign: "center", margin: "0 0 10px 0", color: "#10b981" }}>
              Saldo Disponível: <strong>{formatCurrency(selectedClient.balance)}</strong>
            </p>
            <input
              type="number"
              style={styles.formInput}
              placeholder="R$ 0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <h3 style={{ textAlign: "center" }}>Confirmar Dados do Saque</h3>
            <ul style={styles.confirmationList}>
              <li style={styles.confirmationItem}><span style={styles.confirmationLabel}>Cliente</span> <strong style={styles.confirmationValue}>{selectedClient.name}</strong></li>
              <li style={styles.confirmationItem}><span style={styles.confirmationLabel}>CPF</span> <strong style={styles.confirmationValue}>{selectedClient.cpfCnpj}</strong></li>
              <li style={styles.confirmationItem}><span style={styles.confirmationLabel}>Valor do Saque</span> <strong style={styles.confirmationValue}>{formatCurrency(parseFloat(amount))}</strong></li>
            </ul>
          </div>
        );
      case 4:
        return (
          <div style={styles.successContainer}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: "60px", color: "#10b981", marginBottom: "20px" }}></i>
            <h2 style={{ color: "#1e293b" }}>Saque Solicitado com Sucesso!</h2>
            <p>A solicitação de saque para {selectedClient.name} foi registrada.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const steps = ["Selecionar Cliente", "Definir Valor", "Confirmar", "Concluído"];

  return (
    <div style={styles.createPageContainer}>
      <header style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)} title="Voltar"><i className="fa-solid fa-arrow-left"></i></button>
        <h1 style={styles.headerTitle}>Realizar um Novo Saque</h1>
      </header>
      <div style={styles.wizardCard}>
        <div style={styles.wizardSteps}>
          {steps.map((s, index) => (
            <div key={s} style={step >= index + 1 ? { ...styles.step, ...styles.stepActive } : styles.step}>
              <span style={step >= index + 1 ? { ...styles.stepNumber, ...styles.stepNumberActive } : styles.stepNumber}>{index + 1}</span>
              {s}
            </div>
          ))}
        </div>
        <div style={styles.wizardContent}>{renderStepContent()}</div>
        {step < 4 && (
          <div style={styles.wizardFooter}>
            <button
              style={step === 1 ? { ...styles.footerButton, ...styles.disabledButton } : { ...styles.footerButton, ...styles.backButtonFooter }}
              onClick={handleBack}
              disabled={step === 1}
            >
              Voltar
            </button>
            {step < 3 && (
              <button
                style={(step === 1 && !selectedClient) || (step === 2 && !amount) ? { ...styles.footerButton, ...styles.disabledButton } : { ...styles.footerButton, ...styles.nextButtonFooter }}
                onClick={handleNext}
                disabled={(step === 1 && !selectedClient) || (step === 2 && !amount)}
              >
                Próximo
              </button>
            )}
            {step === 3 && (
              <button
                style={isSubmitting ? { ...styles.footerButton, ...styles.disabledButton } : { ...styles.footerButton, ...styles.nextButtonFooter }}
                onClick={handleConfirmWithdrawal}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Confirmando..." : "Confirmar e Criar Saque"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateWithdrawalPage;