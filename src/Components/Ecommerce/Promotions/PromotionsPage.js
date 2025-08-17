import React, { useState, useMemo, useRef, useEffect } from 'react';
import './PromotionsPage.css';

// --- Dados Estáticos ---
const staticPromotions = [
    { id: 'PROMO-001', name: 'Liquida Verão', category: 'Anéis e Colares', status: 'Ativa', totalSales: 15200.50, productCount: 25, creationDate: '01/01/2025', scheduleDate: '2025-01-15', endDate: '2025-02-15' },
    { id: 'PROMO-002', name: 'Dia das Mães', category: 'Todas as Categorias', status: 'Finalizada', totalSales: 28500.00, productCount: 150, creationDate: '10/04/2024', scheduleDate: '2024-05-01', endDate: '2024-05-12' },
    { id: 'PROMO-003', name: 'Black Friday Antecipada', category: 'Diamantes', status: 'Agendada', totalSales: 0, productCount: 12, creationDate: '01/08/2025', scheduleDate: '2025-11-01', endDate: '2025-11-28' },
    { id: 'PROMO-004', name: 'Queima de Estoque', category: 'Pulseiras', status: 'Ativa', totalSales: 8900.75, productCount: 8, creationDate: '15/07/2025', scheduleDate: '2025-07-20', endDate: '2025-07-30' },
    { id: 'PROMO-005', name: 'Especial Dia dos Namorados', category: 'Pingentes', status: 'Finalizada', totalSales: 19800.00, productCount: 40, creationDate: '10/05/2024', scheduleDate: '2024-06-01', endDate: '2024-06-12' },
    { id: 'PROMO-006', name: 'Semana da Esmeralda', category: 'Esmeraldas', status: 'Agendada', totalSales: 0, productCount: 18, creationDate: '02/09/2025', scheduleDate: '2025-09-15', endDate: '2025-09-22' },
    { id: 'PROMO-007', name: 'Flash Sale Rubis', category: 'Rubis', status: 'Ativa', totalSales: 4500.00, productCount: 5, creationDate: '05/08/2025', scheduleDate: '2025-08-05', endDate: '2025-08-06' },
];
const staticCategories = [ { id: 1, name: 'Anéis' }, { id: 2, name: 'Colares' }, { id: 3, name: 'Pulseiras' }, { id: 4, name: 'Diamantes' }, { id: 5, name: 'Esmeraldas' }, { id: 6, name: 'Rubis' }];
const staticProducts = [
    { id: 101, name: 'Anel de Diamante Solitário', category: 'Diamantes' }, { id: 102, name: 'Colar Gota de Esmeralda', category: 'Esmeraldas' },
    { id: 103, name: 'Pulseira de Ouro 18k', category: 'Pulseiras' }, { id: 104, name: 'Anel de Noivado Clássico', category: 'Anéis' },
];

const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const ITEMS_PER_PAGE = 6;

