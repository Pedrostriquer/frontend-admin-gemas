import React, { useState, useEffect, useCallback, useRef } from "react";
import "./BlogAdminPage.css";
import blogServices from "../../../dbServices/blogServices";
import { useLoad } from "../../../Context/LoadContext";

const ITEMS_PER_PAGE = 10;

// --- COMPONENTES AUXILIARES ---
// (ConfirmationModal e CategoryManagerModal sem alterações)

const ConfirmationModal = ({
  title,
  message,
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
        <h3>{title || "Confirmar Ação"}</h3>
      </div>
      <p className="confirmation-text">{message}</p>
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

const CategoryManagerModal = ({ categories, onClose, onSave, isClosing }) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await blogServices.createBlogCategory(newCategoryName);
      setNewCategoryName("");
      onSave();
    } catch (error) {
      alert("Erro ao criar categoria.");
    }
  };
  const handleDeleteCategory = async (id) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir esta categoria? Isso não pode ser desfeito."
      )
    ) {
      try {
        await blogServices.deleteBlogCategory(id);
        onSave();
      } catch (error) {
        alert("Erro ao excluir categoria.");
      }
    }
  };
  return (
    <div
      className={`modal-backdrop-prod ${isClosing ? "closing" : ""}`}
      onClick={onClose}
    >
      <div
        className={`modal-content-prod ${isClosing ? "closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-prod">
          <h3>Gerenciar Categorias</h3>
        </div>
        <div className="category-manager-body">
          <div className="category-list">
            {categories.map((cat) => (
              <div key={cat.id} className="category-item">
                <span className="category-name">{cat.categoryName}</span>
                <div className="category-actions">
                  <button onClick={() => handleDeleteCategory(cat.id)}>
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="add-category-form">
            <input
              type="text"
              placeholder="Nome da nova categoria"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <button className="save-btn-prod" onClick={handleAddCategory}>
              Adicionar
            </button>
          </div>
        </div>
        <div className="modal-footer-prod">
          <button type="button" className="close-btn-prod" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

// --- ✨ COMPONENTE POSTMODAL REFEITO PARA SUPORTAR URLS E UPLOADS ✨ ---
const PostModal = ({
  post,
  categories,
  onClose,
  onSave,
  onStatusChange,
  isClosing,
}) => {
  const isEditing = !!post;
  const [formData, setFormData] = useState({
    title: isEditing ? post.title : "",
    text: isEditing ? post.text : "",
    categoryId: isEditing ? post.categoryId : "",
    imageUrls: isEditing && post.imageUrls ? post.imageUrls : [],
    redirectLink: isEditing && post.redirectLink ? post.redirectLink : "",
    status: isEditing ? post.status : 1,
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUrlChange = (index, value) => {
    const newUrls = [...formData.imageUrls];
    newUrls[index] = value;
    setFormData((prev) => ({ ...prev, imageUrls: newUrls }));
  };

  const handleAddUrlField = () => {
    setFormData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ""] }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const newFileUrl = await blogServices.uploadPostImage(file);
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, newFileUrl],
      }));
    } catch (error) {
      alert("Falha no upload do arquivo. Tente novamente.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveMedia = async (index, url) => {
    if (url && url.includes("firebasestorage.googleapis.com")) {
      if (
        !window.confirm(
          "Isso excluirá o arquivo permanentemente do servidor. Deseja continuar?"
        )
      ) {
        return;
      }
      try {
        await blogServices.deletePostImage(url);
      } catch (error) {
        console.warn(
          "Não foi possível excluir o arquivo do servidor. Ele pode já ter sido removido."
        );
      }
    }
    const newUrls = formData.imageUrls.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, imageUrls: newUrls }));
  };

  const handleSave = () => {
    const dataToSend = {
      ...formData,
      imageUrls: formData.imageUrls.filter((url) => url && url.trim() !== ""),
      categoryId: parseInt(formData.categoryId, 10),
      status: parseInt(formData.status, 10),
      redirectLink:
        formData.redirectLink.trim() === "" ? null : formData.redirectLink,
    };
    onSave(dataToSend, isEditing);
  };

  const renderMediaPreview = (url) => {
    const isImage = /\.(jpeg|jpg|gif|png|webp)$/.test(url);
    const isVideo = /\.(mp4|webm|ogg)$/.test(url);

    if (isImage)
      return <img src={url} alt="preview" className="media-preview" />;
    if (isVideo)
      return (
        <video src={url} muted loop playsInline className="media-preview" />
      );

    return (
      <div className="media-preview-placeholder">
        <i className="fa-solid fa-link"></i>
      </div>
    );
  };

  const renderFooterActions = () => {
    if (!isEditing) {
      return (
        <button type="button" className="save-btn-prod" onClick={handleSave}>
          {" "}
          <i className="fa-solid fa-save"></i> Criar e Arquivar{" "}
        </button>
      );
    }
    return (
      <>
        <button
          type="button"
          className="delete-btn-prod close-btn-prod"
          onClick={() => onStatusChange(post.id, 4)}
        >
          <i className="fa-solid fa-trash-can"></i> Excluir
        </button>
        <div className="status-actions">
          {post.status !== 2 && (
            <button
              type="button"
              className="save-btn-prod publish-btn-prod"
              onClick={() => onStatusChange(post.id, 2)}
            >
              <i className="fa-solid fa-upload"></i> Publicar
            </button>
          )}
          {post.status !== 1 && (
            <button
              type="button"
              className="save-btn-prod archive-btn-prod"
              onClick={() => onStatusChange(post.id, 1)}
            >
              <i className="fa-solid fa-archive"></i> Arquivar
            </button>
          )}
          {post.status !== 3 && (
            <button
              type="button"
              className="close-btn-prod cancel-btn-prod"
              onClick={() => onStatusChange(post.id, 3)}
            >
              <i className="fa-solid fa-times-circle"></i> Cancelar
            </button>
          )}
          <button type="button" className="save-btn-prod" onClick={handleSave}>
            <i className="fa-solid fa-save"></i> Salvar Alterações
          </button>
        </div>
      </>
    );
  };

  return (
    <div
      className={`modal-backdrop-prod ${isClosing ? "closing" : ""}`}
      onClick={onClose}
    >
      <div
        className={`modal-content-prod ${isClosing ? "closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-prod">
          <h3>{isEditing ? "Editar Post" : "Criar Novo Post"}</h3>
        </div>
        <div className="modal-body-prod">
          <div className="form-group-prod">
            <label>Título</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group-prod">
            <label>Conteúdo</label>
            <textarea
              name="text"
              rows="8"
              value={formData.text}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-group-row">
            <div className="form-group-prod">
              <label>Categoria</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="blog-select"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group-prod">
            <label>Mídias (Imagens e Vídeos)</label>
            <div className="media-list">
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="media-item">
                  {renderMediaPreview(url)}
                  <input
                    type="text"
                    placeholder="Cole a URL ou faça upload..."
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                  />
                  <button
                    className="media-item-btn remove"
                    onClick={() => handleRemoveMedia(index, url)}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              ))}
            </div>
            <div className="media-controls">
              <button onClick={handleAddUrlField} className="media-btn">
                <i className="fa-solid fa-plus"></i> Adicionar URL
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="media-btn secondary"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Enviando...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-upload"></i> Fazer Upload
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="form-group-prod">
            <label>Link de Redirecionamento (Opcional)</label>
            <input
              type="text"
              name="redirectLink"
              value={formData.redirectLink}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="modal-footer-prod">
          <button type="button" className="close-btn-prod" onClick={onClose}>
            Fechar
          </button>
          {renderFooterActions()}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL DA PÁGINA ---
