import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import "./PromotionsPage.css";
import promotionServices from "../../../dbServices/promotionServices";
import productServices from "../../../dbServices/productServices";
import { useAuth } from "../../../Context/AuthContext";
import { useLoad } from "../../../Context/LoadContext";

// ========================================================================
// HELPERS, HOOKS E TRADUÇÕES
// ========================================================================

const statusMap = {
  Scheduled: "Agendada",
  Active: "Ativa",
  Finished: "Finalizada",
  Cancelled: "Cancelada",
};

const statusOptions = [
  { value: "Todos", label: "Todos os Status" },
  ...Object.entries(statusMap).map(([value, label]) => ({ value, label }))
];

const getActionableStatus = (backendStatus) => {
  switch (backendStatus) {
    case 'Scheduled':
    case 'Finished':
      return 'Inactive';
    default:
      return backendStatus;
  }
};

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
};

// ========================================================================
// REUSABLE UI COMPONENTS
// ========================================================================

const CustomDropdown = ({ options, selected, onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => setIsOpen(false));
  return (
    <div className="custom-dropdown-container-promo" ref={wrapperRef}>
      <button
        type="button"
        className="dropdown-header-promo"
        onClick={() => setIsOpen(!isOpen)}
      >
        {options.find((opt) => opt.value === selected)?.label || placeholder}
        <i className={`fa-solid fa-chevron-down ${isOpen ? "open" : ""}`}></i>
      </button>
      {isOpen && (
        <ul className="dropdown-list-promo">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ItemSelector = ({ items, selectedItems, onToggleItem, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="item-selector-container">
      <input
        type="text"
        className="selector-search"
        placeholder={placeholder}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="selector-list">
        {filteredItems.map((item) => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => onToggleItem(item.id)}
              />
              <span>{item.name}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ========================================================================
// MODAL COMPONENTS
// ========================================================================

const DetailsModal = ({ promo, allProducts, onSave, onUpdateStatus, onClose, isClosing }) => {
  const [formData, setFormData] = useState({ ...promo });
  
  const actionableStatus = getActionableStatus(promo.status);

  const handleInputChange = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));
  
  const handleToggleProduct = (productId) => {
    setFormData((prev) => {
      const newProductIds = prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId];
      return { ...prev, productIds: newProductIds };
    });
  };

  const handleSaveChanges = () => onSave(formData);
  const handleStatusChange = (newStatus) => onUpdateStatus(promo.id, newStatus);

  return (
    <div className={`modal-backdrop-promo ${isClosing ? "closing" : ""}`} onClick={onClose}>
      <div className={`modal-content-promo large ${isClosing ? "closing" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-promo">
          <h3>Editar Promoção</h3>
          <span className={`status-badge-promo status-${promo.status.toLowerCase()}`}>
            {statusMap[promo.status] || promo.status}
          </span>
        </div>
        <div className="create-promo-form">
          <div className="form-group">
            <label>Nome da Promoção</label>
            <input type="text" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Tipo de Desconto</label>
            <select value={formData.discountType} onChange={(e) => handleInputChange("discountType", e.target.value)}>
              <option value="Percentage">Porcentagem (%)</option>
              <option value="FixedValue">Valor Fixo (R$)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Valor do Desconto</label>
            <input type="number" value={formData.discountValue} onChange={(e) => handleInputChange("discountValue", parseFloat(e.target.value) || 0)} />
          </div>
          <div className="form-group full-width">
            <label>Gerenciar Produtos</label>
            <ItemSelector items={allProducts} selectedItems={formData.productIds} onToggleItem={handleToggleProduct} placeholder="Buscar produtos..." />
          </div>
        </div>
        <div className="modal-footer-promo details">
          <div className="status-actions">
            {(actionableStatus === 'Active' || actionableStatus === 'Inactive') && (
              <>
                <button
                  type="button"
                  className={`action-btn-promo ${actionableStatus === 'Active' ? 'warning' : 'success'}`}
                  onClick={() => handleStatusChange(actionableStatus === 'Active' ? 'Inactive' : 'Active')}
                >
                  {actionableStatus === 'Active' ? 'Desativar' : 'Ativar'}
                </button>
                <button
                  type="button"
                  className="action-btn-promo danger"
                  onClick={() => handleStatusChange('Cancelled')}
                >
                  Cancelar
                </button>
              </>
            )}
            {/* ###################################################### */}
            {/* ### CORREÇÃO APLICADA AQUI PARA ATIVAR DIRETAMENTE ### */}
            {/* ###################################################### */}
            {actionableStatus === 'Cancelled' && (
              <button
                type="button"
                className="action-btn-promo success" // Mudado para verde
                onClick={() => handleStatusChange('Active')} // MUDADO DE 'Inactive' PARA 'Active'
              >
                Reativar
              </button>
            )}
          </div>
          <div className="main-actions">
            <button type="button" className="close-btn-promo" onClick={onClose}>Fechar</button>
            <button type="button" className="action-btn-promo primary" onClick={handleSaveChanges}>
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateModal = ({ allProducts, onSave, onClose, isClosing }) => {
  const [formData, setFormData] = useState({ name: "", discountType: "Percentage", discountValue: 0, productIds: [] });
  const handleInputChange = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));
  const handleToggleProduct = (productId) => { setFormData((prev) => { const newProductIds = prev.productIds.includes(productId) ? prev.productIds.filter((id) => id !== productId) : [...prev.productIds, productId]; return { ...prev, productIds: newProductIds }; }); };
  return ( <div className={`modal-backdrop-promo ${isClosing ? "closing" : ""}`} onClick={onClose}> <div className={`modal-content-promo large ${isClosing ? "closing" : ""}`} onClick={(e) => e.stopPropagation()}> <div className="modal-header-promo"><h3>Criar Nova Promoção</h3></div> <div className="create-promo-form"> <div className="form-group"><label>Nome da Promoção</label><input type="text" placeholder="Ex: Liquida Inverno" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} /></div> <div className="form-group"><label>Tipo de Desconto</label><select value={formData.discountType} onChange={(e) => handleInputChange("discountType", e.target.value)}><option value="Percentage">Porcentagem (%)</option><option value="FixedValue">Valor Fixo (R$)</option></select></div> <div className="form-group"><label>Valor do Desconto</label><input type="number" placeholder="Ex: 15 (para 15%)" value={formData.discountValue} onChange={(e) => handleInputChange("discountValue", parseFloat(e.target.value) || 0)} /></div> <div className="form-group full-width"><label>Selecione os Produtos</label><ItemSelector items={allProducts} selectedItems={formData.productIds} onToggleItem={handleToggleProduct} placeholder="Buscar produtos..." /></div></div> <div className="modal-footer-promo create"><button type="button" className="close-btn-promo" onClick={onClose}>Cancelar</button><button type="button" className="action-btn-promo primary" onClick={() => onSave(formData)}>Criar Promoção</button></div></div></div>);
};


// ========================================================================
// MAIN PAGE COMPONENT
// ========================================================================
function PromotionsPage() {
  const { token } = useAuth();
  const [allPromotions, setAllPromotions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({ type: null, data: null });
  const [isClosing, setIsClosing] = useState(false);
  const [filters, setFilters] = useState({ searchTerm: "", status: "Todos" });
  const { startLoading, stopLoading } = useLoad();

  const fetchInitialData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    startLoading();
    try {
      const [promoData, productData] = await Promise.all([
        promotionServices.getAllPromotions(),
        productServices.searchProducts({}, 1, 1000), 
      ]);
      setAllPromotions(promoData || []);
      setAllProducts(productData.items || []);
    } catch (error) {
      console.error("Não foi possível carregar os dados da página.", error);
    } finally {
      setIsLoading(false);
      stopLoading();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleFilterChange = (name, value) => setFilters((prev) => ({ ...prev, [name]: value }));
  
  const handleOpenModal = (type, data = null) => setModal({ type, data });
  
  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setModal({ type: null, data: null });
      setIsClosing(false);
    }, 300);
  };

  const handleSavePromotion = async (promoData) => {
    startLoading();
    try {
      if (promoData.id) {
        await promotionServices.updatePromotion(promoData.id, promoData);
      } else {
        await promotionServices.createPromotion(promoData);
      }
      handleCloseModal();
      await fetchInitialData();
    } catch (error) {
      console.error("Erro ao salvar a promoção.", error);
    } finally {
      stopLoading();
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    startLoading();
    try {
      await promotionServices.updatePromotionStatus(id, newStatus);
      handleCloseModal();
      await fetchInitialData();
    } catch (error) {
      console.error("Erro ao alterar o status da promoção.", error);
    } finally {
      stopLoading();
    }
  };

  const filteredPromotions = useMemo(() => {
    if (!allPromotions) return [];
    return allPromotions
      .filter((promo) =>
        promo.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
      .filter(
        (promo) => filters.status === "Todos" || promo.status === filters.status
      );
  }, [filters, allPromotions]);

  const activePromos = useMemo(() => allPromotions?.filter(p => p.status === 'Active').length || 0, [allPromotions]);
  const scheduledPromos = useMemo(() => allPromotions?.filter(p => p.status === 'Cancelled').length || 0, [allPromotions]);

  return (
    <div className="promotions-page-container">
      <header className="promotions-page-header">
        <h1>Promoções</h1>
        <button className="create-promo-button" onClick={() => handleOpenModal("create")}>
          <i className="fa-solid fa-plus"></i> Criar Promoção
        </button>
      </header>
      <section className="promo-kpi-cards">
        <div className="promo-kpi-card">
          <i className="fa-solid fa-tags"></i>
          <div>
            <h4>Total de Promoções</h4>
            <p className="kpi-main-value-promo">{allPromotions?.length || 0}</p>
          </div>
        </div>
        <div className="promo-kpi-card">
          <i className="fa-solid fa-rocket"></i>
          <div>
            <h4>Status Atual</h4>
            <p className="kpi-main-value-promo">{activePromos} <span className="kpi-unit-promo">Ativas</span></p>
            <p className="kpi-sub-value-promo">{scheduledPromos} Canceladas</p>
          </div>
        </div>
      </section>
      <section className="promo-controls">
        <div className="search-box-promo">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Buscar por nome..." onChange={(e) => handleFilterChange("searchTerm", e.target.value)} />
        </div>
        <div className="promo-filters">
          <CustomDropdown placeholder="Status" options={statusOptions} selected={filters.status} onSelect={(value) => handleFilterChange("status", value)} />
        </div>
      </section>
      {isLoading ? (
        <div className="loading-message">Carregando promoções...</div>
      ) : (
        <>
          <div className="promotions-list">
            {filteredPromotions.length > 0 ? (
              filteredPromotions.map((promo) => (
                <div key={promo.id} className="promo-card" onClick={() => handleOpenModal("details", promo)}>
                  <div className="promo-card-header">
                    <h4>{promo.name}</h4>
                    <span className={`status-badge-promo status-${promo.status.toLowerCase()}`}>
                      {statusMap[promo.status] || promo.status}
                    </span>
                  </div>
                  <div className="promo-card-body"><p><strong>Produtos:</strong> {promo.productIds?.length || 0}</p></div>
                  <div className="promo-card-footer"><span>Ver Detalhes <i className="fa-solid fa-arrow-right"></i></span></div>
                </div>
              ))
            ) : (
              <div className="no-results-message">Nenhuma promoção encontrada.</div>
            )}
          </div>
        </>
      )}
      {modal.type === "details" && <DetailsModal promo={modal.data} allProducts={allProducts} onSave={handleSavePromotion} onUpdateStatus={handleUpdateStatus} onClose={handleCloseModal} isClosing={isClosing} />}
      {modal.type === "create" && <CreateModal allProducts={allProducts} onSave={handleSavePromotion} onClose={handleCloseModal} isClosing={isClosing} />}
    </div>
  );
}

export default PromotionsPage;