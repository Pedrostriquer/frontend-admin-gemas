import React, { useState, useMemo } from 'react';
import './CategoriesPage.css';

// --- Dados Estáticos (Atualizados com promotionId) ---
const staticCategories = [
    { id: 1, name: 'Anéis', status: 'Ativo', productCount: 15, totalSales: 35, creationDate: '2025-01-10', promotionId: 'PROMO-001' },
    { id: 2, name: 'Colares', status: 'Ativo', productCount: 22, totalSales: 48, creationDate: '2025-01-15', promotionId: 'PROMO-001' },
    { id: 3, name: 'Brincos', status: 'Ativo', productCount: 18, totalSales: 25, creationDate: '2025-02-01', promotionId: null },
    { id: 4, name: 'Pulseiras', status: 'Inativo', productCount: 12, totalSales: 15, creationDate: '2025-02-05', promotionId: null },
    { id: 5, name: 'Diamantes', status: 'Ativo', productCount: 8, totalSales: 55, creationDate: '2025-03-10', promotionId: 'PROMO-003' },
    { id: 6, name: 'Esmeraldas', status: 'Ativo', productCount: 10, totalSales: 45, creationDate: '2025-03-12', promotionId: 'PROMO-006' },
    { id: 7, name: 'Rubis', status: 'Ativo', productCount: 7, totalSales: 38, creationDate: '2025-04-01', promotionId: null },
    { id: 8, name: 'Safiras', status: 'Inativo', productCount: 5, totalSales: 22, creationDate: '2025-04-05', promotionId: null },
];
const staticProducts = [
    { id: 101, name: 'Anel de Diamante Solitário' }, { id: 102, name: 'Colar Gota de Esmeralda' },
    { id: 103, name: 'Pulseira de Ouro 18k' }, { id: 104, name: 'Anel de Noivado Clássico' },
];

const ITEMS_PER_PAGE = 6;

