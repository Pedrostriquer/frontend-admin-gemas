import React, { useState, useMemo, useRef, useEffect } from 'react';
import './ProductsPage.css';

// --- Dados Estáticos ---
const staticProducts = [
    { id: 101, name: "Anel de Diamante 'Solitário'", image: 'https://placehold.co/80x80/a78bfa/ffffff?text=Anel', categories: ['Anéis', 'Diamantes'], price: 4500.00, stock: 15, status: 'Ativo', creationDate: '2025-01-10', description: 'Um anel clássico com um diamante solitário de 1 quilate.', promotionId: 'PROMO-003' },
    { id: 102, name: "Colar de Esmeralda 'Gota'", image: 'https://placehold.co/80x80/4ade80/ffffff?text=Colar', categories: ['Colares', 'Esmeraldas'], price: 3200.00, stock: 8, status: 'Ativo', creationDate: '2025-02-20', description: 'Colar elegante com uma esmeralda em formato de gota.', promotionId: 'PROMO-006' },
    { id: 103, name: "Brincos de Safira 'Azul Real'", image: 'https://placehold.co/80x80/60a5fa/ffffff?text=Brinco', categories: ['Brincos'], price: 2850.00, stock: 0, status: 'Inativo', creationDate: '2025-03-05', description: 'Par de brincos com safiras azuis intensas.', promotionId: null },
    { id: 104, name: "Pulseira de Rubi 'Eterna'", image: 'https://placehold.co/80x80/f87171/ffffff?text=Pulseira', categories: ['Pulseiras', 'Rubis'], price: 3550.00, stock: 12, status: 'Ativo', creationDate: '2025-04-15', description: 'Pulseira delicada com rubis cravejados.', promotionId: 'PROMO-007' },
    { id: 105, name: "Pingente de Opala 'Galáxia'", image: 'https://placehold.co/80x80/c084fc/ffffff?text=Pingente', categories: ['Pingentes'], price: 1800.00, stock: 25, status: 'Ativo', creationDate: '2025-05-01', description: 'Pingente único com uma opala que reflete cores vibrantes.', promotionId: null },
];
const staticCategories = ['Anéis', 'Colares', 'Brincos', 'Pulseiras', 'Pingentes', 'Diamantes', 'Esmeraldas', 'Rubis'];
const staticPromotions = [ { id: 'PROMO-003', name: 'Black Friday' }, { id: 'PROMO-006', name: 'Semana da Esmeralda' }, { id: 'PROMO-007', name: 'Flash Sale Rubis' }];

const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const ITEMS_PER_PAGE = 5;

// --- Hook customizado para fechar dropdown ao clicar fora ---
const useOutsideAlerter = (ref, callback) => {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref, callback]);
}

