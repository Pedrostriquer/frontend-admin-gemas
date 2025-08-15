import React, { useState, useMemo, useRef, useEffect } from 'react';
import './OffersPage.css';

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
        <div className="client-selector-container">
            <div className="client-selector-controls">
                <input type="text" placeholder="Buscar cliente..." onChange={e => setSearchTerm(e.target.value)} />
                <button onClick={handleSelectAllPage}>Selecionar Todos da Página</button>
            </div>
            <ul className="client-selector-list">
                {paginatedClients.map(client => (
                    <li key={client.id}>
                        <label>
                            <input type="checkbox" checked={selectedClients.has(client.id)} onChange={() => handleSelect(client.id)} />
                            {client.name}
                        </label>
                    </li>
                ))}
            </ul>
            <div className="pagination-container-modal">
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>&lt;</button>
                <span>{currentPage} de {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>&gt;</button>
            </div>
        </div>
    );
};


// --- Componentes dos Modais ---
const ConfirmationModal = ({ offer, onClose, isClosing }) => ( <div className={`modal-backdrop-off ${isClosing ? 'closing' : ''}`} onClick={onClose}><div className={`modal-content-off small ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}><div className="modal-header-off"><h3>Confirmar Exclusão</h3></div><p className="confirmation-text-off">Você tem certeza que deseja excluir a oferta "<strong>{offer.name}</strong>"?</p><div className="modal-footer-off confirmation"><button className="close-btn-off" onClick={onClose}>Cancelar</button><button className="save-offer-button danger"><i className="fa-solid fa-trash-can"></i> Confirmar</button></div></div></div> );
const EditOfferModal = ({ offer, onClose, isClosing }) => {
    const [selectedClients, setSelectedClients] = useState(new Set(offer.assignedClients));
    return (
        <div className={`modal-backdrop-off ${isClosing ? 'closing' : ''}`} onClick={onClose}>
            <div className={`modal-content-off large v2 ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header-off"><h3>Editar Oferta</h3></div>
                <div className="edit-offer-grid">
                    <div className="form-column-off">
                        <div className="form-group-off"><label>Nome da Oferta</label><input type="text" defaultValue={offer.name} /></div>
                        <div className="form-group-off"><label>Link da Imagem</label><input type="text" defaultValue={offer.imageUrl} /></div>
                        <div className="form-group-off"><label>Link de Redirecionamento</label><input type="text" defaultValue={offer.redirectUrl} /></div>
                    </div>
                    <div className="client-column-off">
                        <label>Clientes Selecionados</label>
                        <ClientSelector initialSelection={offer.assignedClients} onSelectionChange={setSelectedClients} />
                    </div>
                </div>
                <div className="modal-footer-off">
                    <div className="stacked-cards-info-footer">
                        <div className="stacked-cards-footer">{Array.from(selectedClients).slice(0, 3).map((id, index) => (<img key={id} src={staticClients.find(c=>c.id === id)?.avatar} alt="avatar" style={{ zIndex: 3 - index, transform: `translateX(${index * 15}px)` }} />))}</div>
                        <span>{selectedClients.size} cliente(s) selecionado(s)</span>
                    </div>
                    <div>
                        <button className="close-btn-off" onClick={onClose}>Cancelar</button>
                        <button className="save-offer-button"><i className="fa-solid fa-save"></i> Salvar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
const SendOfferModal = ({ offer, onClose, isClosing }) => {
    const [selectedClients, setSelectedClients] = useState(new Set());
    return (
        <div className={`modal-backdrop-off ${isClosing ? 'closing' : ''}`} onClick={onClose}>
            <div className={`modal-content-off large v2 ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header-off"><h3>Enviar Oferta: {offer.name}</h3></div>
                <div className="edit-offer-grid">
                    <div className="form-column-off">
                        <label>Preview da Oferta</label>
                        <img src={offer.imageUrl} alt={offer.name} className="send-preview-img" />
                    </div>
                    <div className="client-column-off">
                        <label>Selecionar Destinatários</label>
                        <ClientSelector onSelectionChange={setSelectedClients} />
                    </div>
                </div>
                <div className="modal-footer-off">
                    <div className="stacked-cards-info-footer">
                        <div className="stacked-cards-footer">{Array.from(selectedClients).slice(0, 3).map((id, index) => (<img key={id} src={staticClients.find(c=>c.id === id)?.avatar} alt="avatar" style={{ zIndex: 3 - index, transform: `translateX(${index * 15}px)` }} />))}</div>
                        <span>{selectedClients.size} cliente(s) selecionado(s)</span>
                    </div>
                    <div>
                        <button className="close-btn-off" onClick={onClose}>Cancelar</button>
                        <button className="save-offer-button"><i className="fa-solid fa-paper-plane"></i> Enviar</button>
                    </div>
                </div>
            </div>
        </div>
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
        <div className="offers-page-container">
            <header className="offers-page-header">
                <h1>Ofertas</h1>
                <p>Crie e gerencie banners de ofertas para seus clientes.</p>
            </header>
            <div className="offer-creation-card">
                <div className="creation-card-grid">
                    <div className="offer-form-section">
                        <div className="card-header-off no-border"><i className="fa-solid fa-upload"></i><h3>Upload de Oferta</h3></div>
                        <div className="card-body-off">
                            <div className="form-group-off"><label>Nome da Oferta</label><input type="text" placeholder="Ex: Campanha de Inverno" value={name} onChange={e => setName(e.target.value)} /></div>
                            <div className="form-group-off"><label>Link da Imagem</label><input type="text" placeholder="https://exemplo.com/imagem.png" value={imageUrl} onChange={e => setImageUrl(e.target.value)} /></div>
                            <div className="form-group-off"><label>Link de Redirecionamento</label><input type="text" placeholder="https://gemasbrilhantes.com/sua-pagina" value={redirectUrl} onChange={e => setRedirectUrl(e.target.value)} /></div>
                        </div>
                        <div className="card-footer-off"><button className="save-offer-button" onClick={handleCreateOffer}><i className="fa-solid fa-save"></i> Salvar Oferta</button></div>
                    </div>
                    <div className="offer-preview-section">
                        <div className="preview-area">{imageUrl ? <img src={imageUrl} alt="Preview da Oferta" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x300/e0e0e0/a0a0a0?text=Imagem+Inválida'; }} /> : <div className="placeholder-preview"><i className="fa-solid fa-image"></i><p>A pré-visualização da imagem aparecerá aqui.</p></div>}</div>
                    </div>
                </div>
            </div>
            <div className="existing-offers-card">
                <div className="card-header-off">
                    <i className="fa-solid fa-list-check"></i>
                    <h3>Ofertas Existentes</h3>
                    <div className="search-box-off"><i className="fa-solid fa-magnifying-glass"></i><input type="text" placeholder="Buscar por nome..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} /></div>
                </div>
                <table className="offers-table">
                    <thead><tr><th>Nome</th><th>Preview</th><th>Link de Redirecionamento</th><th>Ações</th></tr></thead>
                    <tbody>
                        {paginatedOffers.map(offer => (
                            <tr key={offer.id}>
                                <td className="offer-name-cell">{offer.name}</td>
                                <td><img src={offer.imageUrl} alt={offer.name} className="table-img-preview" /></td>
                                <td><a href={offer.redirectUrl} target="_blank" rel="noopener noreferrer">{offer.redirectUrl}</a></td>
                                <td>
                                    <div className="action-buttons-off">
                                        <button className="send-btn-off" onClick={() => handleOpenModal('send', offer)}><i className="fa-solid fa-paper-plane"></i></button>
                                        <button className="edit-btn-off" onClick={() => handleOpenModal('edit', offer)}><i className="fa-solid fa-pencil"></i></button>
                                        <button className="delete-btn-off" onClick={() => handleOpenModal('delete', offer)}><i className="fa-solid fa-trash-can"></i></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 <div className="pagination-container-off">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Anterior</button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Próxima</button>
                </div>
            </div>
            <div className="existing-offers-card">
                <div className="card-header-off">
                    <i className="fa-solid fa-history"></i>
                    <h3>Histórico de Ofertas</h3>
                    <div className="search-box-off"><i className="fa-solid fa-magnifying-glass"></i><input type="text" placeholder="Buscar por nome..." value={historySearchTerm} onChange={e => { setHistorySearchTerm(e.target.value); setHistoryCurrentPage(1); }} /></div>
                </div>
                <table className="offers-table">
                    <thead><tr><th>Nome da Oferta</th><th>Data do Disparo</th><th>Destinatários</th></tr></thead>
                    <tbody>
                        {paginatedHistory.map((item, index) => (
                            <tr key={index}>
                                <td>{item.offerName}</td>
                                <td>{item.date}</td>
                                <td>{item.recipients}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 <div className="pagination-container-off">
                    <button onClick={() => setHistoryCurrentPage(p => Math.max(p - 1, 1))} disabled={historyCurrentPage === 1}>Anterior</button>
                    <span>Página {historyCurrentPage} de {totalHistoryPages}</span>
                    <button onClick={() => setHistoryCurrentPage(p => Math.min(p + 1, totalHistoryPages))} disabled={historyCurrentPage === totalHistoryPages}>Próxima</button>
                </div>
            </div>

            {modal.type === 'edit' && <EditOfferModal offer={modal.data} onClose={handleCloseModal} isClosing={isClosing} />}
            {modal.type === 'delete' && <ConfirmationModal offer={modal.data} onClose={handleCloseModal} isClosing={isClosing} />}
            {modal.type === 'send' && <SendOfferModal offer={modal.data} onClose={handleCloseModal} isClosing={isClosing} />}
        </div>
    );
}

export default OffersPage;