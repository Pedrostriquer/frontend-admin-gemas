import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './OffersPage.styles.js';

// --- Dados Estáticos ---
const staticOffers = [
    { id: 1, name: 'Oferta Especial de Verão', imageUrl: 'https://placehold.co/600x300/3b82f6/ffffff?text=Oferta+Especial', redirectUrl: 'https://gemasbrilhantes.com/promo1', assignedClients: [1, 3, 5] },
    { id: 2, name: 'Campanha de Investimento', imageUrl: 'https://placehold.co/600x300/10b981/ffffff?text=Invista+Agora', redirectUrl: 'https://gemasbrilhantes.com/invest', assignedClients: [2, 4] },
    { id: 3, name: 'Bônus por Indicação', imageUrl: 'https://placehold.co/600x300/f59e0b/ffffff?text=Bônus+de+Indicação', redirectUrl: 'https://gemasbrilhantes.com/referral', assignedClients: [] },
    { id: 4, name: 'Oportunidade Única', imageUrl: 'https://placehold.co/600x300/ef4444/ffffff?text=Oportunidade', redirectUrl: 'https://gemasbrilhantes.com/oportunidade', assignedClients: [1, 2, 3, 4, 5, 6] },
];
const staticClients = [
    { id: 1, name: 'Andrei Ferreira', avatar: 'https://i.pravatar.cc/40?u=1' }, { id: 2, name: 'Eduardo Lopes Cardoso', avatar: 'https://i.pravatar.cc/40?u=2' },
    { id: 3, name: 'Golden Treinamento', avatar: 'https://i.pravatar.cc/40?u=3' }, { id: 4, name: 'Samara Mahmud', avatar: 'https://i.pravatar.cc/40?u=4' },
    { id: 5, name: 'Luciano da Rocha Berto', avatar: 'https://i.pravatar.cc/40?u=5' }, { id: 6, name: 'Priscila Lopes', avatar: 'https://i.pravatar.cc/40?u=6' },
    { id: 7, name: 'Fabiano Baldasso', avatar: 'https://i.pravatar.cc/40?u=7' }, { id: 8, name: 'Juliana Paes', avatar: 'https://i.pravatar.cc/40?u=8' },
];
const sentHistory = [
    { offerName: 'Oferta Especial de Verão', date: '10/08/2025', recipients: 1500 },
    { offerName: 'Campanha de Investimento', date: '05/08/2025', recipients: 1250 },
    { offerName: 'Bônus por Indicação', date: '01/08/2025', recipients: 980 },
    { offerName: 'Dia das Mães 2024', date: '12/05/2024', recipients: 2200 },
    { offerName: 'Natal Iluminado', date: '25/12/2024', recipients: 3100 },
];

const ITEMS_PER_PAGE = 3;
const CLIENTS_PER_MODAL_PAGE = 4;