// --- Componente de Dropdown Customizado ---
const CustomDropdown = ({ options, selected, onSelect, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, () => setIsOpen(false));

    return (
        <div className="custom-dropdown-container" ref={wrapperRef}>
            <button className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
                {options.find(opt => opt.value === selected)?.label || placeholder}
                <i className={`fa-solid fa-chevron-down ${isOpen ? 'open' : ''}`}></i>
            </button>
            {isOpen && (
                <ul className="dropdown-list">
                    {options.map(option => (
                        <li key={option.value} onClick={() => { onSelect(option.value); setIsOpen(false); }}>
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// --- Componente de Dropdown com Pesquisa ---
const SearchableDropdown = ({ options, selected, onSelect, placeholder, quickActions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, () => setIsOpen(false));

    const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));
    const selectedLabel = options.find(opt => opt.value === selected)?.label || placeholder;

    return (
        <div className="custom-dropdown-container" ref={wrapperRef}>
            <button className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
                {selectedLabel}
                <i className={`fa-solid fa-chevron-down ${isOpen ? 'open' : ''}`}></i>
            </button>
            {isOpen && (
                <div className="dropdown-list searchable">
                    {quickActions && <div className="quick-actions">{quickActions.map(action => <button key={action.value} onClick={() => { onSelect(action.value); setIsOpen(false); }}>{action.label}</button>)}</div>}
                    <div className="dropdown-search-wrapper">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input type="text" className="dropdown-search" placeholder="Buscar..." onChange={e => setSearchTerm(e.target.value)} autoFocus/>
                    </div>
                    <ul>
                        {filteredOptions.length > 0 ? filteredOptions.map(option => (
                            <li key={option.value} onClick={() => { onSelect(option.value); setIsOpen(false); }}>
                                {option.label}
                            </li>
                        )) : <li className="no-results">Nenhum resultado</li>}
                    </ul>
                </div>
            )}
        </div>
    );
};


// --- Componente do Modal de Produto ---
const ProductModal = ({ product, onClose, onSave, isClosing }) => {
    const isEditing = !!product;
    const [name, setName] = useState(isEditing ? product.name : '');
    const [description, setDescription] = useState(isEditing ? product.description : '');
    const [categories, setCategories] = useState(isEditing ? product.categories : []);
    const [promotion, setPromotion] = useState(isEditing ? product.promotionId : null);

    return (
        <div className={`modal-backdrop-prod ${isClosing ? 'closing' : ''}`} onClick={onClose}>
            <div className={`modal-content-prod v2 ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header-prod"><h3>{isEditing ? 'Editar Produto' : 'Criar Novo Produto'}</h3></div>
                <div className="modal-body-prod">
                    <div className="product-form-grid v2">
                        <div className="form-col-1">
                            <div className="product-image-uploader"><img src={isEditing ? product.image : 'https://placehold.co/200x200/e0e0e0/a0a0a0?text=Imagem'} alt="Product" /><button>Trocar Imagem</button></div>
                            <div className="form-group-prod"><label>Status</label><CustomDropdown options={[{value: 'Ativo', label: 'Ativo'}, {value: 'Inativo', label: 'Inativo'}]} selected={isEditing ? product.status : 'Ativo'} onSelect={() => {}} /></div>
                        </div>
                        <div className="form-col-2">
                            <div className="form-group-prod"><label>Nome do Produto</label><input type="text" value={name} onChange={e => setName(e.target.value)} /></div>
                            <div className="form-group-prod"><label>Descrição</label><textarea rows="4" value={description} onChange={e => setDescription(e.target.value)}></textarea></div>
                            <div className="form-group-row">
                                <div className="form-group-prod"><label>Preço (R$)</label><input type="number" defaultValue={isEditing ? product.price : ''} /></div>
                                <div className="form-group-prod"><label>Estoque</label><input type="number" defaultValue={isEditing ? product.stock : ''} /></div>
                            </div>
                        </div>
                        <div className="form-col-3">
                            <div className="form-group-prod"><label>Categorias</label><SearchableDropdown placeholder="Adicionar Categoria..." options={staticCategories.map(c => ({value: c, label: c}))} onSelect={(cat) => !categories.includes(cat) && setCategories([...categories, cat])} />
                                <div className="category-tags">{categories.map(cat => <span key={cat}>{cat} <i className="fa-solid fa-xmark" onClick={() => setCategories(categories.filter(c => c !== cat))}></i></span>)}</div>
                            </div>
                            <div className="form-group-prod"><label>Promoção Ativa</label><SearchableDropdown placeholder="Associar Promoção..." options={[{value: null, label: 'Nenhuma'}, ...staticPromotions.map(p => ({value: p.id, label: p.name}))]} selected={promotion} onSelect={setPromotion} /></div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer-prod"><button className="close-btn-prod" onClick={onClose}>Cancelar</button><button className="save-btn-prod" onClick={onSave}><i className="fa-solid fa-check"></i> Salvar Produto</button></div>
            </div>
        </div>
    );
};

// --- Componente do Modal de Confirmação ---
const ConfirmationModal = ({ count, action, onConfirm, onClose, isClosing }) => (
    <div className={`modal-backdrop-prod ${isClosing ? 'closing' : ''}`} onClick={onClose}>
        <div className={`modal-content-prod small ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
            <div className="modal-header-prod"><h3>Confirmar Ação</h3></div>
            <p className="confirmation-text">Você tem certeza que deseja <strong>{action.toLowerCase()} {count} {count > 1 ? 'produtos' : 'produto'}</strong> selecionado(s)?</p>
            <div className="modal-footer-prod confirmation">
                <button className="close-btn-prod" onClick={onClose}>Cancelar</button>
                <button className="save-btn-prod confirm" onClick={onConfirm}><i className="fa-solid fa-check"></i> Confirmar</button>
            </div>
        </div>
    </div>
);

// --- Componente do Modal de Ação em Massa ---
const BulkActionModal = ({ selectedProducts, actionType, onClose, isClosing }) => {
    const items = actionType === 'categoria' ? staticCategories.map(c => ({id: c, name: c})) : staticPromotions;
    const title = actionType === 'categoria' ? 'Adicionar à Categoria' : 'Adicionar à Promoção';

    return (
        <div className={`modal-backdrop-prod ${isClosing ? 'closing' : ''}`} onClick={onClose}>
            <div className={`modal-content-prod medium v2 ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header-prod"><h3>{title}</h3></div>
                <div className="bulk-action-body">
                    <div className="stacked-cards-info">
                        <div className="stacked-cards">
                            {selectedProducts.slice(0, 3).map((p, index) => (
                                <img key={p.id} src={p.image} alt={p.name} style={{ zIndex: 3 - index, transform: `translate(${index * 10}px, ${index * -10}px)` }} />
                            ))}
                        </div>
                        <p>{selectedProducts.length} {selectedProducts.length > 1 ? 'produtos selecionados' : 'produto selecionado'}</p>
                    </div>
                    <SearchableDropdown placeholder={`Buscar ${actionType}...`} options={items.map(i => ({value: i.id, label: i.name}))} onSelect={() => {}} />
                </div>
                <div className="modal-footer-prod">
                    <button className="close-btn-prod" onClick={onClose}>Cancelar</button>
                    <button className="save-btn-prod"><i className="fa-solid fa-plus"></i> Adicionar</button>
                </div>
            </div>
        </div>
    );
};


// --- Componente Principal da Página ---
function ProductsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [modal, setModal] = useState({ type: null, data: null });
    const [isClosing, setIsClosing] = useState(false);
    const [filters, setFilters] = useState({ searchTerm: '', status: 'Todos', category: 'Todas', promotion: 'Todas', minPrice: '', maxPrice: '', sort: 'date_desc' });
    const [selectedProducts, setSelectedProducts] = useState(new Set());
    
    const handleFilterChange = (name, value) => { setFilters(prev => ({ ...prev, [name]: value })); setCurrentPage(1); };
    
    const handleOpenModal = (type, data = null) => { setModal({ type, data }); };
    const handleCloseModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setModal({ type: null, data: null });
            setIsClosing(false);
        }, 300);
    };

    const filteredProducts = useMemo(() => {
        let products = staticProducts
            .filter(p => p.name.toLowerCase().includes(filters.searchTerm.toLowerCase()))
            .filter(p => filters.status === 'Todos' || p.status === filters.status)
            .filter(p => filters.category === 'Todas' || p.categories.includes(filters.category))
            .filter(p => {
                if (filters.promotion === 'Todas') return true;
                if (filters.promotion === 'Sim') return !!p.promotionId;
                if (filters.promotion === 'Não') return !p.promotionId;
                return p.promotionId === filters.promotion;
            })
            .filter(p => filters.minPrice === '' || p.price >= parseFloat(filters.minPrice))
            .filter(p => filters.maxPrice === '' || p.price <= parseFloat(filters.maxPrice));

        products.sort((a, b) => {
            switch (filters.sort) {
                case 'price_asc': return a.price - b.price;
                case 'price_desc': return b.price - a.price;
                case 'date_asc': return new Date(a.creationDate) - new Date(b.creationDate);
                default: return new Date(b.creationDate) - new Date(a.creationDate);
            }
        });
        return products;
    }, [filters]);
    
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const totalStockValue = useMemo(() => staticProducts.reduce((acc, p) => acc + (p.price * p.stock), 0), []);

    const handleSelectAll = (e) => {
        if (e.target.checked) { setSelectedProducts(new Set(paginatedProducts.map(p => p.id))); } else { setSelectedProducts(new Set()); }
    };
    const handleSelectOne = (productId) => {
        const newSelection = new Set(selectedProducts);
        if (newSelection.has(productId)) { newSelection.delete(productId); } else { newSelection.add(productId); }
        setSelectedProducts(newSelection);
    };

    const selectedProductsData = useMemo(() => Array.from(selectedProducts).map(id => staticProducts.find(p => p.id === id)), [selectedProducts]);
    
    return (
        <div className="products-page-container">
            <header className="products-page-header"><h1>Produtos</h1><p>Gerencie o catálogo da sua loja.</p></header>
            <section className="product-kpi-cards">
                <div className="product-kpi-card v2"><i className="fa-solid fa-boxes-stacked"></i><div><h4>Inventário de Produtos</h4><p className="kpi-main-value">{staticProducts.length} <span className="kpi-unit">Total</span></p><p className="kpi-sub-value">{staticProducts.filter(p => p.status === 'Ativo').length} Ativos</p></div></div>
                <div className="product-kpi-card v2"><i className="fa-solid fa-dollar-sign"></i><div><h4>Valor em Estoque</h4><p className="kpi-main-value">{formatCurrency(totalStockValue / 1000)}<span className="kpi-unit">k</span></p><p className="kpi-sub-value">Valor total dos produtos</p></div></div>
                <div className="product-kpi-card v2"><i className="fa-solid fa-cart-shopping"></i><div><h4>Carrinhos Abandonados</h4><p className="kpi-main-value">98</p><p className="kpi-sub-value">Valor estimado: R$ 21.1k</p></div></div>
            </section>
            <section className="product-controls-wrapper">
                <div className="product-controls"><div className="search-box-prod"><i className="fa-solid fa-magnifying-glass"></i><input type="text" name="searchTerm" placeholder="Buscar por nome..." onChange={(e) => handleFilterChange('searchTerm', e.target.value)} /></div><button className="create-product-button" onClick={() => handleOpenModal('create')}><i className="fa-solid fa-plus"></i> Criar Produto</button></div>
                <div className="product-filters">
                    <CustomDropdown placeholder="Status" options={[{value: 'Todos', label: 'Todos Status'}, {value: 'Ativo', label: 'Ativo'}, {value: 'Inativo', label: 'Inativo'}]} selected={filters.status} onSelect={(value) => handleFilterChange('status', value)} />
                    <SearchableDropdown placeholder="Categoria" options={[{value: 'Todas', label: 'Todas Categorias'}, ...staticCategories.map(c => ({value: c, label: c}))]} selected={filters.category} onSelect={(value) => handleFilterChange('category', value)} />
                    <SearchableDropdown placeholder="Promoção" options={staticPromotions.map(p => ({value: p.id, label: p.name}))} selected={filters.promotion} onSelect={(value) => handleFilterChange('promotion', value)} quickActions={[{value: 'Todas', label: 'Todas'}, {value: 'Sim', label: 'Com Promoção'}, {value: 'Não', label: 'Sem Promoção'}]} />
                    <input type="number" name="minPrice" placeholder="Preço Mín." className="filter-input" onChange={(e) => handleFilterChange('minPrice', e.target.value)} />
                    <input type="number" name="maxPrice" placeholder="Preço Máx." className="filter-input" onChange={(e) => handleFilterChange('maxPrice', e.target.value)} />
                    <CustomDropdown placeholder="Ordenar por" options={[{value: 'date_desc', label: 'Mais Recentes'}, {value: 'date_asc', label: 'Mais Antigos'}, {value: 'price_desc', label: 'Maior Preço'}, {value: 'price_asc', label: 'Menor Preço'}]} selected={filters.sort} onSelect={(value) => handleFilterChange('sort', value)} />
                </div>
            </section>
            
            <section className={`bulk-actions-bar ${selectedProducts.size > 0 ? 'visible' : ''}`}>
                <div className="selection-info"><span>{selectedProducts.size} selecionado(s)</span><button className="cancel-selection-btn" onClick={() => setSelectedProducts(new Set())}>Cancelar</button></div>
                <div className="action-buttons-group">
                    <button onClick={() => handleOpenModal('bulk_promo')}><i className="fa-solid fa-tags"></i> Add à Promoção</button>
                    <button onClick={() => handleOpenModal('bulk_category')}><i className="fa-solid fa-sitemap"></i> Add à Categoria</button>
                    <button onClick={() => handleOpenModal('bulk_status')}><i className="fa-solid fa-toggle-on"></i> Mudar Status</button>
                    <button className="danger" onClick={() => handleOpenModal('bulk_delete')}><i className="fa-solid fa-trash-can"></i> Excluir</button>
                </div>
            </section>

            <div className="products-table-card">
                <table className="products-table">
                    <thead><tr><th><input type="checkbox" onChange={handleSelectAll} checked={selectedProducts.size === paginatedProducts.length && paginatedProducts.length > 0} /></th><th>Produto</th><th>Categorias</th><th>Preço</th><th>Estoque</th><th>Status</th></tr></thead>
                    <tbody>{paginatedProducts.map(product => (<tr key={product.id} className={selectedProducts.has(product.id) ? 'selected' : ''}><td><input type="checkbox" checked={selectedProducts.has(product.id)} onChange={() => handleSelectOne(product.id)} /></td><td onClick={() => handleOpenModal('edit', product)}><div className="product-info-cell"><img src={product.image} alt={product.name} /><span>{product.name}</span></div></td><td onClick={() => handleOpenModal('edit', product)}>{product.categories.join(', ')}</td><td onClick={() => handleOpenModal('edit', product)}>{formatCurrency(product.price)}</td><td onClick={() => handleOpenModal('edit', product)}>{product.stock > 0 ? `${product.stock} em estoque` : 'Sem estoque'}</td><td onClick={() => handleOpenModal('edit', product)}><span className={`status-badge-prod status-${product.status.toLowerCase()}`}>{product.status}</span></td></tr>))}</tbody>
                </table>
                <div className="pagination-container-prod"><button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Anterior</button><span>Página {currentPage} de {totalPages}</span><button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Próxima</button></div>
            </div>
            {modal.type === 'edit' && <ProductModal product={modal.data} onClose={handleCloseModal} onSave={handleCloseModal} isClosing={isClosing} />}
            {modal.type === 'create' && <ProductModal onClose={handleCloseModal} onSave={handleCloseModal} isClosing={isClosing} />}
            {(modal.type === 'bulk_promo' || modal.type === 'bulk_category') && <BulkActionModal selectedProducts={selectedProductsData} actionType={modal.type.split('_')[1]} onClose={handleCloseModal} isClosing={isClosing} />}
            {modal.type === 'bulk_status' && <ConfirmationModal count={selectedProducts.size} action="Mudar o status de" onConfirm={handleCloseModal} onClose={handleCloseModal} isClosing={isClosing} />}
            {modal.type === 'bulk_delete' && <ConfirmationModal count={selectedProducts.size} action="EXCLUIR" onConfirm={handleCloseModal} onClose={handleCloseModal} isClosing={isClosing} />}
        </div>
    );
}

export default ProductsPage;