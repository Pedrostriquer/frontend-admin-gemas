import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styles from "./ContractDetailPageStyle";
import contractServices from "../../../../dbServices/contractServices";
import { useAuth } from "../../../../Context/AuthContext";
import CancelContractModal from "./CancelContractModal/CancelContractModal";

const formatCurrency = (v) =>
  (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "N/A";
const statusMap = {
  1: "Pendente",
  2: "Valorizando",
  3: "Cancelado",
  4: "Finalizado",
};
const statusStyleMap = {
  1: "statusPendente",
  2: "statusValorizando",
  3: "statusCancelado",
  4: "statusFinalizado",
};

function ContractDetailPage() {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [addMonths, setAddMonths] = useState(1);
  const [reinvestAmount, setReinvestAmount] = useState("");
  const [isAutoReinvest, setIsAutoReinvest] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const fetchContract = useCallback(async () => {
    if (!token || !contractId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await contractServices.getById(token, contractId);
      setContract(data);
      if (data && typeof data.autoReinvest !== "undefined") {
        setIsAutoReinvest(data.autoReinvest);
      }
    } catch (err) {
      console.error("Erro ao buscar detalhes do contrato:", err);
      setError("Não foi possível carregar o contrato.");
      setContract(null);
    } finally {
      setIsLoading(false);
    }
  }, [contractId, token]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  const handleReinvest = async () => {
    if (isSubmitting) return;
    const amount = parseFloat(
      reinvestAmount.replace(/\./g, "").replace(",", ".")
    );
    if (isNaN(amount) || amount <= 0) {
      alert("Por favor, insira um valor válido para reinvestir.");
      return;
    }
    if (amount > contract.currentIncome) {
      alert("O valor de reinvestimento não pode ser maior que o lucro atual.");
      return;
    }
    setIsSubmitting(true);
    try {
      const data = { contractId: contract.id, amount };
      await contractServices.reinvestirLucroCliente(
        token,
        data,
        contract.clientId
      );
      alert("Reinvestimento realizado com sucesso!");
      setReinvestAmount("");
      fetchContract();
    } catch (err) {
      console.error("Erro ao reinvestir:", err);
      alert("Ocorreu um erro ao tentar reinvestir. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAutoReinvest = async () => {
    const newAutoReinvestState = !isAutoReinvest;
    setIsAutoReinvest(newAutoReinvestState);
    try {
      const data = { autoReinvest: newAutoReinvestState };
      await contractServices.atualizarAutoReinvestimentoCliente(
        token,
        contract.id,
        data,
        contract.clientId
      );
    } catch (err) {
      console.error("Erro ao atualizar o reinvestimento automático:", err);
      alert(
        "Não foi possível salvar a sua preferência. Por favor, tente novamente."
      );
      setIsAutoReinvest(!newAutoReinvestState);
    }
  };

  const handleExtendContract = () =>
    alert(`Funcionalidade de extensão ainda não implementada.`);

  const handleOpenCancelModal = () => {
    setIsCancelModalOpen(true);
  };

  if (isLoading)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>Carregando...</div>
    );
  if (error)
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "red" }}>
        {error}
      </div>
    );
  if (!contract)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Contrato não encontrado.
      </div>
    );

  const progressPercentage =
    (contract.totalIncome / contract.finalAmount) * 100;

  return (
    <>
      <div style={styles.detailPageContainer}>
        <header style={styles.detailHeader}>
          <div style={styles.headerLeft}>
            <button
              style={styles.backButton}
              onClick={() => navigate(-1)}
              title="Voltar"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h1 style={styles.headerTitle}>
              Contrato <span style={styles.headerTitleId}>#{contract.id}</span>
            </h1>
          </div>
          <div style={styles.headerActions}>
            <Link
              to={`/clients/${contract?.clientId}`}
              style={{ textDecoration: "none" }}
            >
              <button style={styles.goToClientButton}>
                <i className="fa-solid fa-user"></i> Ir para Cliente
              </button>
            </Link>
            <span
              style={{
                ...styles.statusBadge,
                ...styles[statusStyleMap[contract.status]],
              }}
            >
              {statusMap[contract.status]}
            </span>
          </div>
        </header>
        <div style={styles.detailGrid}>
          <div style={styles.mainContent}>
            <div style={styles.kpiGrid}>
              <div style={styles.kpiCard}>
                <h2 style={styles.kpiCardTitle}>
                  <i className="fa-solid fa-piggy-bank"></i> Valor Investido
                </h2>
                <p style={styles.kpiCardValue}>
                  {formatCurrency(contract.amount)}
                </p>
              </div>
              <div style={styles.kpiCard}>
                <h2 style={styles.kpiCardTitle}>
                  <i className="fa-solid fa-arrow-trend-up"></i> Lucro Atual
                </h2>
                <p style={styles.kpiCardValue}>
                  {formatCurrency(contract.currentIncome)}
                </p>
              </div>
              <div style={styles.kpiCard}>
                <h2 style={styles.kpiCardTitle}>
                  <i className="fa-solid fa-trophy"></i> Valor Teto
                </h2>
                <p style={styles.kpiCardValue}>
                  {formatCurrency(contract.finalAmount)}
                </p>
              </div>
            </div>
            <div style={styles.progressSection}>
              <div style={styles.progressHeader}>
                <h3 style={styles.progressTitle}>Progresso do Contrato</h3>
                <span style={styles.progressDates}>
                  {formatDate(contract.activationDate)} -{" "}
                  {formatDate(contract.endContractDate)}
                </span>
              </div>
              <div style={styles.progressBarContainer}>
                <div
                  style={{
                    ...styles.progressBarFill,
                    width: `${progressPercentage}%`,
                  }}
                ></div>
              </div>
              <div style={styles.progressLabels}>
                <span>{formatCurrency(contract.totalIncome)}</span>
                <span>{progressPercentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>
          <aside style={styles.actionPanel}>
            <div style={styles.actionCard}>
              <h3 style={styles.actionCardTitle}>
                <i className="fa-solid fa-calendar-plus"></i> Estender Contrato
              </h3>
              <div style={styles.actionCardInputGroup}>
                <input
                  type="number"
                  min="1"
                  value={addMonths}
                  onChange={(e) => setAddMonths(e.target.value)}
                  style={styles.actionCardInput}
                  placeholder="Meses"
                />
                <button
                  onClick={handleExtendContract}
                  style={{
                    ...styles.actionCardButton,
                    ...styles.buttonPrimary,
                  }}
                >
                  Adicionar
                </button>
              </div>
            </div>
            <div style={styles.actionCard}>
              <h3 style={styles.actionCardTitle}>
                <i className="fa-solid fa-sack-dollar"></i> Reinvestir Lucros
              </h3>
              <div style={styles.actionCardInputGroup}>
                <input
                  type="text"
                  value={reinvestAmount}
                  onChange={(e) => setReinvestAmount(e.target.value)}
                  style={styles.actionCardInput}
                  placeholder="R$ 0,00"
                  disabled={isSubmitting}
                />
                <button
                  onClick={handleReinvest}
                  style={{
                    ...styles.actionCardButton,
                    ...styles.buttonPrimary,
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Reinvestir"}
                </button>
              </div>
              <div style={styles.toggleSwitchContainer}>
                <span style={styles.toggleLabel}>Reinvest. automático</span>
                <label style={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={isAutoReinvest}
                    onChange={handleToggleAutoReinvest}
                    style={styles.toggleSwitchInput}
                  />
                  <span
                    style={{
                      ...styles.toggleSlider,
                      ...(isAutoReinvest && styles.toggleSwitchInputChecked),
                    }}
                  >
                    <span
                      style={{
                        ...styles.toggleSliderBefore,
                        ...(isAutoReinvest &&
                          styles.toggleSwitchInputCheckedBefore),
                      }}
                    ></span>
                  </span>
                </label>
              </div>
            </div>
            {contract.status != 3 && contract.status != 4 && (
              <div style={styles.actionCard}>
                <h3 style={styles.actionCardTitle}>
                  <i className="fa-solid fa-triangle-exclamation"></i> Zona de
                  Perigo
                </h3>
                <button
                  onClick={handleOpenCancelModal}
                  style={{ ...styles.actionCardButton, ...styles.buttonDanger }}
                >
                  Cancelar Contrato
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
      <CancelContractModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        contract={contract}
      />
    </>
  );
}

export default ContractDetailPage;
