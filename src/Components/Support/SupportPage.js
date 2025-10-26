import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ticketService from '../../dbServices/ticketService';
import adminService from '../../dbServices/adminService';
import './SupportPage.css';

// ===================================================================
//              COMPONENTE: MODAL DE CRIAÇÃO DE TICKET
// ===================================================================
const CreateTicketModal = ({ onClose, onTicketCreated }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [relatedTo, setRelatedTo] = useState('');
  const [specificInfo, setSpecificInfo] = useState('');
  const [otherSubject, setOtherSubject] = useState('');
  const [userDescription, setUserDescription] = useState('');

  const descriptionPrefix = useMemo(() => {
    if (relatedTo === 'contrato' && specificInfo) {
      return `Referente ao Contrato ID: ${specificInfo}\n\n---\n\n`;
    }
    if (relatedTo === 'cliente' && specificInfo) {
      return `Referente ao Cliente (CPF/Nome): ${specificInfo}\n\n---\n\n`;
    }
    if (relatedTo === 'outro' && otherSubject) {
      return `Referente a: ${otherSubject}\n\n---\n\n`;
    }
    return '';
  }, [relatedTo, specificInfo, otherSubject]);

  const handleDescriptionChange = (e) => {
    const fullText = e.target.value;
    if (fullText.startsWith(descriptionPrefix)) {
      setUserDescription(fullText.substring(descriptionPrefix.length));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalDescription = descriptionPrefix + userDescription;
      await ticketService.createTicket({
        title,
        category,
        description: finalDescription,
      });
      alert('Chamado criado com sucesso!');
      onTicketCreated();
      onClose();
    } catch (error) {
      alert('Falha ao criar o chamado.');
    }
  };

  return (
    <div className="SupportPage-modal-backdrop" onClick={onClose}>
      <div className="SupportPage-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="SupportPage-modal-header">
          <h2>Criar Novo Chamado</h2>
          <button onClick={onClose} className="SupportPage-modal-close-button">
            &times;
          </button>
        </div>
        <div className="SupportPage-modal-body">
          <form onSubmit={handleSubmit}>
            <div className="SupportPage-form-group">
              <label htmlFor="title">Título do Chamado</label>
              <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="SupportPage-form-group">
              <label htmlFor="category">Categoria do Problema</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Selecione...</option>
                <option value="BUG">Bug no Sistema</option>
                <option value="DUVIDA">Dúvida</option>
                <option value="ATUALIZACAO">Sugestão de Melhoria</option>
                <option value="URGENTE">Problema Urgente</option>
                <option value="OUTRO">Outro</option>
              </select>
            </div>
            {category && (
              <div className="SupportPage-form-group">
                <label htmlFor="relatedTo">Referente a quê?</label>
                <select id="relatedTo" value={relatedTo} onChange={(e) => setRelatedTo(e.target.value)}>
                  <option value="">Selecione...</option>
                  <option value="contrato">Contrato</option>
                  <option value="cliente">Cliente</option>
                  <option value="outro">Outro Assunto</option>
                </select>
              </div>
            )}
            {relatedTo === 'contrato' && (
              <div className="SupportPage-form-group">
                <label htmlFor="specificInfo">ID do Contrato</label>
                <input id="specificInfo" type="text" value={specificInfo} onChange={(e) => setSpecificInfo(e.target.value)} />
              </div>
            )}
            {relatedTo === 'cliente' && (
              <div className="SupportPage-form-group">
                <label htmlFor="specificInfo">CPF/Nome do Cliente</label>
                <input id="specificInfo" type="text" value={specificInfo} onChange={(e) => setSpecificInfo(e.target.value)} />
              </div>
            )}
            {relatedTo === 'outro' && (
              <div className="SupportPage-form-group">
                <label htmlFor="otherSubject">Especifique</label>
                <input id="otherSubject" type="text" value={otherSubject} onChange={(e) => setOtherSubject(e.target.value)} />
              </div>
            )}
            <div className="SupportPage-form-group">
              <label htmlFor="description">Descrição Detalhada</label>
              <textarea id="description" value={descriptionPrefix + userDescription} onChange={handleDescriptionChange} required />
            </div>
            <div className="SupportPage-modal-footer">
              <button type="submit" className="SupportPage-submit-ticket-button">
                Abrir Chamado
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ===================================================================
//                  COMPONENTE: LISTA DE TICKETS
// ===================================================================
const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1, total: 0, pageSize: 12 });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await ticketService.getAllTickets(currentPage, debouncedSearchTerm, statusFilter);
      setTickets(response.data);
      setMeta(response.meta);
    } catch (error) {
      console.error('Erro ao carregar os chamados:', error);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, statusFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter]);

  return (
    <>
      <div className="SupportPage-header">
        <h1>Central de Suporte</h1>
        <button className="SupportPage-new-ticket-button" onClick={() => setIsModalOpen(true)}>
          <i className="fa-solid fa-plus"></i>Novo Chamado
        </button>
      </div>

      <div className="SupportPage-filters-container">
        <input
          type="text"
          className="SupportPage-search-input"
          placeholder="Buscar por título ou ID do ticket..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="SupportPage-status-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos os Status</option>
          <option value="PENDENTE">Pendente</option>
          <option value="EM_ANDAMENTO">Em Andamento</option>
          <option value="EM_TESTES">Em Testes</option>
          <option value="ENTREGUE">Entregue</option>
          <option value="RECUSADO">Recusado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      {isLoading ? (
        <h4>Carregando chamados...</h4>
      ) : (
        <div className="SupportPage-ticket-grid">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <Link to={`/support/${ticket.id}`} key={ticket.id} className={`SupportPage-ticket-card category-${ticket.category.toLowerCase()}`}>
                <div className="SupportPage-card-header">
                  <span className="SupportPage-ticket-id">TICKET #{ticket.id}</span>
                  <span className={`SupportPage-status-badge SupportPage-status-${ticket.status.toLowerCase()}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="SupportPage-card-body">
                  <h3>{ticket.title}</h3>
                </div>
                <div className="SupportPage-card-footer">
                  <span>{ticket.requesterName}</span>
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))
          ) : (
            <p>Nenhum chamado encontrado para os filtros aplicados.</p>
          )}
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="SupportPage-pagination-container">
          <span className="SupportPage-pagination-info">
            Página {meta.page} de {meta.totalPages}
          </span>
          <div className="SupportPage-pagination-controls">
            <button
              className="SupportPage-pagination-button"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <button
              className="SupportPage-pagination-button"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === meta.totalPages}
            >
              Próxima
            </button>
          </div>
        </div>
      )}

      {isModalOpen && <CreateTicketModal onClose={() => setIsModalOpen(false)} onTicketCreated={fetchTickets} />}
    </>
  );
};

// ===================================================================
//                  COMPONENTE: DETALHES DO TICKET
// ===================================================================
const TicketDetail = ({ ticketId, onBack }) => {
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const [ticketData, adminData] = await Promise.all([
          ticketService.getTicketById(ticketId),
          adminService.getCurrentAdmin(),
        ]);

        setTicket(ticketData);
        setMessages(ticketData.messages || []);
        setAdminEmail(adminData.email);
      } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [ticketId]);

  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newMessage.trim()) return;

      try {
        const addedMessage = await ticketService.addMessageToTicket(ticketId, newMessage);
        setMessages((prev) => [...prev, addedMessage]);
        setNewMessage('');
      } catch (error) {
        alert('Erro ao enviar mensagem.');
      }
    },
    [newMessage, ticketId]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (isLoading) return <h4>Carregando detalhes...</h4>;
  if (!ticket) return <h4>Chamado não encontrado.</h4>;

  return (
    <div className="SupportPage-ticket-detail-view">
      <div className="SupportPage-detail-header">
        <button className="SupportPage-back-button" onClick={onBack} title="Voltar">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div className="SupportPage-detail-title">
          <h2>{ticket.title}</h2>
          <span className="SupportPage-ticket-id">TICKET #{ticket.id}</span>
        </div>
      </div>
      <div className="SupportPage-ticket-detail-grid">
        <div className="SupportPage-info-panel">
          <h3>Detalhes</h3>
          <div className="SupportPage-info-item">
            <label>Status</label>
            <p>
              <span className={`SupportPage-status-badge SupportPage-status-${ticket.status.toLowerCase()}`}>
                {ticket.status.replace('_', ' ')}
              </span>
            </p>
          </div>
          <div className="SupportPage-info-item">
            <label>Categoria</label>
            <p>{ticket.category}</p>
          </div>
          <div className="SupportPage-info-item">
            <label>Solicitante</label>
            <p>{ticket.requesterName}</p>
          </div>
          <div className="SupportPage-info-item">
            <label>Contato</label>
            <p>{ticket.contact}</p>
          </div>
          <div className="SupportPage-info-item">
            <label>Criado em</label>
            <p>{new Date(ticket.createdAt).toLocaleString()}</p>
          </div>
          <div className="SupportPage-info-item">
            <label>Descrição</label>
            <p>{ticket.description}</p>
          </div>
        </div>
        <div className="SupportPage-chat-panel">
          <h3>Mensagens</h3>
          <div className="SupportPage-chat-container">
            <div className="SupportPage-chat-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`SupportPage-chat-message ${
                    msg.user?.email === adminEmail
                      ? 'SupportPage-message-sent'
                      : 'SupportPage-message-received'
                  }`}
                >
                  <div className="SupportPage-message-bubble">{msg.text}</div>
                  <p className="SupportPage-message-meta">
                    {msg.user?.email} • {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
            <form className="SupportPage-chat-input-form" onSubmit={handleSendMessage}>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem..."
              />
              <button type="submit">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===================================================================
//                  COMPONENTE PRINCIPAL (CONTROLADOR)
// ===================================================================
function SupportPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="SupportPage-container">
      {ticketId ? (
        <TicketDetail ticketId={ticketId} onBack={() => navigate('/support')} />
      ) : (
        <TicketList />
      )}
    </div>
  );
}

export default SupportPage;