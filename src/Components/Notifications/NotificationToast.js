import React, { useEffect, useState } from "react";
import styles from "./NotificationStyle";
import { useNavigate } from "react-router-dom";

// --- ATUALIZAÇÃO PRINCIPAL AQUI ---
const notificationConfig = {
  NEW_CLIENT: {
    icon: "fa-solid fa-user-plus",
    title: "Novo Cliente Cadastrado!",
    style: styles.clientToast,
    message: (data) => `O cliente ${data.name} acaba de se cadastrar.`,
    link: (data) => `/platform/clients/${data.id}`,
  },
  
  // Manteve-se a notificação de contrato antigo, caso ainda use em algum lugar.
  NEW_CONTRACT: {
    icon: "fa-solid fa-file-signature",
    title: "Novo Contrato!",
    style: styles.contractToast,
    message: (data) =>
      `${data.clientName} comprou um contrato de ${data.amount.toLocaleString(
        "pt-BR",
        { style: "currency", currency: "BRL" }
      )}.`,
    link: (data) => `/platform/contracts/${data.id}`,
  },
  
  // NOVA CONFIGURAÇÃO PARA CONTRATOS PENDENTES
  NEW_CONTRACT_PENDING_PAYMENT: {
    icon: "fa-solid fa-hourglass-start", // Ícone de ampulheta, mais adequado
    title: "Contrato Aguardando Pagamento!",
    style: styles.withdrawalToast, // Usando a cor laranja para indicar "atenção"
    message: (data) =>
      `${data.clientName} criou um contrato de ${data.amount.toLocaleString(
        "pt-BR",
        { style: "currency", currency: "BRL" }
      )} via ${data.paymentMethod}.`, // Mensagem mais informativa
    link: (data) => `/platform/contracts/${data.id}`, // Leva para a mesma página de detalhes
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
  
  // O '|| {}' garante que o código não quebre se o tipo de notificação não existir
  const config = notificationConfig[notification.type] || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(notification.id), 500);
    }, 5000); // Notificação some em 5 segundos

    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  const handleDismiss = (e) => {
    e.stopPropagation();
    setExiting(true);
    setTimeout(() => onDismiss(notification.id), 500);
  };

  const handleToastClick = () => {
    if (config.link) {
      const destination = config.link(notification.data);
      navigate(destination);
      setExiting(true);
      setTimeout(() => onDismiss(notification.id), 500);
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
    >
      <i className={config.icon || 'fa-solid fa-bell'} style={styles.icon}></i> {/* Ícone padrão */}
      <div style={styles.content}>
        <p style={styles.title}>{config.title || 'Nova Notificação'}</p>
        <p style={styles.message}>
          {config.message
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