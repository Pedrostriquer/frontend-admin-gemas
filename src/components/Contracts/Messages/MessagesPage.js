import React, { useState, useMemo, useRef, useEffect } from 'react';
import './MessagesPage.css';

// --- Dados Estáticos (Expandidos) ---
const staticMessages = [
    { id: 1, title: 'Manutenção Programada', type: 'Aviso', message: 'Nosso sistema passará por uma manutenção programada na próxima sexta-feira.', link: '', creationDate: '2025-08-10' },
    { id: 2, title: 'Nova Oportunidade de Investimento', type: 'Promoção', message: 'Confira nossa nova oferta de contrato com valorização especial!', link: 'https://gemasbrilhantes.com/nova-oferta', creationDate: '2025-08-08' },
    { id: 3, title: 'Atualização nos Termos de Uso', type: 'Atualização', message: 'Atualizamos nossos termos de uso. Por favor, revise os novos termos em nosso site.', link: 'https://gemasbrilhantes.com/termos', creationDate: '2025-08-07' },
    { id: 4, title: 'Boletim Semanal do Mercado', type: 'Notícia', message: 'As gemas valorizaram 2% na última semana. Saiba mais em nosso blog.', link: 'https://gemasbrilhantes.com/blog', creationDate: '2025-08-05' },
];
const sentHistory = [
    { messageTitle: 'Manutenção Programada', date: '2025-08-10', recipients: 'Todos os Clientes' },
    { messageTitle: 'Nova Oportunidade de Investimento', date: '2025-08-08', recipients: 'Andrei Ferreira' },
    { messageTitle: 'Boletim Semanal do Mercado', date: '2025-08-05', recipients: 'Todos os Clientes' },
    { messageTitle: 'Dia das Mães 2024', date: '2024-05-12', recipients: 'Clientes VIP' },
    { messageTitle: 'Natal Iluminado', date: '2024-12-25', recipients: 'Todos os Clientes' },
    { messageTitle: 'Atualização de Segurança', date: '2025-06-15', recipients: 'Todos os Clientes' },
    { messageTitle: 'Convite para Evento', date: '2025-07-20', recipients: 'Golden Treinamento' },
];
const staticClients = [ { id: 1, name: 'Andrei Ferreira' }, { id: 2, name: 'Eduardo Lopes Cardoso' }, { id: 3, name: 'Golden Treinamento' } ];

const ITEMS_PER_PAGE = 5;

