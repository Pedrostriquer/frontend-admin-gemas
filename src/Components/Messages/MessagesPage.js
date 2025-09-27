import React, { useState, useEffect, useCallback } from "react";
import styles from "./MessagesPageStyle";
import { useAuth } from "../../Context/AuthContext";
import messageService from "../../dbServices/messageService";
import clientServices from "../../dbServices/clientServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faEnvelopeOpenText,
  faTrash,
  faLink,
  faChevronRight,
  faPlus,
  faCheckCircle,
  faUsers,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const GlobalStyle = () => (
  <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    `}</style>
);

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

const ClientSelector = ({
  selectedClients,
  onSelectionChange,
  sendToAll,
  onSendToAllChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const searchClients = useCallback(
    async (search) => {
      if (!search) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const data = await clientServices.getClients(search, 1, 15);
        setSearchResults(data.items || []);
      } catch (error) {
        console.error("Erro ao buscar clientes", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  useEffect(() => {
    searchClients(debouncedSearchTerm);
  }, [debouncedSearchTerm, searchClients]);

  const handleSelect = (client) => {
    const newSelection = new Map(selectedClients);
    if (newSelection.has(client.id)) {
      newSelection.delete(client.id);
    } else {
      newSelection.set(client.id, client);
    }
    onSelectionChange(newSelection);
  };

  return (
    <div style={styles.clientSelectorContainer}>
      <div style={styles.clientSelectorHeader}>
        <label style={styles.clientSelectorCheckbox}>
          <input
            type="checkbox"
            checked={sendToAll}
            onChange={(e) => onSendToAllChange(e.target.checked)}
          />
          Enviar para todos os clientes
        </label>
      </div>
      {!sendToAll && (
        <>
          {selectedClients.size > 0 && (
            <div style={styles.selectedClientsContainer}>
              {Array.from(selectedClients.values()).map((client) => (
                <div key={client.id} style={styles.clientPill}>
                  <span>{client.name}</span>
                  <button
                    onClick={() => handleSelect(client)}
                    style={styles.pillRemoveButton}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            type="text"
            placeholder="Buscar cliente por nome ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...styles.formInput, marginBottom: "10px" }}
          />
          <div style={styles.clientList}>
            {isSearching ? (
              <p style={{ textAlign: "center", color: "#94a3b8" }}>
                Buscando...
              </p>
            ) : (
              searchResults.map((client) => (
                <div
                  key={client.id}
                  style={styles.clientListItem}
                  onClick={() => handleSelect(client)}
                >
                  <input
                    type="checkbox"
                    readOnly
                    checked={selectedClients.has(client.id)}
                    style={{ marginRight: "12px" }}
                  />
                  <img
                    src={
                      client.profilePictureUrl ||
                      `https://i.pravatar.cc/40?u=${client.id}`
                    }
                    alt={client.name}
                    style={styles.clientAvatar}
                  />
                  <span style={styles.clientName}>{client.name}</span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

