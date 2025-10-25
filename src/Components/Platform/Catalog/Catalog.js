// Catalog.js (Integrado)

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import styles from "./CatalogStyle";
import {
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrash,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
  FaUpload,
} from "react-icons/fa";
import catalogProductServices from "../../../dbServices/catalogProductServices";
import { useLoad } from "../../../Context/LoadContext";
import { useAuth } from "../../../Context/AuthContext";

const ITEMS_PER_PAGE = 10;

const statusMap = {
  Active: { text: "Ativo", style: styles.statusAtivo },
  Inactive: { text: "Inativo", style: styles.statusInativo },
};

// Componente para o Modal de Detalhes do Produto (com galeria)
const ProductDetailModal = ({ product, onClose, onDelete, onEditStatus }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product]);

  if (!product) return null;

  const handleStatusChange = () => {
    const newStatus = product.status === "Active" ? "Inactive" : "Active";
    onEditStatus(product.id, newStatus);
  };

  const goToNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      Math.min(prev + 1, product.imageUrls.length - 1)
    );
  };

  const goToPrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => Math.max(prev - 1, 0));
  };

  const hasMultipleImages = product.imageUrls && product.imageUrls.length > 1;
  const currentStatusInfo = statusMap[product.status] || {
    text: product.status,
    style: {},
  };

  return (
    <div style={styles.modalBackdrop} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button style={styles.modalCloseButton} onClick={onClose}>
          <FaTimes />
        </button>
        <div style={styles.detailImageContainer}>
          <img
            src={product.imageUrls[currentImageIndex]}
            alt={product.name}
            style={styles.detailImage}
          />
          {hasMultipleImages && (
            <>
              <button
                onClick={goToPrevImage}
                disabled={currentImageIndex === 0}
                style={{
                  ...styles.galleryArrow,
                  ...styles.galleryArrowLeft,
                  ...(currentImageIndex === 0
                    ? styles.galleryArrowDisabled
                    : {}),
                }}
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={goToNextImage}
                disabled={currentImageIndex === product.imageUrls.length - 1}
                style={{
                  ...styles.galleryArrow,
                  ...styles.galleryArrowRight,
                  ...(currentImageIndex === product.imageUrls.length - 1
                    ? styles.galleryArrowDisabled
                    : {}),
                }}
              >
                <FaChevronRight />
              </button>
              <span style={styles.galleryCounter}>
                {currentImageIndex + 1} / {product.imageUrls.length}
              </span>
            </>
          )}
        </div>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{product.name}</h2>
        </div>
        <div style={styles.detailGrid}>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>ID do Produto</span>
            <p style={styles.detailValue}>#{product.id}</p>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Status</span>
            <p style={styles.detailValue}>
              <span
                style={{ ...styles.statusBadge, ...currentStatusInfo.style }}
              >
                {currentStatusInfo.text}
              </span>
            </p>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Data de Criação</span>
            <p style={styles.detailValue}>
              {new Date(product.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div style={{ ...styles.detailItem, ...styles.detailDescription }}>
            <span style={styles.detailLabel}>Descrição</span>
            <p style={styles.detailValue}>{product.description}</p>
          </div>
        </div>
        <div style={styles.modalFooter}>
          <button
            onClick={() => onDelete(product.id)}
            style={{ ...styles.modalButton, ...styles.modalButtonDanger }}
          >
            <FaTrash /> Excluir Produto
          </button>
          <button
            onClick={handleStatusChange}
            style={{ ...styles.modalButton, ...styles.modalButtonPrimary }}
          >
            <FaEdit /> Alterar para{" "}
            {product.status === "Active" ? "Inativo" : "Ativo"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para o Modal de Adicionar Produto
const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    e.target.value = null;
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const cleanup = () => {
    setName("");
    setDescription("");
    setImages([]);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Por favor, adicione pelo menos uma imagem para o produto.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onAddProduct(
        name,
        description,
        images.map((img) => img.file)
      );
      cleanup();
      onClose();
    } catch (error) {
      alert("Falha ao criar o produto. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalBackdrop} onClick={onClose}>
      <form
        style={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <button type="button" style={styles.modalCloseButton} onClick={onClose}>
          <FaTimes />
        </button>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Adicionar Novo Produto</h2>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.formLabel} htmlFor="productName">
            Nome do Produto
          </label>
          <input
            type="text"
            id="productName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.formInput}
            required
            disabled={isSubmitting}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.formLabel} htmlFor="productDescription">
            Descrição
          </label>
          <textarea
            id="productDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...styles.formInput, ...styles.formTextarea }}
            required
            disabled={isSubmitting}
          ></textarea>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Imagens do Produto</label>
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageSelect}
            style={{ display: "none" }}
          />
          <button
            type="button"
            style={styles.uploadButton}
            onClick={() => fileInputRef.current.click()}
            disabled={isSubmitting}
          >
            <FaUpload style={{ marginRight: "8px" }} /> Selecionar Imagens
          </button>
          {images.length > 0 && (
            <div style={styles.imagePreviewGrid}>
              {images.map((image, index) => (
                <div key={index} style={styles.imagePreviewItem}>
                  <img
                    src={image.previewUrl}
                    alt="Pré-visualização"
                    style={styles.previewImage}
                  />
                  <button
                    type="button"
                    style={styles.removeImageButton}
                    onClick={() => handleRemoveImage(index)}
                    disabled={isSubmitting}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={styles.modalFooter}>
          <button
            type="button"
            onClick={onClose}
            style={{ ...styles.modalButton, ...styles.modalButtonSecondary }}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={{ ...styles.modalButton, ...styles.modalButtonPrimary }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar Produto"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);

  const { token } = useAuth();
  const { startLoading, stopLoading } = useLoad();

  const fetchProducts = useCallback(async () => {
    if (!token) return;
    startLoading();
    try {
      const data = await catalogProductServices.getAllProducts(
        searchTerm,
        statusFilter
      );
      const formattedData = data.map((p) => ({
        ...p,
        status: p.status === "Active" ? "Active" : "Inactive",
      }));
      setProducts(formattedData || []);
    } catch (error) {
      alert("Não foi possível carregar os produtos do catálogo.");
      setProducts([]);
    } finally {
      stopLoading();
    }
    // CORREÇÃO: Removido startLoading e stopLoading da lista de dependências para evitar loop infinito.
  }, [token, searchTerm, statusFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const paginatedProducts = useMemo(() => {
    return products.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [products, currentPage]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const handleDeleteProduct = async (productId) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir este produto? A ação não pode ser desfeita."
      )
    ) {
      startLoading();
      try {
        await catalogProductServices.deleteProduct(productId);
        setSelectedProduct(null);
        await fetchProducts();
        alert("Produto excluído com sucesso!");
      } catch (error) {
        alert("Falha ao excluir o produto.");
      } finally {
        stopLoading();
      }
    }
  };

  const handleEditStatus = async (productId, newStatus) => {
    startLoading();
    try {
      await catalogProductServices.updateProductStatus(productId, newStatus);
      setSelectedProduct(null);
      await fetchProducts();
      alert("Status do produto atualizado com sucesso!");
    } catch (error) {
      alert("Falha ao atualizar o status.");
    } finally {
      stopLoading();
    }
  };

  const handleAddProduct = async (name, description, images) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    images.forEach((file) => {
      formData.append("images", file);
    });

    await catalogProductServices.createProduct(formData);
    await fetchProducts();
    alert("Produto adicionado com sucesso!");
  };

  return (
    <>
      <div style={styles.catalogPageContainer}>
        <header style={styles.catalogPageHeader}>
          <h1 style={styles.catalogPageHeaderH1}>Catálogo GemCash</h1>
        </header>
        <div style={styles.controlsHeader}>
          <div style={styles.leftControls}>
            <div style={styles.searchBox}>
              <FaSearch style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar por nome ou ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                style={styles.searchInput}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={styles.filterSelect}
            >
              <option value="todos">Todos os Status</option>
              <option value="Active">Ativo</option>
              <option value="Inactive">Inativo</option>
            </select>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{
              ...styles.addProductButton,
              ...(isButtonHovered ? styles.addProductButtonHover : {}),
            }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            <FaPlus /> Adicionar Produto
          </button>
        </div>
        <div style={styles.tableCard}>
          <table style={styles.productsTable}>
            <thead>
              <tr>
                <th style={{ ...styles.tableCell, width: "80px" }}>Imagem</th>
                <th style={styles.tableCell}>ID</th>
                <th style={styles.tableCell}>Nome</th>
                <th style={styles.tableCell}>Data de Criação</th>
                <th style={styles.tableCell}>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => {
                  const statusInfo = statusMap[product.status] || {
                    text: product.status,
                    style: {},
                  };
                  return (
                    <tr
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      onMouseEnter={() => setHoveredRow(product.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        ...styles.tableRow,
                        ...(hoveredRow === product.id
                          ? styles.tableRowHover
                          : {}),
                      }}
                    >
                      <td style={styles.tableCell}>
                        <img
                          src={product.imageUrls && product.imageUrls[0]}
                          alt={product.name}
                          style={styles.productImageThumb}
                        />
                      </td>
                      <td style={styles.tableCell}>#{product.id}</td>
                      <td style={styles.tableCell}>{product.name}</td>
                      <td style={styles.tableCell}>
                        {new Date(product.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>
                      <td style={styles.tableCell}>
                        <span
                          style={{ ...styles.statusBadge, ...statusInfo.style }}
                        >
                          {statusInfo.text}
                        </span>
                      </td>
                    </tr>
                  );
                })
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
          <div style={styles.paginationContainer}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              style={{
                ...styles.paginationButton,
                ...(currentPage === 1 ? styles.paginationButtonDisabled : {}),
              }}
            >
              Anterior
            </button>
            <span style={styles.paginationSpan}>
              Página {currentPage} de {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              style={{
                ...styles.paginationButton,
                ...(currentPage === totalPages || totalPages === 0
                  ? styles.paginationButtonDisabled
                  : {}),
              }}
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onDelete={handleDeleteProduct}
        onEditStatus={handleEditStatus}
      />
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </>
  );
}
