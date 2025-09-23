import React, { useState, useRef, useEffect, useCallback } from "react";
import "./ProductsPage.css";
import productServices from "../../../dbServices/productServices"; // Ajuste o caminho se necessário
import { useLoad } from "../../../Context/LoadContext";

// --- Funções Utilitárias ---
const formatCurrency = (value) =>
  (value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Verifica se uma URL corresponde a um formato de vídeo conhecido.
const isVideoUrl = (url) => {
  if (!url) return false;
  // Lista de extensões de vídeo comuns (incluindo .mov)
  const videoExtensions = [".mp4", ".mov", ".webm", ".ogg"];
  const lowercasedUrl = url.toLowerCase();
  // Verifica se a URL contém alguma das extensões de vídeo antes do token do Firebase
  return videoExtensions.some((ext) => lowercasedUrl.includes(ext + "?"));
};

const ITEMS_PER_PAGE = 5;

// --- Hooks Customizados ---
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const useOutsideAlerter = (ref, callback) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) callback();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
};

// --- Componentes Reutilizáveis ---
const CustomDropdown = ({ options, selected, onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => setIsOpen(false));
  return (
    <div className="custom-dropdown-container" ref={wrapperRef}>
      <button
        type="button"
        className="dropdown-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        {options.find((opt) => opt.value === selected)?.label || placeholder}
        <i className={`fa-solid fa-chevron-down ${isOpen ? "open" : ""}`}></i>
      </button>
      {isOpen && (
        <ul className="dropdown-list">
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

const SearchableDropdown = ({ options, onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => setIsOpen(false));
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="custom-dropdown-container" ref={wrapperRef}>
      <button
        type="button"
        className="dropdown-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        {placeholder}
        <i className={`fa-solid fa-chevron-down ${isOpen ? "open" : ""}`}></i>
      </button>
      {isOpen && (
        <div className="dropdown-list searchable">
          <div className="dropdown-search-wrapper">
            {/* <i className="fa-solid fa-magnifying-glass"></i> */}
            <input
              type="text"
              className="dropdown-search"
              placeholder="Buscar..."
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <ul>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => {
                    onSelect(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="no-results">Nenhum resultado</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const StoneInfoForm = ({ stone, index, onStoneChange, onRemoveStone }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onStoneChange(index, { ...stone, [name]: value });
  };

  return (
    <div className="stone-info-form">
      <div className="stone-form-header">
        <h5>Gema {index + 1}</h5>
        {index > 0 && (
          <button type="button" onClick={() => onRemoveStone(index)}>
            Remover
          </button>
        )}
      </div>
      <div className="form-group-row">
        <div className="form-group-prod">
          <label>Tipo da Gema</label>
          <input
            type="text"
            name="stoneType"
            value={stone.stoneType || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group-prod">
          <label>Quantidade</label>
          <input
            type="text"
            name="quantity"
            min="1"
            value={stone.quantity || 1}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-group-row">
        <div className="form-group-prod">
          <label>Cor</label>
          <input
            type="text"
            name="color"
            value={stone.color || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group-prod">
          <label>Quilates (ct)</label>
          <input
            type="text"
            step="0.01"
            name="carats"
            value={stone.carats || ""}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-group-row">
        <div className="form-group-prod">
          <label>Lapidação</label>
          <input
            type="text"
            name="cut"
            value={stone.cut || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group-prod">
          <label>Claridade</label>
          <input
            type="text"
            name="clarity"
            value={stone.clarity || ""}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-group-row">
        <div className="form-group-prod">
          <label>Comprimento (mm)</label>
          <input
            type="text"
            step="0.1"
            name="lengthInMm"
            value={stone.lengthInMm || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group-prod">
          <label>Largura (mm)</label>
          <input
            type="text"
            step="0.1"
            name="widthInMm"
            value={stone.widthInMm || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group-prod">
          <label>Altura (mm)</label>
          <input
            type="text"
            step="0.1"
            name="heightInMm"
            value={stone.heightInMm || ""}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

const ProductModal = ({
  product,
  allCategories,
  onClose,
  onSave,
  isClosing,
}) => {
  const isEditing = !!product;
  const [formData, setFormData] = useState({
    id: isEditing ? product.id : 0,
    name: isEditing ? product.name : "",
    description: isEditing ? product.description : "",
    value: isEditing ? product.value : "",
    status: isEditing ? product.status : 1,
    itemType: isEditing ? product.itemType : 2,
    categories: isEditing ? product.categories || [] : [],
    media: isEditing
      ? (product.mediaUrls || []).map((url) => ({
          type: isVideoUrl(url) ? "video" : "image",
          url,
          file: null,
        }))
      : [],
    info: isEditing
      ? product.info
      : { material: "", weightInGrams: "", stones: [{ quantity: 1 }] },
  });
  const [newMediaType, setNewMediaType] = useState("image");
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      formData.media.forEach((m) => {
        if (m.file) URL.revokeObjectURL(m.url);
      });
    };
  }, [formData.media]);

  const handleFormChange = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));
  const handleInfoChange = (name, value) =>
    setFormData((prev) => ({ ...prev, info: { ...prev.info, [name]: value } }));
  const handleStoneChange = (index, stoneData) => {
    const newStones = [...(formData.info.stones || [])];
    newStones[index] = stoneData;
    handleInfoChange("stones", newStones);
  };
  const handleAddStone = () =>
    handleInfoChange("stones", [
      ...(formData.info.stones || []),
      { quantity: 1 },
    ]);
  const handleRemoveStone = (index) =>
    handleInfoChange(
      "stones",
      formData.info.stones.filter((_, i) => i !== index)
    );

  const handleAddMediaFromUrl = () => {
    if (newMediaUrl) {
      setFormData((prev) => ({
        ...prev,
        media: [
          ...prev.media,
          { type: newMediaType, url: newMediaUrl, file: null },
        ],
      }));
      setNewMediaUrl("");
    }
  };

  const handleRemoveMedia = (urlToRemove) => {
    const mediaToRemove = formData.media.find((m) => m.url === urlToRemove);
    if (mediaToRemove && mediaToRemove.file) {
      URL.revokeObjectURL(mediaToRemove.url);
    }
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((m) => m.url !== urlToRemove),
    }));
  };

  const handleAddCategory = (catId) =>
    !formData.categories.includes(catId) &&
    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, catId],
    }));
  const handleRemoveCategory = (catId) =>
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((id) => id !== catId),
    }));

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    const fileType = file.type.startsWith("video") ? "video" : "image";
    setFormData((prev) => ({
      ...prev,
      media: [...prev.media, { type: fileType, url: previewUrl, file: file }],
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = () => {
    // Função auxiliar para limpar e converter strings em números
    const cleanAndParseFloat = (val) => {
      const str = String(val || "0");
      // 1. Remove todos os pontos (separadores de milhar)
      // 2. Troca a vírgula (separador decimal) por um ponto
      const parsable = str.replace(/\./g, "").replace(",", ".");
      return parseFloat(parsable) || 0;
    };

    const localFiles = formData.media.filter((m) => m.file).map((m) => m.file);
    const existingUrls = formData.media
      .filter((m) => !m.file)
      .map((m) => m.url);

    const finalData = { ...formData };

    // Aplica a nova lógica de conversão para todos os campos necessários
    finalData.value = cleanAndParseFloat(finalData.value);

    if (finalData.info) {
      finalData.info.weightInGrams = cleanAndParseFloat(
        finalData.info.weightInGrams
      );

      if (finalData.info.stones) {
        finalData.info.stones = finalData.info.stones.map((stone) => ({
          ...stone,
          quantity: parseInt(stone.quantity, 10) || 1,
          carats: cleanAndParseFloat(stone.carats),
          lengthInMm: cleanAndParseFloat(stone.lengthInMm),
          widthInMm: cleanAndParseFloat(stone.widthInMm),
          heightInMm: cleanAndParseFloat(stone.heightInMm),
        }));
      }
    }

    delete finalData.media;
    onSave(finalData, localFiles, existingUrls);
  };

  const availableCategories = allCategories.filter(
    (c) => !formData.categories.includes(c.id)
  );

  return (
    <div className={`modal-backdrop-prod ${isClosing ? "closing" : ""}`}>
      <div
        className={`modal-content-prod v2 ${isClosing ? "closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-prod">
          <h3>{isEditing ? "Editar Produto" : "Criar Novo Produto"}</h3>
        </div>
        <div className="modal-body-prod">
          <div className="product-form-grid v2">
            <div className="form-col">
              <div className="form-group-prod">
                <label>Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                />
              </div>
              <div className="form-group-prod">
                <label>Descrição</label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                ></textarea>
              </div>
              <div className="form-group-row">
                <div className="form-group-prod">
                  <label>Preço (R$)</label>
                  <input
                    type="text"
                    inputMode="decimal" // Ajuda a exibir o teclado numérico em celulares
                    placeholder="0,00"
                    value={formData.value}
                    onChange={(e) => handleFormChange("value", e.target.value)}
                  />
                </div>
                <div className="form-group-prod">
                  <label>Status</label>
                  <CustomDropdown
                    options={[
                      { value: 1, label: "Ativo" },
                      { value: 0, label: "Inativo" },
                    ]}
                    selected={formData.status}
                    onSelect={(val) => handleFormChange("status", val)}
                  />
                </div>
              </div>
              <div className="form-group-prod">
                <label>Tipo de Item</label>
                <CustomDropdown
                  options={[
                    { value: 1, label: "Joia" },
                    { value: 2, label: "Gema" },
                  ]}
                  selected={formData.itemType}
                  onSelect={(val) => handleFormChange("itemType", val)}
                />
              </div>
              {formData.itemType === 1 && (
                <div className="form-group-row">
                  <div className="form-group-prod">
                    <label>Material</label>
                    <input
                      type="text"
                      value={formData.info.material || ""}
                      onChange={(e) =>
                        handleInfoChange("material", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group-prod">
                    <label>Peso (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.info.weightInGrams || ""}
                      onChange={(e) =>
                        handleInfoChange("weightInGrams", e.target.value)
                      }
                    />
                  </div>
                </div>
              )}
              <div className="form-group-prod">
                <label>Categorias</label>
                <SearchableDropdown
                  placeholder="Adicionar Categoria..."
                  options={availableCategories.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                  onSelect={handleAddCategory}
                />
                <div className="category-tags">
                  {formData.categories.map((catId) => {
                    const cat = allCategories.find((c) => c.id === catId);
                    return cat ? (
                      <span key={cat.id}>
                        {cat.name}{" "}
                        <i
                          className="fa-solid fa-xmark"
                          onClick={() => handleRemoveCategory(cat.id)}
                        ></i>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
            <div className="form-col">
              <div className="form-group-prod">
                <label>Gemas Associadas</label>
                <div className="stones-container">
                  {formData.info.stones &&
                    formData.info.stones.map((stone, index) => (
                      <StoneInfoForm
                        key={index}
                        index={index}
                        stone={stone}
                        onStoneChange={handleStoneChange}
                        onRemoveStone={handleRemoveStone}
                      />
                    ))}
                </div>
                <button
                  type="button"
                  className="add-stone-btn"
                  onClick={handleAddStone}
                >
                  <i className="fa-solid fa-plus"></i> Adicionar Gema
                </button>
              </div>
              <div className="form-group-prod">
                <label>Mídias</label>
                <div className="media-input-group">
                  <CustomDropdown
                    options={[
                      { value: "image", label: "Imagem" },
                      { value: "video", label: "Vídeo" },
                    ]}
                    selected={newMediaType}
                    onSelect={setNewMediaType}
                  />
                  <input
                    type="text"
                    placeholder="Cole a URL da Mídia"
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                  />
                  <button onClick={handleAddMediaFromUrl}>Add</button>
                </div>
                <div className="media-upload-area">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    style={{ display: "none" }}
                    id="media-upload-input"
                    disabled={isUploading}
                  />
                  <button
                    type="button"
                    className="upload-btn-prod"
                    onClick={() => fileInputRef.current.click()}
                    disabled={isUploading}
                  >
                    <i
                      className={`fa-solid ${
                        isUploading ? "fa-spinner fa-spin" : "fa-upload"
                      }`}
                    ></i>
                    {isUploading ? "Enviando..." : "Fazer Upload de Arquivo"}
                  </button>
                </div>
                <div className="media-preview-list">
                  {formData.media.map((m, index) => (
                    <div
                      key={`${m.url}-${index}`}
                      className="media-preview-item"
                    >
                      {m.type === "image" ? (
                        <img src={m.url} alt="preview" />
                      ) : (
                        <video src={m.url} autoPlay loop muted playsInline>
                          Seu navegador não suporta o elemento de vídeo.
                        </video>
                      )}
                      <i
                        className="fa-solid fa-trash-can"
                        onClick={() => handleRemoveMedia(m.url)}
                      ></i>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer-prod">
          <button type="button" className="close-btn-prod" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="save-btn-prod" onClick={handleSave}>
            <i className="fa-solid fa-check"></i> Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmationModal = ({
  count,
  action,
  onConfirm,
  onClose,
  isClosing,
}) => (
  <div
    className={`modal-backdrop-prod ${isClosing ? "closing" : ""}`}
    onClick={onClose}
  >
    <div
      className={`modal-content-prod small ${isClosing ? "closing" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header-prod">
        <h3>Confirmar Ação</h3>
      </div>
      <p className="confirmation-text">
        Você tem certeza que deseja{" "}
        <strong>
          {action.toLowerCase()} {count} {count > 1 ? "produtos" : "produto"}
        </strong>
        ?
      </p>
      <div className="modal-footer-prod confirmation">
        <button type="button" className="close-btn-prod" onClick={onClose}>
          Cancelar
        </button>
        <button
          type="button"
          className="save-btn-prod confirm"
          onClick={onConfirm}
        >
          <i className="fa-solid fa-check"></i> Confirmar
        </button>
      </div>
    </div>
  </div>
);

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filters, setFilters] = useState({
    searchTerm: "",
    status: "Todos",
    itemType: "Todos",
    minPrice: "",
    maxPrice: "",
    sort: "date_desc",
  });
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [modal, setModal] = useState({ type: null, data: null });
  const [isClosing, setIsClosing] = useState(false);

  const debouncedFilters = useDebounce(filters, 500);
  const { startLoading, stopLoading } = useLoad();

  const fetchProducts = useCallback(async (page, currentFilters) => {
    setIsLoading(true);
    try {
      startLoading();
      const data = await productServices.searchProducts(
        currentFilters,
        page,
        ITEMS_PER_PAGE
      );
      setProducts(data.items || []);
      setTotalPages(Math.ceil(data.totalCount / ITEMS_PER_PAGE) || 1);
      setTotalProducts(data.totalCount || 0);
    } catch (error) {
      alert("Não foi possível carregar os produtos.");
    } finally {
      setIsLoading(false);
      stopLoading();
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      startLoading();
      const catData = await productServices.getAllCategories();
      setCategories(catData || []);
    } catch (error) {
      alert("Não foi possível carregar as categorias.");
    } finally {
      stopLoading();
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedFilters]);

  useEffect(() => {
    fetchProducts(currentPage, debouncedFilters);
  }, [debouncedFilters, currentPage, fetchProducts]);

  const handleFilterChange = (name, value) =>
    setFilters((prev) => ({ ...prev, [name]: value }));

  const handleOpenModal = (type, data = null) => setModal({ type, data });

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setModal({ type: null, data: null });
      setIsClosing(false);
    }, 300);
  };

  const handleSaveProduct = async (productData, localFiles, existingUrls) => {
    setIsLoading(true);
    try {
      startLoading();
      let finalMediaUrls = [...existingUrls];
      let productToUpdate = { ...productData };

      if (productData.id && productData.id !== 0) {
        if (localFiles.length > 0) {
          const uploadPromises = localFiles.map((file) =>
            productServices.uploadProductMedia(productData.id, file)
          );
          const newUrls = await Promise.all(uploadPromises);
          finalMediaUrls.push(...newUrls.flat());
        }
        productToUpdate.mediaUrls = finalMediaUrls;
        await productServices.updateProduct(productData.id, productToUpdate);
      } else {
        productToUpdate.mediaUrls = existingUrls;
        const newProduct = await productServices.createProduct(productToUpdate);
        const newProductId = newProduct.id;

        if (localFiles.length > 0) {
          const uploadPromises = localFiles.map((file) =>
            productServices.uploadProductMedia(newProductId, file)
          );
          const newUrls = await Promise.all(uploadPromises);
          finalMediaUrls.push(...newUrls.flat());

          await productServices.updateProduct(newProductId, {
            ...newProduct,
            mediaUrls: finalMediaUrls,
          });
        }
      }
      handleCloseModal();
      fetchProducts(productData.id ? currentPage : 1, debouncedFilters);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Ocorreu um erro ao salvar o produto.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    setIsLoading(true);
    try {
      startLoading();
      await productServices.deleteProducts(Array.from(selectedProducts));
      setSelectedProducts(new Set());
      handleCloseModal();
      fetchProducts(1, debouncedFilters);
    } catch (error) {
      alert("Ocorreu um erro ao deletar os produtos.");
    } finally {
      setIsLoading(false);
      stopLoading();
    }
  };

  const handleBulkStatusChange = async (status) => {
    setIsLoading(true);
    startLoading();
    try {
      await productServices.updateProductsStatus(
        Array.from(selectedProducts),
        status
      );
      setSelectedProducts(new Set());
      handleCloseModal();
      fetchProducts(currentPage, debouncedFilters);
    } catch (error) {
      alert("Ocorreu um erro ao alterar o status.");
    } finally {
      setIsLoading(false);
      stopLoading();
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(new Set(products.map((p) => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleSelectOne = (productId) => {
    const newSelection = new Set(selectedProducts);
    if (newSelection.has(productId)) {
      newSelection.delete(productId);
    } else {
      newSelection.add(productId);
    }
    setSelectedProducts(newSelection);
  };

  const isAllSelectedOnPage =
    products.length > 0 && products.every((p) => selectedProducts.has(p.id));

  return (
    <div className="products-page-container">
      <header className="products-page-header">
        <h1>Produtos</h1>
        <p>Gerencie o catálogo da sua loja.</p>
      </header>

      <section className="product-kpi-cards">
        <div className="product-kpi-card v2">
          <i className="fa-solid fa-boxes-stacked"></i>
          <div>
            <h4>Inventário</h4>
            <p className="kpi-main-value">
              {totalProducts} <span className="kpi-unit">Produtos</span>
            </p>
          </div>
        </div>
      </section>

      <section className="product-controls-wrapper">
        <div className="product-controls">
          <div className="search-box-prod">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              name="searchTerm"
              placeholder="Buscar por nome..."
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            />
          </div>
          <button
            className="create-product-button"
            onClick={() => handleOpenModal("create")}
          >
            <i className="fa-solid fa-plus"></i> Criar Produto
          </button>
        </div>
        <div className="product-filters">
          <CustomDropdown
            placeholder="Status"
            options={[
              { value: "Todos", label: "Todos Status" },
              { value: "Ativo", label: "Ativo" },
              { value: "Inativo", label: "Inativo" },
            ]}
            selected={filters.status}
            onSelect={(value) => handleFilterChange("status", value)}
          />
          <CustomDropdown
            placeholder="Tipo"
            options={[
              { value: "Todos", label: "Todos os Tipos" },
              { value: 1, label: "Joia" },
              { value: 2, label: "Gema" },
            ]}
            selected={filters.itemType}
            onSelect={(value) => handleFilterChange("itemType", value)}
          />
          <input
            type="number"
            name="minPrice"
            placeholder="Preço Mín."
            className="filter-input"
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Preço Máx."
            className="filter-input"
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
          />
          <CustomDropdown
            placeholder="Ordenar por"
            options={[
              { value: "date_desc", label: "Mais Recentes" },
              { value: "price_desc", label: "Maior Preço" },
              { value: "price_asc", label: "Menor Preço" },
            ]}
            selected={filters.sort}
            onSelect={(value) => handleFilterChange("sort", value)}
          />
        </div>
      </section>

      <section
        className={`bulk-actions-bar ${
          selectedProducts.size > 0 ? "visible" : ""
        }`}
      >
        <div className="selection-info">
          <span>{selectedProducts.size} selecionado(s)</span>
          <button
            className="cancel-selection-btn"
            onClick={() => setSelectedProducts(new Set())}
          >
            Cancelar
          </button>
        </div>
        <div className="action-buttons-group">
          <button onClick={() => handleOpenModal("bulk_status_activate")}>
            <i className="fa-solid fa-toggle-on"></i> Ativar
          </button>
          <button onClick={() => handleOpenModal("bulk_status_deactivate")}>
            <i className="fa-solid fa-toggle-off"></i> Inativar
          </button>
          <button
            className="danger"
            onClick={() => handleOpenModal("bulk_delete")}
          >
            <i className="fa-solid fa-trash-can"></i> Excluir
          </button>
        </div>
      </section>

      <div className="products-table-card">
        <table className="products-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={isAllSelectedOnPage}
                />
              </th>
              <th>Produto</th>
              <th>Tipo</th>
              <th>Preço</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  Buscando produtos...
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.id}
                  className={selectedProducts.has(product.id) ? "selected" : ""}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.id)}
                      onChange={() => handleSelectOne(product.id)}
                    />
                  </td>
                  <td onClick={() => handleOpenModal("edit", product)}>
                    <div className="product-info-cell">
                      {/* ✨ --- INÍCIO DA CORREÇÃO NA TABELA --- ✨ */}
                      {isVideoUrl(product.mediaUrls?.[0]) ? (
                        <video
                          src={product.mediaUrls[0]}
                          autoPlay
                          loop
                          muted
                          playsInline
                          alt={product.name}
                        />
                      ) : (
                        <img
                          src={
                            product.mediaUrls?.[0] ||
                            "https://placehold.co/80x80/e0e0e0/a0a0a0?text=Gema"
                          }
                          alt={product.name}
                        />
                      )}
                      {/* ✨ --- FIM DA CORREÇÃO NA TABELA --- ✨ */}
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td>{product.itemType === 1 ? "Joia" : "Gema"}</td>
                  <td>{formatCurrency(product.value)}</td>
                  <td>
                    <span
                      className={`status-badge-prod status-${
                        product.status === 1 ? "ativo" : "inativo"
                      }`}
                    >
                      {product.status === 1 ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination-container-prod">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Próxima
          </button>
        </div>
      </div>

      {(modal.type === "edit" || modal.type === "create") && (
        <ProductModal
          product={modal.data}
          allCategories={categories}
          onClose={handleCloseModal}
          onSave={handleSaveProduct}
          isClosing={isClosing}
        />
      )}
      {modal.type === "bulk_delete" && (
        <ConfirmationModal
          count={selectedProducts.size}
          action="EXCLUIR"
          onConfirm={handleBulkDelete}
          onClose={handleCloseModal}
          isClosing={isClosing}
        />
      )}
      {modal.type === "bulk_status_activate" && (
        <ConfirmationModal
          count={selectedProducts.size}
          action="ATIVAR"
          onConfirm={() => handleBulkStatusChange(1)}
          onClose={handleCloseModal}
          isClosing={isClosing}
        />
      )}
      {modal.type === "bulk_status_deactivate" && (
        <ConfirmationModal
          count={selectedProducts.size}
          action="INATIVAR"
          onConfirm={() => handleBulkStatusChange(0)}
          onClose={handleCloseModal}
          isClosing={isClosing}
        />
      )}
    </div>
  );
}

export default ProductsPage;