const MessageCreationModal = ({ isOpen, onClose, onSubmit }) => {
  const [newMessage, setNewMessage] = useState({
    title: "",
    text: "",
    redirectUrl: "",
  });
  const [isSent, setIsSent] = useState(false);
  const [selectedClients, setSelectedClients] = useState(new Map());
  const [sendToAll, setSendToAll] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMessage((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientIds = sendToAll ? [0] : Array.from(selectedClients.keys());
    if (!sendToAll && clientIds.length === 0) {
      alert(
        'Por favor, selecione ao menos um cliente ou marque a opção "Enviar para todos".'
      );
      return;
    }

    const payload = { ...newMessage, clientIds };
    const success = await onSubmit(payload);
    if (success) {
      setIsSent(true);
      setTimeout(() => {
        onClose();
        setIsSent(false);
        setNewMessage({ title: "", text: "", redirectUrl: "" });
        setSelectedClients(new Map());
        setSendToAll(true);
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalBackdrop} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Nova Mensagem</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={styles.modalBody}>
            <input
              type="text"
              name="title"
              value={newMessage.title}
              onChange={handleInputChange}
              placeholder="Título da Mensagem"
              style={{ ...styles.formInput, marginBottom: "20px" }}
              required
            />
            <textarea
              name="text"
              value={newMessage.text}
              onChange={handleInputChange}
              placeholder="Escreva sua mensagem aqui..."
              style={{
                ...styles.formInput,
                minHeight: "120px",
                resize: "vertical",
              }}
              required
            ></textarea>
            <input
              type="text"
              name="redirectUrl"
              value={newMessage.redirectUrl}
              onChange={handleInputChange}
              placeholder="Link de Redirecionamento (Opcional)"
              style={{ ...styles.formInput, marginTop: "20px" }}
            />
            <ClientSelector
              selectedClients={selectedClients}
              onSelectionChange={setSelectedClients}
              sendToAll={sendToAll}
              onSendToAllChange={setSendToAll}
            />
          </div>
          <div style={styles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              style={{ ...styles.modalButton, ...styles.modalButtonCancel }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{ ...styles.modalButton, ...styles.modalButtonSubmit }}
            >
              <FontAwesomeIcon icon={isSent ? faCheckCircle : faPaperPlane} />{" "}
              {isSent ? "Enviada!" : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MessageItem = ({ message, isExpanded, onToggle, onDelete }) => {
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isToAll = message.clientIds?.length === 1 && message.clientIds[0] === 0;

  return (
    <div
      style={{
        ...styles.messageItem,
        animationDelay: `${message.index * 0.05}s`,
      }}
    >
      <div style={styles.messageHeader} onClick={onToggle}>
        <div style={styles.messageIcon}>
          <FontAwesomeIcon icon={isToAll ? faUsers : faEnvelopeOpenText} />
        </div>
        <div style={styles.messageTitleWrapper}>
          <h3 style={styles.messageTitle}>{message.title}</h3>
          <span style={styles.messageTime}>
            {formatDateTime(message.createdAt)}
          </span>
        </div>
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{
            ...styles.expandIcon,
            ...(isExpanded && styles.expandIconExpanded),
          }}
        />
      </div>
      <div
        style={{
          ...styles.messageDetail,
          ...(isExpanded
            ? styles.messageDetailExpanded
            : styles.messageDetailCollapsed),
        }}
      >
        <div style={styles.messageDetailContent}>
          <div style={styles.recipientsContainer}>
            <h4 style={styles.recipientsTitle}>Destinatários</h4>
            {isToAll ? (
              <span style={styles.allClientsBadge}>Todos os Clientes</span>
            ) : (
              <div style={styles.stackedAvatars}>
                {message.clients?.slice(0, 5).map((client) => (
                  <img
                    key={client.id}
                    src={
                      client.profilePictureUrl ||
                      `https://i.pravatar.cc/40?u=${client.id}`
                    }
                    alt={client.name}
                    style={styles.stackedAvatar}
                  />
                ))}
                {message.clients?.length > 5 && (
                  <span
                    style={{
                      ...styles.stackedAvatar,
                      backgroundColor: "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    +{message.clients.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>
          <p style={styles.messageText}>{message.text}</p>
          <div style={styles.messageFooter}>
            {message.redirectUrl ? (
              <a
                href={message.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.messageLink}
              >
                <FontAwesomeIcon icon={faLink} /> {message.redirectUrl}
              </a>
            ) : (
              <div></div>
            )}
            <button onClick={onDelete} style={styles.deleteButton}>
              <FontAwesomeIcon icon={faTrash} /> Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedMessageId, setExpandedMessageId] = useState(null);
  const { token } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const fetchMessages = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await messageService.getMessages();
      setMessages(data);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const handleSubmit = async (newMessage) => {
    if (!newMessage.title || !newMessage.text) {
      alert("Título e Texto são obrigatórios.");
      return false;
    }
    try {
      await messageService.createMessage(newMessage);
      await fetchMessages();
      return true;
    } catch (error) {
      console.error("Erro ao criar mensagem:", error);
      alert("Não foi possível enviar a mensagem.");
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta mensagem?")) {
      try {
        await messageService.deleteMessage(id);
        await fetchMessages();
      } catch (error) {
        console.error("Erro ao excluir mensagem:", error);
        alert("Não foi possível excluir a mensagem.");
      }
    }
  };

  const handleToggleExpand = (id) => {
    setExpandedMessageId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div style={styles.messagesPageContainer}>
      <GlobalStyle />
      <MessageCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Central de Mensagens</h1>
        <button
          style={{
            ...styles.newMessageButton,
            ...(isHovered && styles.newMessageButtonHover),
          }}
          onClick={() => setIsModalOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <FontAwesomeIcon icon={faPlus} /> Nova Mensagem
        </button>
      </div>
      <div style={styles.messageList}>
        {loading ? (
          <p>Carregando mensagens...</p>
        ) : (
          messages.map((msg, index) => (
            <MessageItem
              key={msg.id}
              message={{ ...msg, index }}
              isExpanded={expandedMessageId === msg.id}
              onToggle={() => handleToggleExpand(msg.id)}
              onDelete={() => handleDelete(msg.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
