import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import './CategoriesPage.css';
import categoryServices from '../../../dbServices/categoryServices'; // Certifique-se que o caminho está correto

const ITEMS_PER_PAGE = 6;

// Hook para detectar cliques fora de um elemento (usado para fechar o dropdown)
const useOutsideAlerter = (ref, callback) => {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, callback]);
};

// Componente para selecionar produtos ao criar uma categoria
const ProductSelector = ({ products, onSelectionChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProducts, setSelectedProducts] = useState(new Set());

    const handleSelect = (productId) => {
        const newSelection = new Set(selectedProducts);
        if (newSelection.has(productId)) {
            newSelection.delete(productId);
        } else {
            newSelection.add(productId);
        }
        setSelectedProducts(newSelection);
        onSelectionChange(Array.from(newSelection));
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="product-selector-container">
            <input 
                type="text" 
                className="selector-search" 
                placeholder="Buscar produtos para adicionar..." 
                onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <ul className="selector-list">
                {filteredProducts.map(product => (
                    <li key={product.id}>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={selectedProducts.has(product.id)} 
                                onChange={() => handleSelect(product.id)} 
                            />
                            {product.name}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Modal de Detalhes (simplificado, sem status)
const DetailsModal = ({ category, onClose, onSave, onDelete, isClosing }) => {
    const [name, setName] = useState(category.name);

    return (
        <div className={`modal-backdrop-cat ${isClosing ? 'closing' : ''}`} onClick={onClose}>
            <div className={`modal-content-cat ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header-cat">
                    <h3>{category.name}</h3>
                </div>
                
                <div className="category-details-grid">
                    <div className="category-detail-item">
                        <span>Produtos Associados</span>
                        <p>{category.productCount}</p>
                    </div>
                </div>
                
                <div className="category-actions">
                    <div className="form-group-cat">
                        <label>Editar Nome</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="action-buttons-cat">
                        <button type="button" className="action-btn-cat danger" onClick={() => onDelete(category.id)}>Excluir</button>
                        <button type="button" className="action-btn-cat primary" onClick={() => onSave(category.id, { name })}>Salvar Nome</button>
                    </div>
                </div>
                <button type="button" className="close-btn-cat" onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
};

// Modal de Criação de Categoria
const CreateModal = ({ onClose, onSave, isClosing, products }) => {
    const [name, setName] = useState('');
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const [showProductSelector, setShowProductSelector] = useState(false);
    
    const handleSave = async () => {
        if (!name.trim()) {
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
                    <div className="form-group-cat">
                        <label>Nome da Categoria</label>
                        <input 
                            type="text" 
                            placeholder="Ex: Anéis de Diamante" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                        />
                    </div>
                    <div className="add-products-toggle">
                        <label>Adicionar produtos existentes?</label>
                        <button 
                            type="button" 
                            className={`toggle-btn-cat ${showProductSelector ? 'active' : ''}`} 
                            onClick={() => setShowProductSelector(!showProductSelector)}
                        >
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

// Componente principal da página
function CategoriesPage() {
    const [allCategories, setAllCategories] = useState([]);
    const [productList, setProductList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modal, setModal] = useState({ type: null, data: null });
    const [isClosing, setIsClosing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({ searchTerm: '' }); // Estado de filtros sem 'status'

    // Função para buscar todos os dados necessários da API
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
        }, 300); // Duração da animação de fechamento
    };

    const handleCreateCategory = async (categoryData, productIds) => {
        setIsLoading(true);
        try {
            const newCategory = await categoryServices.createCategory(categoryData);
            if (productIds && productIds.length > 0) {
                await categoryServices.updateProductCategories([newCategory.id], productIds);
            }
            handleCloseModal();
            await fetchAllData(); // Recarrega os dados para mostrar a nova categoria
        } catch (error) {
            alert("Erro ao criar a categoria.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleUpdateCategory = async (id, categoryData) => {
        setIsLoading(true);
        try {
            await categoryServices.updateCategory(id, categoryData);
            handleCloseModal();
            await fetchAllData(); // Recarrega os dados
        } catch (error) {
            alert("Erro ao atualizar a categoria.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta categoria? A ação não pode ser desfeita.")) {
            setIsLoading(true);
            try {
                await categoryServices.deleteCategory(id);
                handleCloseModal();
                await fetchAllData(); // Recarrega os dados
            } catch (error) {
                alert("Erro ao excluir a categoria.");
            } finally {
                setIsLoading(false);
            }
        }
    };
    
    // Filtra as categorias com base apenas no termo de busca
    const filteredCategories = useMemo(() => {
        if (!filters.searchTerm) {
            return allCategories;
        }
        return allCategories.filter(cat => 
            cat.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
    }, [filters.searchTerm, allCategories]);

    const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
    const paginatedCategories = filteredCategories.slice(
        (currentPage - 1) * ITEMS_PER_PAGE, 
        currentPage * ITEMS_PER_PAGE
    );
    
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
                    </div>
                </div>
            </section>

            <section className="category-controls">
                <div className="search-box-cat">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input 
                        type="text" 
                        placeholder="Buscar categoria pelo nome..." 
                        onChange={e => handleFilterChange('searchTerm', e.target.value)} 
                    />
                </div>
            </section>

            {isLoading && !modal.type ? <p>Carregando categorias...</p> : (
                <div className="category-list">
                    {paginatedCategories.map(cat => (
                        <div key={cat.id} className="category-card" onClick={() => handleOpenModal('details', cat)}>
                            <div className="category-card-header">
                                <h4>{cat.name}</h4>
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

            {modal.type === 'details' && (
                <DetailsModal 
                    category={modal.data} 
                    onSave={handleUpdateCategory} 
                    onDelete={handleDeleteCategory} 
                    onClose={handleCloseModal} 
                    isClosing={isClosing} 
                />
            )}
            {modal.type === 'create' && (
                <CreateModal 
                    products={productList} 
                    onSave={handleCreateCategory} 
                    onClose={handleCloseModal} 
                    isClosing={isClosing} 
                />
            )}
        </div>
    );
}

export default CategoriesPage;