// --- Componente de Dropdown Customizado ---
const CustomDropdown = ({ options, selected, onSelect, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    // Lógica para fechar o dropdown ao clicar fora (simplificada)
    return (
        <div className="custom-dropdown-container-cat">
            <button className="dropdown-header-cat" onClick={() => setIsOpen(!isOpen)}>{options.find(opt => opt.value === selected)?.label || placeholder}<i className={`fa-solid fa-chevron-down ${isOpen ? 'open' : ''}`}></i></button>
            {isOpen && (<ul className="dropdown-list-cat">{options.map(option => (<li key={option.value} onClick={() => { onSelect(option.value); setIsOpen(false); }}>{option.label}</li>))}</ul>)}
        </div>
    );
};

// --- Componente de Seleção de Produtos (para o Modal de Criação) ---
const ProductSelector = ({ onSelectionChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProducts, setSelectedProducts] = useState(new Set());

    const handleSelect = (productId) => {
        const newSelection = new Set(selectedProducts);
        newSelection.has(productId) ? newSelection.delete(productId) : newSelection.add(productId);
        setSelectedProducts(newSelection);
        onSelectionChange(Array.from(newSelection));
    };

    const filteredProducts = staticProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="product-selector-container">
            <input type="text" className="selector-search" placeholder="Buscar produtos para adicionar..." onChange={(e) => setSearchTerm(e.target.value)} />
            <ul className="selector-list">
                {filteredProducts.map(product => (
                    <li key={product.id}>
                        <label>
                            <input type="checkbox" checked={selectedProducts.has(product.id)} onChange={() => handleSelect(product.id)} />
                            {product.name}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// --- Componente do Modal de Detalhes (Código Completo) ---
const DetailsModal = ({ category, onClose, isClosing }) => (
    <div className={`modal-backdrop-cat ${isClosing ? 'closing' : ''}`} onClick={onClose}>
        <div className={`modal-content-cat ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
            <div className="modal-header-cat"><h3>{category.name}</h3><span className={`status-badge-cat status-${category.status.toLowerCase()}`}>{category.status}</span></div>
            <div className="category-details-grid">
                <div className="category-detail-item"><span>Produtos Associados</span><p>{category.productCount}</p></div>
                <div className="category-detail-item"><span>Total de Vendas</span><p>{category.totalSales}</p></div>
                <div className="category-detail-item"><span>Data de Criação</span><p>{category.creationDate}</p></div>
            </div>
            <div className="category-actions">
                <div className="form-group-cat"><label>Editar Nome</label><input type="text" defaultValue={category.name} /></div>
                <div className="action-buttons-cat">
                    {category.status === 'Ativo' ? (
                        <button className="action-btn-cat danger">Inativar Categoria</button>
                    ) : (
                        <button className="action-btn-cat activate">Ativar Categoria</button>
                    )}
                    <button className="action-btn-cat primary">Salvar Alterações</button>
                </div>
            </div>
            <button className="close-btn-cat" onClick={onClose}>Fechar</button>
        </div>
    </div>
);

// --- Componente do Modal de Criação (Código Completo) ---
const CreateModal = ({ onClose, isClosing }) => {
    const [showProductSelector, setShowProductSelector] = useState(false);
    return (
        <div className={`modal-backdrop-cat ${isClosing ? 'closing' : ''}`} onClick={onClose}>
            <div className={`modal-content-cat large ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header-cat"><h3>Criar Nova Categoria</h3></div>
                <div className="create-category-form">
                    <div className="form-group-cat"><label>Nome da Categoria</label><input type="text" placeholder="Ex: Joias Raras" /></div>
                    <div className="form-group-cat"><label>Status Inicial</label><select><option>Ativo</option><option>Inativo</option></select></div>
                    <div className="add-products-toggle">
                        <label>Adicionar produtos existentes a esta categoria?</label>
                        <button className={`toggle-btn-cat ${showProductSelector ? 'active' : ''}`} onClick={() => setShowProductSelector(!showProductSelector)}>
                            {showProductSelector ? 'Ocultar Lista de Produtos' : 'Mostrar Lista de Produtos'}
                        </button>
                    </div>
                    {showProductSelector && <ProductSelector onSelectionChange={() => {}} />}
                </div>
                <div className="modal-footer-cat">
                    <button className="close-btn-cat" onClick={onClose}>Cancelar</button>
                    <button className="action-btn-cat primary">Criar Categoria</button>
                </div>
            </div>
        </div>
    );
};


// --- Componente Principal da Página ---
function CategoriesPage() {
    const [modal, setModal] = useState({ type: null, data: null });
    const [isClosing, setIsClosing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        searchTerm: '',
        sort: 'sales_desc',
        promotion: 'all',
    });

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

    const filteredAndSortedCategories = useMemo(() => {
        let categories = staticCategories
            .filter(cat => cat.name.toLowerCase().includes(filters.searchTerm.toLowerCase()))
            .filter(cat => {
                if (filters.promotion === 'all') return true;
                if (filters.promotion === 'yes') return !!cat.promotionId;
                if (filters.promotion === 'no') return !cat.promotionId;
                return false;
            });

        categories.sort((a, b) => {
            switch (filters.sort) {
                case 'sales_desc': return b.totalSales - a.totalSales;
                case 'sales_asc': return a.totalSales - b.totalSales;
                case 'products_desc': return b.productCount - a.productCount;
                case 'products_asc': return a.productCount - b.productCount;
                default: return 0;
            }
        });
        return categories;
    }, [filters]);

    const totalPages = Math.ceil(filteredAndSortedCategories.length / ITEMS_PER_PAGE);
    const paginatedCategories = filteredAndSortedCategories.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const bestCategory = useMemo(() => {
        if (staticCategories.length === 0) return null;
        return staticCategories.reduce((best, current) => {
            const bestRatio = best.productCount > 0 ? best.totalSales / best.productCount : 0;
            const currentRatio = current.productCount > 0 ? current.totalSales / current.productCount : 0;
            return currentRatio > bestRatio ? current : best;
        });
    }, []);

    return (
        <div className="categories-page-container">
            <header className="categories-page-header">
                <h1>Categorias</h1>
                <button className="create-category-button" onClick={() => handleOpenModal('create')}>
                    <i className="fa-solid fa-plus"></i> Criar Categoria
                </button>
            </header>

            <section className="category-kpi-cards">
                <div className="category-kpi-card">
                    <i className="fa-solid fa-sitemap"></i>
                    <div>
                        <h4>Total de Categorias</h4>
                        <p className="kpi-main-value-cat">{staticCategories.length}</p>
                        <div className="kpi-sub-values-cat">
                            <span><strong>{staticCategories.filter(c => c.status === 'Ativo').length}</strong> Ativas</span>
                            <span><strong>{staticCategories.filter(c => c.status === 'Inativo').length}</strong> Inativas</span>
                        </div>
                    </div>
                </div>
                <div className="category-kpi-card">
                    <i className="fa-solid fa-arrow-trend-up"></i>
                    <div>
                        <h4>Melhor Performance</h4>
                        <p className="kpi-main-value-cat">{bestCategory?.name}</p>
                        <p className="kpi-sub-value-cat">
                            <strong>{(bestCategory.totalSales / bestCategory.productCount).toFixed(1)}</strong> Vendas por Produto
                        </p>
                    </div>
                </div>
            </section>

            <section className="category-controls">
                <div className="search-box-cat">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Buscar categoria..." onChange={e => handleFilterChange('searchTerm', e.target.value)} />
                </div>
                <div className="category-filters">
                    <CustomDropdown 
                        placeholder="Ordenar por"
                        options={[
                            { value: 'sales_desc', label: 'Mais Vendas' },
                            { value: 'sales_asc', label: 'Menos Vendas' },
                            { value: 'products_desc', label: 'Mais Produtos' },
                            { value: 'products_asc', label: 'Menos Produtos' },
                        ]}
                        selected={filters.sort}
                        onSelect={(value) => handleFilterChange('sort', value)}
                    />
                     <CustomDropdown 
                        placeholder="Promoção"
                        options={[
                            { value: 'all', label: 'Com ou Sem Promoção' },
                            { value: 'yes', label: 'Associada a Promoção' },
                            { value: 'no', label: 'Não Associada' },
                        ]}
                        selected={filters.promotion}
                        onSelect={(value) => handleFilterChange('promotion', value)}
                    />
                </div>
            </section>

            <div className="category-list">
                {paginatedCategories.map(cat => (
                    <div key={cat.id} className="category-card" onClick={() => handleOpenModal('details', cat)}>
                        <div className="category-card-header">
                            <h4>{cat.name}</h4>
                            <span className={`status-badge-cat status-${cat.status.toLowerCase()}`}>{cat.status}</span>
                        </div>
                        <div className="category-card-stats">
                            <span><i className="fa-solid fa-box"></i> {cat.productCount} Produtos</span>
                            <span><i className="fa-solid fa-chart-simple"></i> {cat.totalSales} Vendas</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pagination-container-cat">
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Anterior</button>
                <span>Página {currentPage} de {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Próxima</button>
            </div>

            {modal.type === 'details' && <DetailsModal category={modal.data} onClose={handleCloseModal} isClosing={isClosing} />}
            {modal.type === 'create' && <CreateModal onClose={handleCloseModal} isClosing={isClosing} />}
        </div>
    );
}

export default CategoriesPage;