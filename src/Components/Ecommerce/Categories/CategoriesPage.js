import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import './CategoriesPage.css';
import categoryServices from '../../../dbServices/categoryServices'; // Ajuste o caminho

const ITEMS_PER_PAGE = 6;

const useOutsideAlerter = (ref, callback) => {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) callback();
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref, callback]);
};

const CustomDropdown = ({ options, selected, onSelect, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, () => setIsOpen(false));
    return (
        <div className="custom-dropdown-container-cat">
            <button type="button" className="dropdown-header-cat" onClick={() => setIsOpen(!isOpen)}>{options.find(opt => opt.value === selected)?.label || placeholder}<i className={`fa-solid fa-chevron-down ${isOpen ? 'open' : ''}`}></i></button>
            {isOpen && (<ul className="dropdown-list-cat">{options.map(option => (<li key={option.value} onClick={() => { onSelect(option.value); setIsOpen(false); }}>{option.label}</li>))}</ul>)}
        </div>
    );
};

const ProductSelector = ({ products, onSelectionChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProducts, setSelectedProducts] = useState(new Set());

    const handleSelect = (productId) => {
        const newSelection = new Set(selectedProducts);
        newSelection.has(productId) ? newSelection.delete(productId) : newSelection.add(productId);
        setSelectedProducts(newSelection);
        onSelectionChange(Array.from(newSelection));
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="product-selector-container">
            <input type="text" className="selector-search" placeholder="Buscar produtos para adicionar..." onChange={(e) => setSearchTerm(e.target.value)} />
            <ul className="selector-list">
                {filteredProducts.map(product => (
                    <li key={product.id}>
                        <label><input type="checkbox" checked={selectedProducts.has(product.id)} onChange={() => handleSelect(product.id)} />{product.name}</label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const DetailsModal = ({ category, onClose, onSave, onDelete, onUpdateStatus, isClosing }) => {
    const [name, setName] = useState(category.name);

    return (
        <div className={`modal-backdrop-cat ${isClosing ? 'closing' : ''}`} onClick={onClose}>
            <div className={`modal-content-cat ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header-cat"><h3>{category.name}</h3><span className={`status-badge-cat status-${category.status.toLowerCase()}`}>{category.status}</span></div>
                <div className="category-details-grid">
                    <div className="category-detail-item"><span>Produtos Associados</span><p>{category.productCount}</p></div>
                    <div className="category-detail-item"><span>Data de Criação</span><p>{new Date().toLocaleDateString('pt-BR')}</p></div>
                </div>
                <div className="category-actions">
                    <div className="form-group-cat"><label>Editar Nome</label><input type="text" value={name} onChange={e => setName(e.target.value)} /></div>
                    <div className="action-buttons-cat">
                        {category.status === 'Ativo' ? (
                            <button type="button" className="action-btn-cat danger" onClick={() => onUpdateStatus(category.id, 'Inativo')}>Inativar</button>
                        ) : (
                            <button type="button" className="action-btn-cat activate" onClick={() => onUpdateStatus(category.id, 'Ativo')}>Ativar</button>
                        )}
                        <button type="button" className="action-btn-cat danger" onClick={() => onDelete(category.id)}>Excluir</button>
                        <button type="button" className="action-btn-cat primary" onClick={() => onSave(category.id, { id: category.id, name })}>Salvar Nome</button>
                    </div>
                </div>
                <button type="button" className="close-btn-cat" onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
};

const CreateModal = ({ onClose, onSave, isClosing, products }) => {
    const [name, setName] = useState('');
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const [showProductSelector, setShowProductSelector] = useState(false);
    
    const handleSave = async () => {
        if (!name) {
            alert("O nome da categoria é obrigatório.");
            return;
        }
        await onSave({ name }, selectedProductIds);
    };

    return (
        <div className={`modal-backdrop-cat ${isClosing ? 'closing' : ''}`} onClick={onClose}>
            <div className={`modal-content-cat large ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header-cat"><h3>Criar Nova Categoria</h3></div>
                <div className="create-category-form">
                    <div className="form-group-cat"><label>Nome da Categoria</label><input type="text" placeholder="Ex: Joias Raras" value={name} onChange={e => setName(e.target.value)} /></div>
                    <div className="add-products-toggle">
                        <label>Adicionar produtos existentes?</label>
                        <button type="button" className={`toggle-btn-cat ${showProductSelector ? 'active' : ''}`} onClick={() => setShowProductSelector(!showProductSelector)}>
                            {showProductSelector ? 'Ocultar Lista' : 'Mostrar Lista'}
                        </button>
                    </div>
                    {showProductSelector && <ProductSelector products={products} onSelectionChange={setSelectedProductIds} />}
                </div>
                <div className="modal-footer-cat">
                    <button type="button" className="close-btn-cat" onClick={onClose}>Cancelar</button>
                    <button type="button" className="action-btn-cat primary" onClick={handleSave}>Criar Categoria</button>
                </div>
            </div>
        </div>
    );
};

function CategoriesPage() {
    const [allCategories, setAllCategories] = useState([]);
    const [productList, setProductList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modal, setModal] = useState({ type: null, data: null });
    const [isClosing, setIsClosing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({ searchTerm: '', status: 'all' });

    const fetchAllData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [categoriesData, productsData] = await Promise.all([
                categoryServices.getAllCategories(),
                categoryServices.getProductsForSelection()
            ]);
            setAllCategories(categoriesData || []);
            setProductList(productsData || []);
        } catch (error) {
            alert("Não foi possível carregar os dados da página.");
            setAllCategories([]);
            setProductList([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const handleOpenModal = (type, data = null) => setModal({ type, data });
    const handleCloseModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setModal({ type: null, data: null });
            setIsClosing(false);
        }, 300);
    };

    const handleCreateCategory = async (categoryData, productIds) => {
        setIsLoading(true);
        try {
            const newCategory = await categoryServices.createCategory(categoryData);
            if (productIds.length > 0) {
                await categoryServices.updateProductCategories([newCategory.id], productIds);
            }
            handleCloseModal();
            await fetchAllData();
        } catch (error) {
            alert("Erro ao criar a categoria.");
            setIsLoading(false);
        }
    };
    
    const handleUpdateCategory = async (id, categoryData) => {
        setIsLoading(true);
        try {
            await categoryServices.updateCategory(id, categoryData);
            handleCloseModal();
            await fetchAllData();
        } catch (error) {
            alert("Erro ao atualizar a categoria.");
            setIsLoading(false);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
            setIsLoading(true);
            try {
                await categoryServices.deleteCategory(id);
                handleCloseModal();
                await fetchAllData();
            } catch (error) {
                alert("Erro ao excluir a categoria.");
                setIsLoading(false);
            }
        }
    };
    
    const handleUpdateStatus = async (id, status) => {
        setIsLoading(true);
        try {
            await categoryServices.updateCategoryStatus(id, status);
            handleCloseModal();
            await fetchAllData();
        } catch (error) {
            alert("Erro ao alterar o status da categoria.");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredAndSortedCategories = useMemo(() => {
        return allCategories
            .filter(cat => cat.name.toLowerCase().includes(filters.searchTerm.toLowerCase()))
            .filter(cat => filters.status === 'all' || cat.status === filters.status);
    }, [filters, allCategories]);

    const totalPages = Math.ceil(filteredAndSortedCategories.length / ITEMS_PER_PAGE);
    const paginatedCategories = filteredAndSortedCategories.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    
    const activeCategoriesCount = useMemo(() => allCategories.filter(c => c.status === 'Ativo').length, [allCategories]);
    const inactiveCategoriesCount = useMemo(() => allCategories.filter(c => c.status !== 'Ativo').length, [allCategories]);

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
                        <p className="kpi-main-value-cat">{allCategories.length}</p>
                        <div className="kpi-sub-values-cat">
                            <span><strong>{activeCategoriesCount}</strong> Ativas</span>
                            <span><strong>{inactiveCategoriesCount}</strong> Inativas</span>
                        </div>
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
                        placeholder="Status"
                        options={[{ value: 'all', label: 'Todos os Status' }, { value: 'Ativo', label: 'Ativas' }, { value: 'Inativo', label: 'Inativas' }]}
                        selected={filters.status}
                        onSelect={(value) => handleFilterChange('status', value)}
                    />
                </div>
            </section>

            {isLoading && !modal.type ? <p>Carregando...</p> : (
                <div className="category-list">
                    {paginatedCategories.map(cat => (
                        <div key={cat.id} className="category-card" onClick={() => handleOpenModal('details', cat)}>
                            <div className="category-card-header">
                                <h4>{cat.name}</h4>
                                <span className={`status-badge-cat status-${cat.status.toLowerCase()}`}>{cat.status}</span>
                            </div>
                            <div className="category-card-stats">
                                <span><i className="fa-solid fa-box"></i> {cat.productCount} Produtos</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="pagination-container-cat">
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Anterior</button>
                <span>Página {currentPage} de {totalPages || 1}</span>
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage >= totalPages}>Próxima</button>
            </div>

            {modal.type === 'details' && <DetailsModal category={modal.data} onSave={handleUpdateCategory} onDelete={handleDeleteCategory} onUpdateStatus={handleUpdateStatus} onClose={handleCloseModal} isClosing={isClosing} />}
            {modal.type === 'create' && <CreateModal products={productList} onSave={handleCreateCategory} onClose={handleCloseModal} isClosing={isClosing} />}
        </div>
    );
}

export default CategoriesPage;