// --- Hook e Componente de Dropdown Customizado ---
const useOutsideAlerter = (ref, callback) => { useEffect(() => { function handleClickOutside(event) { if (ref.current && !ref.current.contains(event.target)) { callback(); } } document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [ref, callback]); }
const CustomDropdown = ({ options, selected, onSelect, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false); const wrapperRef = useRef(null); useOutsideAlerter(wrapperRef, () => setIsOpen(false));
    return (
        <div className="custom-dropdown-container-promo" ref={wrapperRef}>
            <button className="dropdown-header-promo" onClick={() => setIsOpen(!isOpen)}>{options.find(opt => opt.value === selected)?.label || placeholder}<i className={`fa-solid fa-chevron-down ${isOpen ? 'open' : ''}`}></i></button>
            {isOpen && (<ul className="dropdown-list-promo">{options.map(option => (<li key={option.value} onClick={() => { onSelect(option.value); setIsOpen(false); }}>{option.label}</li>))}</ul>)}
        </div>
    );
};

// --- Componente de Seleção (para o Modal de Criação) ---
const ItemSelector = ({ items, type, onSelectionChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState(new Set());

    const handleSelect = (itemId) => {
        const newSelection = new Set(selectedItems);
        if (newSelection.has(itemId)) {
            newSelection.delete(itemId);
        } else {
            newSelection.add(itemId);
        }
        setSelectedItems(newSelection);
        onSelectionChange(Array.from(newSelection));
    };

    const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="item-selector-container">
            <input type="text" className="selector-search" placeholder={`Buscar ${type}...`} onChange={(e) => setSearchTerm(e.target.value)} />
            <ul className="selector-list">
                {filteredItems.map(item => (
                    <li key={item.id}>
                        <label>
                            <input type="checkbox" checked={selectedItems.has(item.id)} onChange={() => handleSelect(item.id)} />
                            {item.name}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// --- Componente do Modal de Detalhes ---
const DetailsModal = ({ promo, onClose, isClosing }) => {
    return (
        <div className={`modal-backdrop-promo ${isClosing ? 'closing' : ''}`} onClick={onClose}>
            <div className={`modal-content-promo ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header-promo">
                    <h3>{promo.name}</h3>
                    <span className={`status-badge-promo status-${promo.status.toLowerCase()}`}>{promo.status}</span>
                </div>
                <div className="promo-details-grid">
                    <div className="promo-detail-item"><span>Total de Vendas</span><p>{formatCurrency(promo.totalSales)}</p></div>
                    <div className="promo-detail-item"><span>Produtos na Promoção</span><p>{promo.productCount}</p></div>
                    <div className="promo-detail-item"><span>Categorias</span><p>{promo.category}</p></div>
                    <div className="promo-detail-item"><span>Data de Criação</span><p>{promo.creationDate}</p></div>
                    <div className="promo-detail-item"><span>Agendamento</span><p>{promo.scheduleDate}</p></div>
                    <div className="promo-detail-item"><span>Data de Finalização</span><p>{promo.endDate}</p></div>
                </div>
                <div className="promo-actions">
                    <button className="action-btn-promo"><i className="fa-solid fa-plus"></i> Adicionar Produto</button>
                    <button className="action-btn-promo"><i className="fa-solid fa-trash-can"></i> Excluir Categoria</button>
                    <button className="action-btn-promo primary"><i className="fa-solid fa-pause"></i> Pausar Promoção</button>
                </div>
                <div className="modal-footer-promo">
                    <button className="close-btn-promo" onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>
    );
};

// --- Componente do Modal de Criação (CORRIGIDO) ---
const CreateModal = ({ onClose, isClosing }) => {
    const [applyTo, setApplyTo] = useState('all');

    return (
        <div className={`modal-backdrop-promo ${isClosing ? 'closing' : ''}`} onClick={onClose}>
            <div className={`modal-content-promo large ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header-promo">
                    <h3>Criar Nova Promoção</h3>
                </div>
                <div className="create-promo-form">
                    <div className="form-group">
                        <label>Nome da Promoção</label>
                        <input type="text" placeholder="Ex: Liquida Inverno" />
                    </div>
                    <div className="form-group">
                        <label>Tipo de Desconto</label>
                        <select>
                            <option>Porcentagem (%)</option>
                            <option>Valor Fixo (R$)</option>
                            <option>Frete Grátis</option>
                        </select>
                    </div>
                     <div className="form-group">
                        <label>Valor do Desconto</label>
                        <input type="number" placeholder="Ex: 15 (para 15%)" />
                    </div>
                    <div className="form-group full-width">
                        <label>Aplicar a</label>
                        <div className="radio-group">
                            <label><input type="radio" name="apply_to" value="all" checked={applyTo === 'all'} onChange={(e) => setApplyTo(e.target.value)} /> Todos os Produtos</label>
                            <label><input type="radio" name="apply_to" value="categories" checked={applyTo === 'categories'} onChange={(e) => setApplyTo(e.target.value)} /> Categorias Específicas</label>
                            <label><input type="radio" name="apply_to" value="products" checked={applyTo === 'products'} onChange={(e) => setApplyTo(e.target.value)} /> Produtos Específicos</label>
                        </div>
                    </div>

                    {applyTo === 'categories' && <div className="form-group full-width"><label>Selecione as Categorias</label><ItemSelector items={staticCategories} type="Categorias" onSelectionChange={() => {}} /></div>}
                    {applyTo === 'products' && <div className="form-group full-width"><label>Selecione os Produtos</label><ItemSelector items={staticProducts} type="Produtos" onSelectionChange={() => {}} /></div>}

                    <div className="form-group">
                        <label>Data de Início (Agendamento)</label>
                        <input type="date" />
                    </div>
                     <div className="form-group">
                        <label>Data de Finalização</label>
                        <input type="date" />
                    </div>
                </div>
                <div className="modal-footer-promo create">
                    <button className="close-btn-promo" onClick={onClose}>Cancelar</button>
                    <button className="action-btn-promo primary">Salvar Promoção</button>
                </div>
            </div>
        </div>
    );
};


// --- Componente Principal da Página ---
function PromotionsPage() {
    const [modal, setModal] = useState({ type: null, data: null });
    const [isClosing, setIsClosing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({ searchTerm: '', status: 'Todos' });

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };
    
    const handleOpenModal = (type, data = null) => { setModal({ type, data }); };
    const handleCloseModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setModal({ type: null, data: null });
            setIsClosing(false);
        }, 300);
    };

    const filteredPromotions = useMemo(() => {
        return staticPromotions
            .filter(promo => promo.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) || promo.id.toLowerCase().includes(filters.searchTerm.toLowerCase()))
            .filter(promo => filters.status === 'Todos' || promo.status === filters.status);
    }, [filters]);

    const totalPages = Math.ceil(filteredPromotions.length / ITEMS_PER_PAGE);
    const paginatedPromotions = filteredPromotions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const activePromos = useMemo(() => staticPromotions.filter(p => p.status === 'Ativa').length, []);
    const scheduledPromos = useMemo(() => staticPromotions.filter(p => p.status === 'Agendada').length, []);
    const topPromo = useMemo(() => {
        if (staticPromotions.length === 0) return null;
        return staticPromotions.reduce((best, current) => current.totalSales > best.totalSales ? current : best);
    }, []);

    return (
        <div className="promotions-page-container">
            <header className="promotions-page-header">
                <h1>Promoções</h1>
                <button className="create-promo-button" onClick={() => handleOpenModal('create')}>
                    <i className="fa-solid fa-plus"></i> Criar Promoção
                </button>
            </header>

            <section className="promo-kpi-cards">
                <div className="promo-kpi-card">
                    <i className="fa-solid fa-rocket"></i>
                    <div>
                        <h4>Promoções Ativas</h4>
                        <p className="kpi-main-value-promo">{activePromos}</p>
                        <p className="kpi-sub-value-promo">{scheduledPromos} Agendadas</p>
                    </div>
                </div>
                <div className="promo-kpi-card">
                    <i className="fa-solid fa-star"></i>
                    <div>
                        <h4>Promoção com Mais Vendas</h4>
                        <p className="kpi-main-value-promo">{topPromo?.name || 'N/A'}</p>
                        <p className="kpi-sub-value-promo">Total de {formatCurrency(topPromo?.totalSales || 0)}</p>
                    </div>
                </div>
            </section>

            <section className="promo-controls">
                <div className="search-box-promo">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Buscar por nome ou ID..." onChange={e => handleFilterChange('searchTerm', e.target.value)} />
                </div>
                <div className="promo-filters">
                    <CustomDropdown
                        placeholder="Status"
                        options={[
                            { value: 'Todos', label: 'Todos os Status' },
                            { value: 'Ativa', label: 'Ativa' },
                            { value: 'Agendada', label: 'Agendada' },
                            { value: 'Finalizada', label: 'Finalizada' },
                        ]}
                        selected={filters.status}
                        onSelect={(value) => handleFilterChange('status', value)}
                    />
                </div>
            </section>

            <div className="promotions-list">
                {paginatedPromotions.map(promo => (
                    <div key={promo.id} className="promo-card" onClick={() => handleOpenModal('details', promo)}>
                        <div className="promo-card-header">
                            <h4>{promo.name}</h4>
                            <span className={`status-badge-promo status-${promo.status.toLowerCase()}`}>{promo.status}</span>
                        </div>
                        <div className="promo-card-body">
                            <p><strong>ID:</strong> {promo.id}</p>
                            <p><strong>Categorias:</strong> {promo.category}</p>
                        </div>
                        <div className="promo-card-footer">
                            <span>Ver Detalhes <i className="fa-solid fa-arrow-right"></i></span>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="pagination-container-promo">
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Anterior</button>
                <span>Página {currentPage} de {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Próxima</button>
            </div>

            {modal.type === 'details' && <DetailsModal promo={modal.data} onClose={handleCloseModal} isClosing={isClosing} />}
            {modal.type === 'create' && <CreateModal onClose={handleCloseModal} isClosing={isClosing} />}
        </div>
    );
}

export default PromotionsPage;