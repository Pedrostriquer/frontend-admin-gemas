import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./WithdrawDetailPageStyle";
import withdrawServices from "../../../../dbServices/withdrawServices";
import clientServices from "../../../../dbServices/clientServices";
import { useAuth } from "../../../../Context/AuthContext";
import { useLoad } from "../../../../Context/LoadContext";

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
const statusMap = { 1: "Pendente", 2: "Aprovado", 3: "Cancelado", 4: "Recusado" };
const statusStyleMap = {
  1: "statusPendente",
  2: "statusAprovado",
  3: "statusCancelado",
  4: "statusRecusado",
};

function WithdrawDetailPage() {
  const { withdrawalId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [withdrawal, setWithdrawal] = useState(null);
  const [bankAccount, setBankAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { startLoading, stopLoading } = useLoad();

  const fetchWithdrawalData = useCallback(async () => {
    if (!token || !withdrawalId) return;
    setIsLoading(true);
    setError(null);
    setWithdrawal(null);
    setBankAccount(null);
    startLoading();
    try {
      const withdrawData = await withdrawServices.getById(withdrawalId);
      setWithdrawal(withdrawData);

      if (withdrawData && withdrawData.clientId) {
        try {
          const accountData = await clientServices.getBankAccountByClientId(
            withdrawData.clientId
          );
          setBankAccount(accountData);
        } catch (accountError) {
          if (accountError.response && accountError.response.status === 404) {
            setBankAccount(null);
          } else {
            console.error("Erro ao buscar conta bancária:", accountError);
          }
        } finally {
          stopLoading();
        }
      }
    } catch (err) {
      setError("Não foi possível carregar os dados do saque.");
    } finally {
      setIsLoading(false);
      startLoading();
    }
  }, [withdrawalId, token]);

  useEffect(() => {
    fetchWithdrawalData();
  }, [fetchWithdrawalData]);

  const handleUpdateStatus = async (newStatus, actionMessage) => {
    if (!window.confirm(`Tem certeza que deseja ${actionMessage} este saque?`))
      return;
    setIsSubmitting(true);
    try {
      startLoading();
      await withdrawServices.updateWithdrawalStatus(
        [withdrawal.id],
        newStatus
      );
      await fetchWithdrawalData();
    } catch (err) {
      alert("Ocorreu um erro ao processar a solicitação.");
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  const handlePayAndTransfer = async () => {
    if (!bankAccount) {
      alert(
        "Não é possível pagar e transferir pois o cliente não possui conta bancária cadastrada."
      );
      return;
    }
    if (
      !window.confirm(
        "Esta ação irá transferir o dinheiro para a conta do cliente e marcar o saque como pago. Continuar?"
      )
    )
      return;
    setIsSubmitting(true);
    try {
      startLoading();
      alert("Ação de pagar e transferir executada (simulação).");
      await fetchWithdrawalData();
    } catch (err) {
      alert("Ocorreu um erro ao processar o pagamento.");
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
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
  if (!withdrawal)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Saque não encontrado.
      </div>
    );

  return (
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
            Saque <span style={styles.headerTitleId}>#{withdrawal.id}</span>
          </h1>
        </div>
        <div style={styles.headerActions}>
          <span
            style={{
              ...styles.statusBadge,
              ...styles[statusStyleMap[withdrawal.status]],
            }}
          >
            {statusMap[withdrawal.status]}
          </span>
        </div>
      </header>

      <div style={styles.detailGrid}>
        <main style={styles.mainContent}>
          <div style={{ ...styles.infoCard, ...styles.kpiGrid }}>
            <div style={styles.kpiItem}>
              <p style={styles.kpiLabel}>Valor Solicitado</p>
              <p style={styles.kpiValue}>
                {formatCurrency(withdrawal.amountWithdrawn)}
              </p>
            </div>
            <div style={styles.kpiItem}>
              <p style={styles.kpiLabel}>Taxa</p>
              <p style={styles.kpiValue}>{formatCurrency(withdrawal.fee)}</p>
            </div>
            <div style={styles.kpiItem}>
              <p style={styles.kpiLabel}>Valor a Receber</p>
              <p style={styles.kpiValue}>
                {formatCurrency(withdrawal.amountReceivable)}
              </p>
            </div>
          </div>
          <div style={styles.infoCard}>
            <h3 style={styles.infoCardTitle}>
              <i className="fa-solid fa-user"></i> Informações do Cliente
            </h3>
            <ul style={styles.infoList}>
              <li style={styles.infoItem}>
                <span style={styles.infoLabel}>Nome</span>
                <span style={styles.infoValue}>{withdrawal.client.name}</span>
              </li>
              <li style={styles.infoItem}>
                <span style={styles.infoLabel}>CPF/CNPJ</span>
                <span style={styles.infoValue}>
                  {withdrawal.client.cpfCnpj}
                </span>
              </li>
              <li style={styles.infoItem}>
                <span style={styles.infoLabel}>Data da Solicitação</span>
                <span style={styles.infoValue}>
                  {formatDate(withdrawal.dateCreated)}
                </span>
              </li>
            </ul>
          </div>
          <div style={styles.infoCard}>
            <h3 style={styles.infoCardTitle}>
              <i className="fa-solid fa-building-columns"></i> Dados Bancários
              para Transferência
            </h3>
            {bankAccount ? (
              <ul style={styles.infoList}>
                <li style={styles.infoItem}>
                  <span style={styles.infoLabel}>Banco</span>
                  <span style={styles.infoValue}>
                    {bankAccount.bankName || "N/A"}
                  </span>
                </li>
                <li style={styles.infoItem}>
                  <span style={styles.infoLabel}>Agência</span>
                  <span style={styles.infoValue}>
                    {bankAccount.agencyNumber || "N/A"}
                  </span>
                </li>
                <li style={styles.infoItem}>
                  <span style={styles.infoLabel}>Conta</span>
                  <span style={styles.infoValue}>
                    {bankAccount.accountNumber || "N/A"}
                  </span>
                </li>
                <li style={styles.infoItem}>
                  <span style={styles.infoLabel}>Chave Pix</span>
                  <span style={styles.infoValue}>
                    {bankAccount.pix || "N/A"} (
                    {bankAccount.pixKeyType || "N/A"})
                  </span>
                </li>
                <li style={styles.infoItem}>
                  <span style={styles.infoLabel}>Beneficiário</span>
                  <span style={styles.infoValue}>
                    {bankAccount.beneficiaryName || "N/A"}
                  </span>
                </li>
              </ul>
            ) : (
              <p style={{ textAlign: "center", color: "#6b7280" }}>
                Cliente não possui conta bancária cadastrada.
              </p>
            )}
          </div>
        </main>

        <aside style={styles.actionPanel}>
          <div style={styles.actionCard}>
            <h3 style={styles.actionCardTitle}>Ações do Administrador</h3>
            {withdrawal.status === 1 ? (
              <>
                <button
                  style={
                    isSubmitting || !bankAccount
                      ? { ...styles.actionButton, ...styles.disabledButton }
                      : {
                          ...styles.actionButton,
                          ...styles.payAndTransferButton,
                        }
                  }
                  onClick={handlePayAndTransfer}
                  disabled={isSubmitting || !bankAccount}
                  title={
                    !bankAccount ? "Cliente sem conta bancária cadastrada" : ""
                  }
                >
                  <i className="fa-solid fa-paper-plane"></i>{" "}
                  {isSubmitting ? "Processando..." : "Pagar e Transferir"}
                </button>
                <button
                  style={
                    isSubmitting
                      ? { ...styles.actionButton, ...styles.disabledButton }
                      : { ...styles.actionButton, ...styles.markAsPaidButton }
                  }
                  onClick={() => handleUpdateStatus(2, "marcar como pago")}
                  disabled={isSubmitting}
                >
                  <i className="fa-solid fa-check"></i>{" "}
                  {isSubmitting ? "Processando..." : "Apenas Marcar como Pago"}
                </button>
                <button
                  style={
                    isSubmitting
                      ? { ...styles.actionButton, ...styles.disabledButton }
                      : { ...styles.actionButton, ...styles.cancelButton }
                  }
                  onClick={() => handleUpdateStatus(4, "cancelar")}
                  disabled={isSubmitting}
                >
                  <i className="fa-solid fa-xmark"></i>{" "}
                  {isSubmitting ? "Processando..." : "Cancelar Saque"}
                </button>
              </>
            ) : (
              <p style={styles.processedInfo}>
                Este saque já foi processado e não permite novas ações.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default WithdrawDetailPage;