// --- Estilos Globais para Animações ---
const GlobalStyles = () => (
    <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes scaleDown { from { transform: scale(1); opacity: 1; } to { transform: scale(0.95); opacity: 0; } }
    `}</style>
);

// --- Componente Reutilizável de Seleção de Cliente ---
const ClientSelector = ({ initialSelection = [], onSelectionChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedClients, setSelectedClients] = useState(new Set(initialSelection));

    const handleSelect = (clientId) => {
        const newSelection = new Set(selectedClients);
        newSelection.has(clientId) ? newSelection.delete(clientId) : newSelection.add(clientId);
        setSelectedClients(newSelection);
        onSelectionChange(newSelection);
    };
    
    const handleSelectAllPage = () => {
        const newSelection = new Set(selectedClients);
        paginatedClients.forEach(client => newSelection.add(client.id));
        setSelectedClients(newSelection);
        onSelectionChange(newSelection);
    };

    const filteredClients = staticClients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalPages = Math.ceil(filteredClients.length / CLIENTS_PER_MODAL_PAGE);
    const paginatedClients = filteredClients.slice((currentPage - 1) * CLIENTS_PER_MODAL_PAGE, currentPage * CLIENTS_PER_MODAL_PAGE);

    return (
        <div style={styles.clientSelectorContainer}>
            <div style={styles.clientSelectorControls}>
                <input type="text" placeholder="Buscar cliente..." onChange={e => setSearchTerm(e.target.value)} style={styles.clientSelectorControlsInput} />
                <button onClick={handleSelectAllPage} style={styles.clientSelectorControlsButton}>Selecionar Todos da Página</button>
            </div>
            <ul style={styles.clientSelectorList}>
                {paginatedClients.map(client => (
                    <li key={client.id}>
                        <label style={styles.clientSelectorListItemLabel}>
                            <input type="checkbox" checked={selectedClients.has(client.id)} onChange={() => handleSelect(client.id)} />
                            {client.name}
                        </label>
                    </li>
                ))}
            </ul>
            <div style={styles.paginationContainerModal}>
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} style={styles.paginationModalButton}>&lt;</button>
                <span style={styles.paginationModalSpan}>{currentPage} de {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} style={styles.paginationModalButton}>&gt;</button>
            </div>
        </div>
    );
};


// --- Componentes dos Modais ---
const ConfirmationModal = ({ offer, onClose, isClosing }) => ( 
    ReactDOM.createPortal(
        <div style={{...styles.modalBackdrop, ...(isClosing && styles.modalBackdropClosing)}} onClick={onClose}>
            <GlobalStyles />
            <div style={{...styles.modalContent, ...styles.modalContentSmall, ...(isClosing && styles.modalContentClosing)}} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}><h3 style={styles.modalHeaderH3}>Confirmar Exclusão</h3></div>
                <p style={styles.confirmationText}>Você tem certeza que deseja excluir a oferta "<strong>{offer.name}</strong>"?</p>
                <div style={{...styles.modalFooter, ...styles.modalFooterConfirmation}}>
                    <button style={styles.closeBtn} onClick={onClose}>Cancelar</button>
                    <button style={{...styles.saveOfferButton, ...styles.saveOfferButtonDanger}}><i className="fa-solid fa-trash-can"></i> Confirmar</button>
                </div>
            </div>
        </div>, document.body
    )
);
const EditOfferModal = ({ offer, onClose, isClosing }) => {
    const [selectedClients, setSelectedClients] = useState(new Set(offer.assignedClients));
    return ReactDOM.createPortal(
        <div style={{...styles.modalBackdrop, ...(isClosing && styles.modalBackdropClosing)}} onClick={onClose}>
            <GlobalStyles />
            <div style={{...styles.modalContent, ...styles.modalContentLargeV2, ...(isClosing && styles.modalContentClosing)}} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}><h3 style={styles.modalHeaderH3}>Editar Oferta</h3></div>
                <div style={styles.editOfferGrid}>
                    <div style={styles.formColumn}>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Nome da Oferta</label><input type="text" defaultValue={offer.name} style={styles.formInput} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Link da Imagem</label><input type="text" defaultValue={offer.imageUrl} style={styles.formInput} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Link de Redirecionamento</label><input type="text" defaultValue={offer.redirectUrl} style={styles.formInput} /></div>
                    </div>
                    <div style={styles.clientColumn}>
                        <label style={styles.clientColumnLabel}>Clientes Selecionados</label>
                        <ClientSelector initialSelection={offer.assignedClients} onSelectionChange={setSelectedClients} />
                    </div>
                </div>
                <div style={styles.modalFooter}>
                    <div style={styles.stackedCardsInfoFooter}>
                        <div style={styles.stackedCardsFooter}>{Array.from(selectedClients).slice(0, 3).map((id, index) => (<img key={id} src={staticClients.find(c=>c.id === id)?.avatar} alt="avatar" style={{...styles.stackedCardsFooterImg, zIndex: 3 - index, transform: `translateX(${index * 15}px)` }} />))}</div>
                        <span style={styles.stackedCardsInfoFooterSpan}>{selectedClients.size} cliente(s) selecionado(s)</span>
                    </div>
                    <div>
                        <button style={styles.closeBtn} onClick={onClose}>Cancelar</button>
                        <button style={styles.saveOfferButton}><i className="fa-solid fa-save"></i> Salvar</button>
                    </div>
                </div>
            </div>
        </div>, document.body
    );
};
const SendOfferModal = ({ offer, onClose, isClosing }) => {
    const [selectedClients, setSelectedClients] = useState(new Set());
    return ReactDOM.createPortal(
        <div style={{...styles.modalBackdrop, ...(isClosing && styles.modalBackdropClosing)}} onClick={onClose}>
            <GlobalStyles />
            <div style={{...styles.modalContent, ...styles.modalContentLargeV2, ...(isClosing && styles.modalContentClosing)}} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}><h3 style={styles.modalHeaderH3}>Enviar Oferta: {offer.name}</h3></div>
                <div style={styles.editOfferGrid}>
                    <div style={styles.formColumn}>
                        <label style={styles.formLabel}>Preview da Oferta</label>
                        <img src={offer.imageUrl} alt={offer.name} style={styles.sendPreviewImg} />
                    </div>
                    <div style={styles.clientColumn}>
                        <label style={styles.clientColumnLabel}>Selecionar Destinatários</label>
                        <ClientSelector onSelectionChange={setSelectedClients} />
                    </div>
                </div>
                <div style={styles.modalFooter}>
                    <div style={styles.stackedCardsInfoFooter}>
                        <div style={styles.stackedCardsFooter}>{Array.from(selectedClients).slice(0, 3).map((id, index) => (<img key={id} src={staticClients.find(c=>c.id === id)?.avatar} alt="avatar" style={{...styles.stackedCardsFooterImg, zIndex: 3 - index, transform: `translateX(${index * 15}px)` }} />))}</div>
                        <span style={styles.stackedCardsInfoFooterSpan}>{selectedClients.size} cliente(s) selecionado(s)</span>
                    </div>
                    <div>
                        <button style={styles.closeBtn} onClick={onClose}>Cancelar</button>
                        <button style={styles.saveOfferButton}><i className="fa-solid fa-paper-plane"></i> Enviar</button>
                    </div>
                </div>
            </div>
        </div>, document.body
    );
};

// --- Componente Principal da Página ---
function OffersPage() {
    const [modal, setModal] = useState({ type: null, data: null });
    const [isClosing, setIsClosing] = useState(false);
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [redirectUrl, setRedirectUrl] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [historySearchTerm, setHistorySearchTerm] = useState('');
    const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
    
    const handleOpenModal = (type, data = null) => { setModal({ type, data }); };
    const handleCloseModal = () => { setIsClosing(true); setTimeout(() => { setModal({ type: null, data: null }); setIsClosing(false); }, 300); };
    
    const handleCreateOffer = () => {
        if (!name || !imageUrl || !redirectUrl) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        alert(`Oferta "${name}" criada!`);
        setName(''); setImageUrl(''); setRedirectUrl('');
    };

    const filteredOffers = useMemo(() => staticOffers.filter(offer => offer.name.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm]);
    const totalPages = Math.ceil(filteredOffers.length / ITEMS_PER_PAGE);
    const paginatedOffers = filteredOffers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const filteredHistory = useMemo(() => sentHistory.filter(item => item.offerName.toLowerCase().includes(historySearchTerm.toLowerCase())), [historySearchTerm]);
    const totalHistoryPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
    const paginatedHistory = filteredHistory.slice((historyCurrentPage - 1) * ITEMS_PER_PAGE, historyCurrentPage * ITEMS_PER_PAGE);

    return (
        <div style={styles.offersPageContainer}>
            <header style={styles.offersPageHeader}>
                <h1 style={styles.headerH1}>Ofertas</h1>
                <p style={styles.headerP}>Crie e gerencie banners de ofertas para seus clientes.</p>
            </header>
            <div style={styles.offerCreationCard}>
                <div style={styles.creationCardGrid}>
                    <div style={styles.offerFormSection}>
                        <div style={{...styles.cardHeader, ...styles.cardHeaderNoBorder}}><i className="fa-solid fa-upload" style={styles.cardHeaderIcon}></i><h3 style={styles.cardHeaderH3}>Upload de Oferta</h3></div>
                        <div style={styles.cardBody}>
                            <div style={styles.formGroup}><label style={styles.formLabel}>Nome da Oferta</label><input type="text" placeholder="Ex: Campanha de Inverno" value={name} onChange={e => setName(e.target.value)} style={styles.formInput} /></div>
                            <div style={styles.formGroup}><label style={styles.formLabel}>Link da Imagem</label><input type="text" placeholder="https://exemplo.com/imagem.png" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={styles.formInput} /></div>
                            <div style={styles.formGroup}><label style={styles.formLabel}>Link de Redirecionamento</label><input type="text" placeholder="https://gemasbrilhantes.com/sua-pagina" value={redirectUrl} onChange={e => setRedirectUrl(e.target.value)} style={styles.formInput} /></div>
                        </div>
                        <div style={styles.cardFooter}><button style={styles.saveOfferButton} onClick={handleCreateOffer}><i className="fa-solid fa-save"></i> Salvar Oferta</button></div>
                    </div>
                    <div style={styles.offerPreviewSection}>
                        <div style={styles.previewArea}>{imageUrl ? <img src={imageUrl} alt="Preview da Oferta" style={styles.previewImage} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x300/e0e0e0/a0a0a0?text=Imagem+Inválida'; }} /> : <div style={styles.placeholderPreview}><i className="fa-solid fa-image" style={styles.placeholderPreviewIcon}></i><p>A pré-visualização da imagem aparecerá aqui.</p></div>}</div>
                    </div>
                </div>
            </div>
            <div style={styles.existingOffersCard}>
                <div style={styles.cardHeader}>
                    <i className="fa-solid fa-list-check" style={styles.cardHeaderIcon}></i>
                    <h3 style={styles.cardHeaderH3}>Ofertas Existentes</h3>
                    <div style={styles.searchBox}><i className="fa-solid fa-magnifying-glass"></i><input type="text" placeholder="Buscar por nome..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} style={styles.searchInput} /></div>
                </div>
                <table style={styles.offersTable}>
                    <thead><tr><th style={styles.tableHeaderCell}>Nome</th><th style={styles.tableHeaderCell}>Preview</th><th style={styles.tableHeaderCell}>Link de Redirecionamento</th><th style={styles.tableHeaderCell}>Ações</th></tr></thead>
                    <tbody>
                        {paginatedOffers.map(offer => (
                            <tr key={offer.id}>
                                <td style={{...styles.tableCell, ...styles.offerNameCell}}>{offer.name}</td>
                                <td style={styles.tableCell}><img src={offer.imageUrl} alt={offer.name} style={styles.tableImgPreview} /></td>
                                <td style={styles.tableCell}><a href={offer.redirectUrl} target="_blank" rel="noopener noreferrer" style={styles.tableCellLink}>{offer.redirectUrl}</a></td>
                                <td style={styles.tableCell}>
                                    <div style={styles.actionButtons}>
                                        <button style={{...styles.actionButton, ...styles.sendBtn}} onClick={() => handleOpenModal('send', offer)}><i className="fa-solid fa-paper-plane"></i></button>
                                        <button style={{...styles.actionButton, ...styles.editBtn}} onClick={() => handleOpenModal('edit', offer)}><i className="fa-solid fa-pencil"></i></button>
                                        <button style={{...styles.actionButton, ...styles.deleteBtn}} onClick={() => handleOpenModal('delete', offer)}><i className="fa-solid fa-trash-can"></i></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 <div style={styles.paginationContainer}>
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} style={styles.paginationButton}>Anterior</button>
                    <span style={styles.paginationSpan}>Página {currentPage} de {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} style={styles.paginationButton}>Próxima</button>
                </div>
            </div>
            <div style={styles.existingOffersCard}>
                <div style={styles.cardHeader}>
                    <i className="fa-solid fa-history" style={styles.cardHeaderIcon}></i>
                    <h3 style={styles.cardHeaderH3}>Histórico de Ofertas</h3>
                    <div style={styles.searchBox}><i className="fa-solid fa-magnifying-glass"></i><input type="text" placeholder="Buscar por nome..." value={historySearchTerm} onChange={e => { setHistorySearchTerm(e.target.value); setHistoryCurrentPage(1); }} style={styles.searchInput} /></div>
                </div>
                <table style={styles.offersTable}>
                    <thead><tr><th style={styles.tableHeaderCell}>Nome da Oferta</th><th style={styles.tableHeaderCell}>Data do Disparo</th><th style={styles.tableHeaderCell}>Destinatários</th></tr></thead>
                    <tbody>
                        {paginatedHistory.map((item, index) => (
                            <tr key={index}>
                                <td style={styles.tableCell}>{item.offerName}</td>
                                <td style={styles.tableCell}>{item.date}</td>
                                <td style={styles.tableCell}>{item.recipients}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 <div style={styles.paginationContainer}>
                    <button onClick={() => setHistoryCurrentPage(p => Math.max(p - 1, 1))} disabled={historyCurrentPage === 1} style={styles.paginationButton}>Anterior</button>
                    <span style={styles.paginationSpan}>Página {historyCurrentPage} de {totalHistoryPages}</span>
                    <button onClick={() => setHistoryCurrentPage(p => Math.min(p + 1, totalHistoryPages))} disabled={historyCurrentPage === totalHistoryPages} style={styles.paginationButton}>Próxima</button>
                </div>
            </div>

            {modal.type === 'edit' && <EditOfferModal offer={modal.data} onClose={handleCloseModal} isClosing={isClosing} />}
            {modal.type === 'delete' && <ConfirmationModal offer={modal.data} onClose={handleCloseModal} isClosing={isClosing} />}
            {modal.type === 'send' && <SendOfferModal offer={modal.data} onClose={handleCloseModal} isClosing={isClosing} />}
        </div>
    );
}

export default OffersPage;