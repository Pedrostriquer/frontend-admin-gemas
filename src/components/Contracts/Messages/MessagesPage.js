import React, { useState, useMemo, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styles from './MessagesPage.styles.js';

// --- Dados Estáticos ---
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
];

const ITEMS_PER_PAGE = 5;

// --- Estilos Globais para Animações ---
const GlobalStyles = () => (
    <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes scaleDown { from { transform: scale(1); opacity: 1; } to { transform: scale(0.95); opacity: 0; } }
    `}</style>
);

// --- Hook e Componente de Dropdown Customizado ---
const useOutsideAlerter = (ref, callback) => { useEffect(() => { function handleClickOutside(event) { if (ref.current && !ref.current.contains(event.target)) { callback(); } } document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [ref, callback]); }
const CustomDropdown = ({ options, selected, onSelect, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false); const wrapperRef = useRef(null); useOutsideAlerter(wrapperRef, () => setIsOpen(false));
    return (
        <div style={styles.customDropdownContainer} ref={wrapperRef}>
            <button style={styles.dropdownHeader} onClick={() => setIsOpen(!isOpen)}>{options.find(opt => opt.value === selected)?.label || placeholder}<i className={`fa-solid fa-chevron-down`} style={{...styles.dropdownHeaderIcon, ...(isOpen && styles.dropdownHeaderIconOpen)}}></i></button>
            {isOpen && (<ul style={styles.dropdownList}>{options.map(option => (<li key={option.value} style={styles.dropdownListItem} onClick={() => { onSelect(option.value); setIsOpen(false); }}>{option.label}</li>))}</ul>)}
        </div>
    );
};

// --- Componentes dos Modais ---
const ConfirmationModal = ({ message, onClose, isClosing }) => ( 
    ReactDOM.createPortal(
        <div style={{...styles.modalBackdrop, ...(isClosing && styles.modalBackdropClosing)}} onClick={onClose}>
            <GlobalStyles />
            <div style={{...styles.modalContent, ...styles.modalContentSmall, ...(isClosing && styles.modalContentClosing)}} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}><h3 style={styles.modalHeaderH3}>Confirmar Exclusão</h3></div>
                <p style={styles.confirmationText}>Você tem certeza que deseja excluir a mensagem "<strong>{message.title}</strong>"?</p>
                <div style={{...styles.modalFooter, ...styles.modalFooterConfirmation}}>
                    <button style={styles.cancelBtn} onClick={onClose}>Cancelar</button>
                    <button style={{...styles.createBtn, ...styles.createBtnDanger}}><i className="fa-solid fa-trash-can"></i> Confirmar</button>
                </div>
            </div>
        </div>, document.body
    )
);
const CreateEditModal = ({ message, onClose, isClosing }) => {
    const isEditing = !!message;
    return ReactDOM.createPortal(
        <div style={{...styles.modalBackdrop, ...(isClosing && styles.modalBackdropClosing)}} onClick={onClose}>
            <GlobalStyles />
            <div style={{...styles.modalContent, ...(isClosing && styles.modalContentClosing)}} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}><h3 style={styles.modalHeaderH3}>{isEditing ? 'Editar Mensagem' : 'Nova Mensagem'}</h3></div>
                <div style={styles.createMessageForm}>
                    <div style={styles.formGroup}><label style={styles.formLabel}>Tipo da Mensagem</label><select style={styles.formInput} defaultValue={isEditing ? message.type : 'Aviso'}><option>Aviso</option><option>Promoção</option><option>Atualização</option><option>Notícia</option></select></div>
                    <div style={styles.formGroup}><label style={styles.formLabel}>Título</label><input type="text" style={styles.formInput} placeholder="Ex: Manutenção Programada" defaultValue={isEditing ? message.title : ''} /></div>
                    <div style={styles.formGroup}><label style={styles.formLabel}>Mensagem</label><textarea rows="4" style={{...styles.formInput, ...styles.formTextarea}} placeholder="Descreva a mensagem aqui..." defaultValue={isEditing ? message.message : ''}></textarea></div>
                    <div style={styles.formGroup}><label style={styles.formLabel}>Link (Opcional)</label><input type="text" style={styles.formInput} placeholder="Cole um link aqui..." defaultValue={isEditing ? message.link : ''} /></div>
                </div>
                <div style={styles.modalFooter}>
                    <button style={styles.cancelBtn} onClick={onClose}>Cancelar</button>
                    <button style={styles.createBtn}>{isEditing ? 'Salvar Alterações' : 'Criar'}</button>
                </div>
            </div>
        </div>, document.body
    );
};
const SendModal = ({ message, onClose, isClosing }) => {
    return ReactDOM.createPortal(
        <div style={{...styles.modalBackdrop, ...(isClosing && styles.modalBackdropClosing)}} onClick={onClose}>
            <GlobalStyles />
            <div style={{...styles.modalContent, ...(isClosing && styles.modalContentClosing)}} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}><h3 style={styles.modalHeaderH3}>Enviar Mensagem: {message.title}</h3></div>
                <div style={styles.sendMessageBody}>
                    <button style={styles.sendAllBtn}><i className="fa-solid fa-users"></i> Enviar para Todos os Clientes</button>
                    <div style={styles.divider}><div style={styles.dividerLine}></div><span style={styles.dividerText}>OU</span><div style={styles.dividerLine}></div></div>
                    <div style={styles.clientSearch}>
                        <label style={styles.clientSearchLabel}>Enviar para um Cliente Específico</label>
                        <input type="text" style={styles.formInput} placeholder="Pesquisar cliente por nome..." />
                    </div>
                </div>
                 <div style={styles.modalFooter}>
                    <button style={styles.cancelBtn} onClick={onClose}>Cancelar</button>
                    <button style={{...styles.createBtn, ...styles.sendBtn}}><i className="fa-solid fa-paper-plane"></i> Enviar</button>
                </div>
            </div>
        </div>, document.body
    );
};

// --- Componente Principal da Página ---
function MessagesPage() {
    const [modal, setModal] = useState({ type: null, data: null });
    const [isClosing, setIsClosing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [historySearchTerm, setHistorySearchTerm] = useState('');
    const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
    const [historySort, setHistorySort] = useState('date_desc');
    const [hoveredButton, setHoveredButton] = useState(null);
    
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

    const filteredAndSortedHistory = useMemo(() => {
        let history = sentHistory.filter(item => item.messageTitle.toLowerCase().includes(historySearchTerm.toLowerCase()));
        history.sort((a, b) => {
            if (historySort === 'date_asc') return new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-'));
            return new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-'));
        });
        return history;
    }, [historySearchTerm, historySort]);

    const totalHistoryPages = Math.ceil(filteredAndSortedHistory.length / ITEMS_PER_PAGE);
    const paginatedHistory = filteredAndSortedHistory.slice((historyCurrentPage - 1) * ITEMS_PER_PAGE, historyCurrentPage * ITEMS_PER_PAGE);

    return (
        <div style={styles.messagesPageContainer}>
            <header style={styles.messagesPageHeader}>
                <h1 style={styles.headerH1}>Mensagens</h1>
                <p style={styles.headerP}>Crie, gerencie e envie mensagens para seus clientes.</p>
            </header>

            <div style={styles.messagesCard}>
                <div style={styles.cardHeader}>
                    <i className="fa-solid fa-envelope-open-text" style={styles.cardHeaderIcon}></i>
                    <h3 style={styles.cardHeaderH3}>Mensagens Criadas</h3>
                    <div style={styles.searchBox}><i className="fa-solid fa-magnifying-glass"></i><input type="text" placeholder="Buscar por título..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} style={styles.searchInput} /></div>
                    <button style={styles.createMessageButton} onClick={() => handleOpenModal('create')}><i className="fa-solid fa-plus"></i> Criar Nova</button>
                </div>
                <table style={styles.messagesTable}>
                    <thead><tr><th style={styles.tableHeaderCell}>Título</th><th style={styles.tableHeaderCell}>Tipo</th><th style={styles.tableHeaderCell}>Data de Criação</th><th style={styles.tableHeaderCell}>Ações</th></tr></thead>
                    <tbody>
                        {paginatedMessages.map(msg => (
                            <tr key={msg.id}>
                                <td style={{...styles.tableCell, ...styles.messageTitleCell}}>{msg.title}</td>
                                <td style={styles.tableCell}><span style={{...styles.typeBadge, ...styles[`type${msg.type.toLowerCase()}`]}}>{msg.type}</span></td>
                                <td style={styles.tableCell}>{new Date(msg.creationDate).toLocaleDateString('pt-BR')}</td>
                                <td style={styles.tableCell}>
                                    <div style={styles.actionButtons}>
                                        <button style={{...styles.actionButton, ...styles.sendBtn}} onClick={() => handleOpenModal('send', msg)}><i className="fa-solid fa-paper-plane"></i></button>
                                        <button style={{...styles.actionButton, ...styles.editBtn}} onClick={() => handleOpenModal('edit', msg)}><i className="fa-solid fa-pencil"></i></button>
                                        <button style={{...styles.actionButton, ...styles.deleteBtn}} onClick={() => handleOpenModal('delete', msg)}><i className="fa-solid fa-trash-can"></i></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 <div style={styles.paginationContainer}>
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                        disabled={currentPage === 1}
                        style={{...styles.paginationButton, ...(currentPage === 1 && styles.paginationButtonDisabled), ...(hoveredButton === 'prev1' && styles.paginationButtonHover)}}
                        onMouseEnter={() => setHoveredButton('prev1')}
                        onMouseLeave={() => setHoveredButton(null)}
                    >Anterior</button>
                    <span style={styles.paginationSpan}>Página {currentPage} de {totalPages}</span>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                        disabled={currentPage === totalPages}
                        style={{...styles.paginationButton, ...(currentPage === totalPages && styles.paginationButtonDisabled), ...(hoveredButton === 'next1' && styles.paginationButtonHover)}}
                        onMouseEnter={() => setHoveredButton('next1')}
                        onMouseLeave={() => setHoveredButton(null)}
                    >Próxima</button>
                </div>
            </div>

            <div style={styles.messagesCard}>
                <div style={styles.cardHeader}>
                    <i className="fa-solid fa-history" style={styles.cardHeaderIcon}></i>
                    <h3 style={styles.cardHeaderH3}>Histórico de Envios</h3>
                    <div style={styles.searchBox}><i className="fa-solid fa-magnifying-glass"></i><input type="text" placeholder="Buscar por título..." value={historySearchTerm} onChange={e => { setHistorySearchTerm(e.target.value); setHistoryCurrentPage(1); }} style={styles.searchInput} /></div>
                    <CustomDropdown 
                        options={[{value: 'date_desc', label: 'Mais Recentes'}, {value: 'date_asc', label: 'Mais Antigos'}]}
                        selected={historySort}
                        onSelect={setHistorySort}
                        placeholder="Ordenar por"
                    />
                </div>
                <table style={styles.messagesTable}>
                    <thead><tr><th style={styles.tableHeaderCell}>Título da Mensagem</th><th style={styles.tableHeaderCell}>Data do Envio</th><th style={styles.tableHeaderCell}>Destinatários</th></tr></thead>
                    <tbody>
                        {paginatedHistory.map((item, index) => (
                            <tr key={index}>
                                <td style={styles.tableCell}>{item.messageTitle}</td>
                                <td style={styles.tableCell}>{new Date(item.date).toLocaleDateString('pt-BR')}</td>
                                <td style={styles.tableCell}>{item.recipients}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={styles.paginationContainer}>
                    <button 
                        onClick={() => setHistoryCurrentPage(p => Math.max(p - 1, 1))} 
                        disabled={historyCurrentPage === 1}
                        style={{...styles.paginationButton, ...(historyCurrentPage === 1 && styles.paginationButtonDisabled), ...(hoveredButton === 'prev2' && styles.paginationButtonHover)}}
                        onMouseEnter={() => setHoveredButton('prev2')}
                        onMouseLeave={() => setHoveredButton(null)}
                    >Anterior</button>
                    <span style={styles.paginationSpan}>Página {historyCurrentPage} de {totalHistoryPages}</span>
                    <button 
                        onClick={() => setHistoryCurrentPage(p => Math.min(p + 1, totalHistoryPages))} 
                        disabled={historyCurrentPage === totalHistoryPages}
                        style={{...styles.paginationButton, ...(historyCurrentPage === totalHistoryPages && styles.paginationButtonDisabled), ...(hoveredButton === 'next2' && styles.paginationButtonHover)}}
                        onMouseEnter={() => setHoveredButton('next2')}
                        onMouseLeave={() => setHoveredButton(null)}
                    >Próxima</button>
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