// --- Hook e Componente de Dropdown Customizado ---
const useOutsideAlerter = (ref, callback) => { useEffect(() => { function handleClickOutside(event) { if (ref.current && !ref.current.contains(event.target)) { callback(); } } document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [ref, callback]); }
const CustomDropdown = ({ options, selected, onSelect, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false); const wrapperRef = useRef(null); useOutsideAlerter(wrapperRef, () => setIsOpen(false));
    return (
        <div className="custom-dropdown-container-msg" ref={wrapperRef}>
            <button className="dropdown-header-msg" onClick={() => setIsOpen(!isOpen)}>{options.find(opt => opt.value === selected)?.label || placeholder}<i className={`fa-solid fa-chevron-down ${isOpen ? 'open' : ''}`}></i></button>
            {isOpen && (<ul className="dropdown-list-msg">{options.map(option => (<li key={option.value} onClick={() => { onSelect(option.value); setIsOpen(false); }}>{option.label}</li>))}</ul>)}
        </div>
    );
};

// --- Componentes dos Modais ---
const ConfirmationModal = ({ message, onClose, isClosing }) => ( <div className={`modal-backdrop-msg ${isClosing ? 'closing' : ''}`} onClick={onClose}><div className={`modal-content-msg small ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}><div className="modal-header-msg"><h3>Confirmar Exclusão</h3></div><p className="confirmation-text-msg">Você tem certeza que deseja excluir a mensagem "<strong>{message.title}</strong>"?</p><div className="modal-footer-msg confirmation"><button className="cancel-btn-msg" onClick={onClose}>Cancelar</button><button className="create-btn-msg danger"><i className="fa-solid fa-trash-can"></i> Confirmar</button></div></div></div> );
const CreateEditModal = ({ message, onClose, isClosing }) => { /* ...código do modal... */ return null; };
const SendModal = ({ message, onClose, isClosing }) => { /* ...código do modal... */ return null; };

// --- Componente Principal da Página ---
function MessagesPage() {
    const [modal, setModal] = useState({ type: null, data: null });
    const [isClosing, setIsClosing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    // Novos estados para o histórico
    const [historySearchTerm, setHistorySearchTerm] = useState('');
    const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
    const [historySort, setHistorySort] = useState('date_desc');
    
    const handleOpenModal = (type, data = null) => { setModal({ type, data }); };
    const handleCloseModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setModal({ type: null, data: null });
            setIsClosing(false);
        }, 300);
    };

    const filteredMessages = useMemo(() => staticMessages.filter(msg => msg.title.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm]);
    const paginatedMessages = filteredMessages.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);

    // Lógica de filtro e ordenação para o histórico
    const filteredAndSortedHistory = useMemo(() => {
        let history = sentHistory.filter(item => item.messageTitle.toLowerCase().includes(historySearchTerm.toLowerCase()));
        history.sort((a, b) => {
            if (historySort === 'date_asc') return new Date(a.date) - new Date(b.date);
            return new Date(b.date) - new Date(a.date);
        });
        return history;
    }, [historySearchTerm, historySort]);

    const totalHistoryPages = Math.ceil(filteredAndSortedHistory.length / ITEMS_PER_PAGE);
    const paginatedHistory = filteredAndSortedHistory.slice((historyCurrentPage - 1) * ITEMS_PER_PAGE, historyCurrentPage * ITEMS_PER_PAGE);

    return (
        <div className="messages-page-container">
            <header className="messages-page-header">
                <h1>Mensagens</h1>
                <p>Crie, gerencie e envie mensagens para seus clientes.</p>
            </header>

            <div className="messages-card">
                <div className="card-header-msg">
                    <i className="fa-solid fa-envelope-open-text"></i>
                    <h3>Mensagens Criadas</h3>
                    <div className="search-box-msg"><i className="fa-solid fa-magnifying-glass"></i><input type="text" placeholder="Buscar por título..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} /></div>
                    <button className="create-message-button" onClick={() => handleOpenModal('create')}><i className="fa-solid fa-plus"></i> Criar Nova</button>
                </div>
                <table className="messages-table">
                    <thead><tr><th>Título</th><th>Tipo</th><th>Data de Criação</th><th>Ações</th></tr></thead>
                    <tbody>
                        {paginatedMessages.map(msg => (
                            <tr key={msg.id}>
                                <td className="message-title-cell">{msg.title}</td>
                                <td><span className={`type-badge-msg type-${msg.type.toLowerCase()}`}>{msg.type}</span></td>
                                <td>{new Date(msg.creationDate).toLocaleDateString('pt-BR')}</td>
                                <td>
                                    <div className="action-buttons-msg">
                                        <button className="send-btn-msg" onClick={() => handleOpenModal('send', msg)}><i className="fa-solid fa-paper-plane"></i></button>
                                        <button className="edit-btn-msg" onClick={() => handleOpenModal('edit', msg)}><i className="fa-solid fa-pencil"></i></button>
                                        <button className="delete-btn-msg" onClick={() => handleOpenModal('delete', msg)}><i className="fa-solid fa-trash-can"></i></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 <div className="pagination-container-msg">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Anterior</button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Próxima</button>
                </div>
            </div>

            <div className="messages-card">
                <div className="card-header-msg">
                    <i className="fa-solid fa-history"></i>
                    <h3>Histórico de Envios</h3>
                    <div className="search-box-msg"><i className="fa-solid fa-magnifying-glass"></i><input type="text" placeholder="Buscar por título..." value={historySearchTerm} onChange={e => { setHistorySearchTerm(e.target.value); setHistoryCurrentPage(1); }} /></div>
                    <CustomDropdown 
                        options={[{value: 'date_desc', label: 'Mais Recentes'}, {value: 'date_asc', label: 'Mais Antigos'}]}
                        selected={historySort}
                        onSelect={setHistorySort}
                        placeholder="Ordenar por"
                    />
                </div>
                <table className="messages-table">
                    <thead><tr><th>Título da Mensagem</th><th>Data do Envio</th><th>Destinatários</th></tr></thead>
                    <tbody>
                        {paginatedHistory.map((item, index) => (
                            <tr key={index}>
                                <td>{item.messageTitle}</td>
                                <td>{new Date(item.date).toLocaleDateString('pt-BR')}</td>
                                <td>{item.recipients}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination-container-msg">
                    <button onClick={() => setHistoryCurrentPage(p => Math.max(p - 1, 1))} disabled={historyCurrentPage === 1}>Anterior</button>
                    <span>Página {historyCurrentPage} de {totalHistoryPages}</span>
                    <button onClick={() => setHistoryCurrentPage(p => Math.min(p + 1, totalHistoryPages))} disabled={historyCurrentPage === totalHistoryPages}>Próxima</button>
                </div>
            </div>

            {modal.type === 'create' && <CreateEditModal onClose={handleCloseModal} isClosing={isClosing} />}
            {modal.type === 'edit' && <CreateEditModal message={modal.data} onClose={handleCloseModal} isClosing={isClosing} />}
            {modal.type === 'delete' && <ConfirmationModal message={modal.data} onClose={handleCloseModal} isClosing={isClosing} />}
            {modal.type === 'send' && <SendModal message={modal.data} onClose={handleCloseModal} isClosing={isClosing} />}
        </div>
    );
}

export default MessagesPage;