function BlogAdminPage() {
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState({ type: null, data: null });
  const [isClosing, setIsClosing] = useState(false);
  const { startLoading, stopLoading } = useLoad();

  // ✨ CORREÇÃO DO LOOP INFINITO MANTIDA ✨
  const fetchPosts = useCallback(async () => {
    startLoading();
    try {
      const response = await blogServices.searchPosts({
        status: activeTab,
        searchTerm,
        pageNumber: currentPage,
        pageSize: ITEMS_PER_PAGE,
      });
      setVisiblePosts(response.items || []);
      const calculatedTotalPages =
        Math.ceil((response.totalCount || 0) / ITEMS_PER_PAGE) || 1;
      setTotalPages(calculatedTotalPages);
    } catch (error) {
      alert("Não foi possível carregar os posts.");
      setVisiblePosts([]);
      setTotalPages(1);
    } finally {
      stopLoading();
    }
  }, [activeTab, searchTerm, currentPage]);

  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = await blogServices.getBlogCategories();
      setCategories(categoriesData || []);
    } catch (error) {
      alert("Não foi possível carregar as categorias.");
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleOpenModal = (type, data = null) => setModal({ type, data });
  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setModal({ type: null, data: null });
      setIsClosing(false);
    }, 300);
  };

  const handleSavePost = async (postData, isEditing) => {
    startLoading();
    try {
      if (isEditing) {
        await blogServices.updatePost(modal.data.id, postData);
      } else {
        await blogServices.createPost(postData);
        handleTabChange(1)
      }
      handleCloseModal();
      fetchPosts();
    } catch (error) {
      alert("Erro ao salvar o post.");
    } finally {
      stopLoading();
    }
  };

  const handleChangeStatus = async (postId, newStatus) => {
    if (
      newStatus === 4 &&
      !window.confirm(
        "Tem certeza que deseja excluir este post? Todas as mídias associadas serão removidas permanentemente."
      )
    )
      return;
    startLoading();
    try {
      await blogServices.updatePostStatus(postId, newStatus);
      handleCloseModal();
      fetchPosts();
    } catch (error) {
      alert(`Erro ao alterar status do post.`);
    } finally {
      stopLoading();
    }
  };

  const handleCategoryUpdate = () => {
    fetchCategories();
  };
  const getCategoryName = (categoryId) =>
    categories.find((c) => c.id === categoryId)?.categoryName ||
    "Sem Categoria";
  const getSafeImageUrl = (url) =>
    !url ? "https://placehold.co/80x80/eef2f9/8d99ae?text=Blog" : url;
  const getStatusInfo = (statusId) => {
    switch (statusId) {
      case 1:
        return { name: "Arquivado", class: "inativo" };
      case 2:
        return { name: "Ativo", class: "ativo" };
      case 3:
        return { name: "Cancelado", class: "cancelado" };
      default:
        return { name: "Desconhecido", class: "inativo" };
    }
  };
  const handleTabChange = (status) => {
    setActiveTab(status);
    setCurrentPage(1);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="products-page-container">
      <header className="products-page-header">
        <h1>Blog</h1>
        <p>Crie e gerencie as publicações do seu blog.</p>
      </header>
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 2 ? "active" : ""}`}
          onClick={() => handleTabChange(2)}
        >
          {" "}
          Ativos{" "}
        </button>
        <button
          className={`tab-button ${activeTab === 1 ? "active" : ""}`}
          onClick={() => handleTabChange(1)}
        >
          {" "}
          Arquivados{" "}
        </button>
        <button
          className={`tab-button ${activeTab === 3 ? "active" : ""}`}
          onClick={() => handleTabChange(3)}
        >
          {" "}
          Cancelados{" "}
        </button>
      </div>
      <section className="product-controls-wrapper">
        <div className="product-controls">
          <div className="search-box-prod">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Buscar por título..."
              onChange={handleSearchChange}
            />
          </div>
          <button
            className="create-product-button secondary"
            onClick={() => handleOpenModal("manage_categories")}
          >
            <i className="fa-solid fa-tags"></i> Gerenciar Categorias
          </button>
          <button
            className="create-product-button"
            onClick={() => handleOpenModal("create_post")}
          >
            <i className="fa-solid fa-plus"></i> Criar Post
          </button>
        </div>
      </section>
      <div className="products-table-card">
        <table className="products-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoria</th>
              <th>Status</th>
              <th>Visualizações</th>
              <th>Curtidas</th>
            </tr>
          </thead>
          <tbody>
            {visiblePosts.length > 0 ? (
              visiblePosts.map((post) => {
                const statusInfo = getStatusInfo(post.status);
                return (
                  <tr
                    key={post.id}
                    onClick={() => handleOpenModal("edit_post", post)}
                  >
                    <td>
                      <div className="product-info-cell">
                        <img
                          src={getSafeImageUrl(post.imageUrls?.[0])}
                          alt={post.title}
                        />
                        <span>{post.title}</span>
                      </div>
                    </td>
                    <td>{getCategoryName(post.categoryId)}</td>
                    <td>
                      <span
                        className={`status-badge-prod status-${statusInfo.class}`}
                      >
                        {statusInfo.name}
                      </span>
                    </td>
                    <td>{post.viewsCount || 0}</td>
                    <td>{post.likesCount || 0}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  Nenhum post encontrado.
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
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage >= totalPages}
          >
            Próxima
          </button>
        </div>
      </div>
      {(modal.type === "create_post" || modal.type === "edit_post") && (
        <PostModal
          post={modal.data}
          categories={categories}
          onClose={handleCloseModal}
          onSave={handleSavePost}
          onStatusChange={handleChangeStatus}
          isClosing={isClosing}
        />
      )}
      {modal.type === "manage_categories" && (
        <CategoryManagerModal
          categories={categories}
          onClose={handleCloseModal}
          onSave={handleCategoryUpdate}
          isClosing={isClosing}
        />
      )}
    </div>
  );
}

export default BlogAdminPage;
