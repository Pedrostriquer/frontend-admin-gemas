import React, { useEffect, useState } from "react";
import styles from "./NotificationStyle";
// NOVO: Importar o useNavigate para poder navegar entre as páginas
import { useNavigate } from "react-router-dom";

const notificationConfig = {
  NEW_CLIENT: {
    icon: "fa-solid fa-user-plus",
    title: "Novo Cliente Cadastrado!",
    style: styles.clientToast,
    message: (data) => `O cliente ${data.name} acaba de se cadastrar.`,
    // NOVO: Definindo o link de destino. A função recebe os dados para montar a URL.
    link: (data) => `/platform/clients/${data.id}`,
  },
  NEW_CONTRACT: {
    icon: "fa-solid fa-file-signature",
    title: "Novo Contrato!",
    style: styles.contractToast,
    message: (data) =>
      `${data.clientName} comprou um contrato de ${data.amount.toLocaleString(
        "pt-BR",
        { style: "currency", currency: "BRL" }
      )}.`,
    // NOVO: Link para a página de detalhes do contrato
    link: (data) => `/platform/contracts/${data.id}`,
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
    // NOVO: Link para a página de detalhes do saque
    link: (data) => `/platform/withdraws/${data.id}`,
  },
};

const NotificationToast = ({ notification, onDismiss }) => {
  const [exiting, setExiting] = useState(false);
  // NOVO: Inicializar o hook de navegação
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
    // NOVO: Impede que o clique no botão de fechar também navegue
    e.stopPropagation();
    setExiting(true);
    setTimeout(() => onDismiss(notification.id), 500);
  };

  // NOVO: Função que será chamada ao clicar na notificação
  const handleToastClick = () => {
    if (config.link) {
      // Monta o link usando os dados da notificação
      const destination = config.link(notification.data);
      // Navega para o destino
      navigate(destination);
      // Fecha a notificação após o clique
      setExiting(true);
      setTimeout(() => onDismiss(notification.id), 500);
    }
  };

  return (
    // MUDANÇA: O div principal agora é um botão clicável
    <button
      onClick={handleToastClick}
      style={{
        ...styles.toast,
        ...config.style,
        ...(exiting && styles.toastExiting),
      }}
    >
      <i className={config.icon} style={styles.icon}></i>
      <div style={styles.content}>
        <p style={styles.title}>{config.title}</p>
        <p style={styles.message}>
          {config.message
            ? config.message(notification.data)
            : "Nova notificação"}
        </p>
      </div>
      <button onClick={handleDismiss} style={styles.closeButton}>
        <i className="fa-solid fa-xmark"></i>
      </button>
    </button>
  );
};

export default NotificationToast;
