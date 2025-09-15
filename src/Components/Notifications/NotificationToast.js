import React, { useEffect, useState } from "react";
import styles from "./NotificationStyle";
import { useNavigate } from "react-router-dom";

const notificationConfig = {
  NEW_CLIENT: {
    icon: "fa-solid fa-user-plus",
    title: "Novo Cliente Cadastrado!",
    style: styles.clientToast,
    message: (data) => `O cliente ${data.name} acaba de se cadastrar.`,
    link: (data) => `/platform/clients/${data.id}`,
  },
  
  NEW_CONTRACT_PENDING_PAYMENT: {
    icon: "fa-solid fa-hourglass-start",
    title: "Contrato Aguardando Pagamento!",
    style: styles.withdrawalToast, // Laranja para "atenção"
    message: (data) =>
      `${data.clientName} criou um contrato de ${data.amount.toLocaleString(
        "pt-BR",
        { style: "currency", currency: "BRL" }
      )} via ${data.paymentMethod}.`,
    link: (data) => `/platform/contracts/${data.id}`,
  },
  
  // --- NOVA CONFIGURAÇÃO PARA PAGAMENTO APROVADO ---
  PAYMENT_APPROVED: {
    icon: "fa-solid fa-circle-check", // Ícone de check de sucesso
    title: "Pagamento Confirmado!",
    style: styles.contractToast, // Verde para "sucesso"
    message: (data) => `O pagamento para um contrato foi aprovado e o contrato ativado.`,
    // Poderíamos linkar para o contrato, mas precisaríamos do ID dele.
    // Por enquanto, a notificação é informativa. Podemos evoluir depois.
    // link: (data) => `/platform/contracts/???`, 
  },

  NEW_WITHDRAWAL: {
    icon: "fa-solid fa-money-bill-transfer",
    title: "Solicitação de Saque!",
    style: styles.withdrawalToast,
    message: (data) =>
      `${data.clientName} solicitou um saque de ${data.amount.toLocaleString(
        "pt-BR",
        { style: "currency", currency: "BRL" }
      )}.`,
    link: (data) => `/platform/withdraws/${data.id}`,
  },
};

const NotificationToast = ({ notification, onDismiss }) => {
  const [exiting, setExiting] = useState(false);
  const navigate = useNavigate();
  
  const config = notificationConfig[notification.type] || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(notification.id), 500);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  const handleDismiss = (e) => {
    e.stopPropagation();
    setExiting(true);
    setTimeout(() => onDismiss(notification.id), 500);
  };

  const handleToastClick = () => {
    if (config.link && notification.data) {
      try {
        const destination = config.link(notification.data);
        navigate(destination);
        setExiting(true);
        setTimeout(() => onDismiss(notification.id), 500);
      } catch (error) {
        console.error("Erro ao gerar link da notificação:", error);
      }
    }
  };

  return (
    <button
      onClick={handleToastClick}
      style={{
        ...styles.toast,
        ...config.style,
        ...(exiting && styles.toastExiting),
      }}
      disabled={!config.link} // Desabilita o clique se não houver link
    >
      <i className={config.icon || 'fa-solid fa-bell'} style={styles.icon}></i>
      <div style={styles.content}>
        <p style={styles.title}>{config.title || 'Nova Notificação'}</p>
        <p style={styles.message}>
          {config.message && notification.data
            ? config.message(notification.data)
            : "Você tem uma nova atualização."}
        </p>
      </div>
      <button onClick={handleDismiss} style={styles.closeButton}>
        <i className="fa-solid fa-xmark"></i>
      </button>
    </button>
  );
};

export default NotificationToast;