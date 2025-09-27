import React, { useState, useEffect, useContext } from "react";
import MyOffers from "./MyOffers/MyOffers";
import styles from "./OffersPageStyle";
import offerService from "../../../dbServices/offerService";
import offerCategoryService from "../../../dbServices/offerCategoryService";
import { useAuth } from "../../../Context/AuthContext";

const GlobalStyle = () => (
  <style>{`
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `}</style>
);

const LoadingOverlay = () => (
  <div style={styles.loadingOverlay}>
    <div style={styles.spinner}></div>
  </div>
);

const OfferPreview = ({ offerData }) => {
  const { mideaUrl, mideaType, title, description } = offerData;
  const renderMedia = () => {
    if (!mideaUrl) {
      return (
        <div style={styles.placeholderPreview}>
          <i
            className="fa-solid fa-photo-film"
            style={styles.placeholderPreviewIcon}
          ></i>
          <p>Sua mídia aparecerá aqui</p>
        </div>
      );
    }
    if (mideaType === 2) {
      return (
        <video
          src={mideaUrl}
          style={styles.previewMedia}
          controls
          autoPlay
          muted
          loop
        />
      );
    }
    return <img src={mideaUrl} alt="Preview" style={styles.previewMedia} />;
  };
  return (
    <div style={styles.previewCard}>
      {renderMedia()}
      <div style={styles.previewTextOverlay}>
        <h4 style={styles.previewTitle}>{title || "Seu Título Aqui"}</h4>
        <p style={styles.previewDescription}>
          {description || "A descrição aparecerá aqui."}
        </p>
      </div>
    </div>
  );
};

function OffersPage() {
  const [view, setView] = useState("list");
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingOffer, setEditingOffer] = useState(null);
  const { token } = useAuth();
  const [newOffer, setNewOffer] = useState({
    title: "",
    description: "",
    mideaType: 1,
    mideaSource: 1,
    mideaUrl: "",
    mideaRedirect: "",
    categoryName: "",
    panelSide: 1,
    status: 2,
  });
  const [loading, setLoading] = useState({
    page: true,
    form: false,
    upload: false,
  });

  const fetchInitialData = async () => {
    if (!token) return;
    setLoading((prev) => ({ ...prev, page: true }));
    try {
      const offersData = await offerService.getOffers();
      setOffers(offersData);
      const categoriesData = await offerCategoryService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      alert("Não foi possível carregar os dados da página.");
    } finally {
      setLoading((prev) => ({ ...prev, page: false }));
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [token]);

  useEffect(() => {
    if (view === "list" && !loading.page) {
      fetchInitialData();
    }
  }, [view]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading((prev) => ({ ...prev, upload: true }));
    try {
      const response = await offerService.uploadMidea(file);
      setNewOffer((prev) => ({
        ...prev,
        mideaUrl: response.url,
        mideaSource: 2,
      }));
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Falha no upload da mídia.");
    } finally {
      setLoading((prev) => ({ ...prev, upload: false }));
    }
  };

  const handleDeleteMidea = async () => {
    if (!newOffer.mideaUrl) return;
    setLoading((prev) => ({ ...prev, upload: true }));
    try {
      await offerService.deleteMidea(newOffer.mideaUrl);
      setNewOffer((prev) => ({ ...prev, mideaUrl: "", mideaSource: 1 }));
    } catch (error) {
      console.error("Erro ao deletar mídia:", error);
      alert("Falha ao deletar a mídia.");
    } finally {
      setLoading((prev) => ({ ...prev, upload: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "categoryName") {
      const selectedCategory = categories.find(
        (cat) => cat.id === parseInt(value)
      );
      setNewOffer((prev) => ({
        ...prev,
        categoryName: selectedCategory ? selectedCategory.name : "",
      }));
    } else {
      const isNumeric = [
        "mideaType",
        "mideaSource",
        "status",
        "panelSide",
      ].includes(name);
      setNewOffer((prev) => ({
        ...prev,
        [name]: isNumeric ? parseInt(value) : value,
      }));
    }
  };

  const resetForm = () => {
    setNewOffer({
      title: "",
      description: "",
      mideaType: 1,
      mideaSource: 1,
      mideaUrl: "",
      mideaRedirect: "",
      categoryName: "",
      panelSide: 1,
      status: 2,
    });
    setEditingOffer(null);
  };

  const handleCreateOrUpdateOffer = async () => {
    if (
      !newOffer.title ||
      !newOffer.mideaUrl ||
      !newOffer.categoryName
    ) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }
    setLoading((prev) => ({ ...prev, form: true }));
    try {
      if (editingOffer) {
        await offerService.updateOffer(
          editingOffer.id,
          { ...newOffer, id: editingOffer.id }        );
        alert("Anúncio atualizado com sucesso!");
      } else {
        await offerService.createOffer(newOffer);
        alert(`Anúncio "${newOffer.title}" criado com sucesso!`);
      }
      resetForm();
      setView("list");
    } catch (error) {
      console.error("Erro ao salvar anúncio:", error);
      alert("Não foi possível salvar o anúncio.");
    } finally {
      setLoading((prev) => ({ ...prev, form: false }));
    }
  };

  const handleDeleteOffer = async (offerId) => {
    if (window.confirm("Tem certeza que deseja excluir este anúncio?")) {
      setLoading((prev) => ({ ...prev, page: true }));
      try {
        await offerService.deleteOffer(offerId);
        await fetchInitialData();
      } catch (error) {
        console.error("Erro ao excluir anúncio:", error);
        alert("Não foi possível excluir o anúncio.");
        setLoading((prev) => ({ ...prev, page: false }));
      }
    }
  };

  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    setNewOffer({ ...offer });
    setView("creator");
  };

  const handleToggleStatus = async (offerId) => {
    setLoading((prev) => ({ ...prev, page: true }));
    try {
      await offerService.toggleOfferStatus(offerId);
      await fetchInitialData();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      alert("Não foi possível alterar o status do anúncio.");
      setLoading((prev) => ({ ...prev, page: false }));
    }
  };

  const renderMideaInput = () => {
    if (newOffer.mideaSource === 2 && newOffer.mideaUrl) {
      return (
        <div style={styles.imagePreviewContainer}>
          <img
            src={newOffer.mideaUrl}
            alt="Preview Upload"
            style={styles.imagePreview}
          />
          <button
            onClick={handleDeleteMidea}
            style={styles.deletePreviewButton}
            disabled={loading.upload}
          >
            {loading.upload ? (
              <div
                style={{
                  ...styles.spinner,
                  width: "12px",
                  height: "12px",
                  border: "2px solid #fff",
                  borderTop: "2px solid transparent",
                }}
              ></div>
            ) : (
              <i className="fa-solid fa-xmark"></i>
            )}
          </button>
        </div>
      );
    }
    return (
      <>
        <div style={styles.radioGroup}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="mideaSource"
              value={1}
              checked={newOffer.mideaSource === 1}
              onChange={handleInputChange}
            />{" "}
            URL
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="mideaSource"
              value={2}
              checked={newOffer.mideaSource === 2}
              onChange={handleInputChange}
            />{" "}
            Upload
          </label>
        </div>
        {newOffer.mideaSource === 1 ? (
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Link da Mídia</label>
            <input
              type="text"
              name="mideaUrl"
              value={newOffer.mideaUrl}
              onChange={handleInputChange}
              style={styles.formInput}
            />
          </div>
        ) : (
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Arquivo</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              disabled={loading.upload}
              style={styles.formInput}
            />
          </div>
        )}
      </>
    );
  };

  const renderSaveButtonContent = () => {
    if (loading.form) {
      return (
        <div
          style={{
            ...styles.spinner,
            width: "20px",
            height: "20px",
            border: "3px solid #a5b4fc",
            borderTop: "3px solid #fff",
          }}
        ></div>
      );
    }
    return (
      <>
        <i
          className={editingOffer ? "fa-solid fa-save" : "fa-solid fa-plus"}
        ></i>{" "}
        {editingOffer ? "Salvar Alterações" : "Criar Anúncio"}
      </>
    );
  };

  const selectedCategoryId =
    categories.find((cat) => cat.name === newOffer.categoryName)?.id || "";

  return (
    <div style={styles.offersPageContainer}>
      <GlobalStyle />
      <header style={styles.offersPageHeader}>
        <h1 style={styles.headerH1}>Gerenciador de Anúncios</h1>
        <p style={styles.headerP}>
          Crie, configure e gerencie os anúncios para seus clientes.
        </p>
      </header>
      <div style={styles.viewToggleContainer}>
        <button
          style={
            view === "creator" ? styles.toggleButtonActive : styles.toggleButton
          }
          onClick={() => {
            resetForm();
            setView("creator");
          }}
        >
          <i className="fa-solid fa-plus"></i> Criar Novo
        </button>
        <button
          style={
            view === "list" ? styles.toggleButtonActive : styles.toggleButton
          }
          onClick={() => setView("list")}
        >
          <i className="fa-solid fa-list-check"></i> Meus Anúncios (
          {offers.length})
        </button>
      </div>

      {view === "creator" && (
        <div style={styles.offerCreationCard}>
          {loading.form && <LoadingOverlay />}
          <div style={styles.creationCardGrid}>
            <div style={styles.offerFormSection}>
              <div style={styles.cardHeaderNoBorder}>
                <i
                  className="fa-solid fa-wand-magic-sparkles"
                  style={styles.cardHeaderIcon}
                ></i>
                <h3 style={styles.cardHeaderH3}>
                  {editingOffer ? "Editar Anúncio" : "Criar Novo Anúncio"}
                </h3>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.formSection}>
                  <h4 style={styles.formSectionTitle}>
                    1. Conteúdo do Anúncio
                  </h4>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Título</label>
                    <input
                      type="text"
                      name="title"
                      value={newOffer.title}
                      onChange={handleInputChange}
                      style={styles.formInput}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Descrição</label>
                    <textarea
                      name="description"
                      value={newOffer.description}
                      onChange={handleInputChange}
                      style={{ ...styles.formInput, ...styles.formTextarea }}
                      rows="3"
                    ></textarea>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Tipo de Mídia</label>
                    <div style={styles.radioGroup}>
                      <label style={styles.radioLabel}>
                        <input
                          type="radio"
                          name="mideaType"
                          value={1}
                          checked={newOffer.mideaType === 1}
                          onChange={handleInputChange}
                        />{" "}
                        Imagem
                      </label>
                      <label style={styles.radioLabel}>
                        <input
                          type="radio"
                          name="mideaType"
                          value={2}
                          checked={newOffer.mideaType === 2}
                          onChange={handleInputChange}
                        />{" "}
                        Vídeo
                      </label>
                    </div>
                  </div>
                  {renderMideaInput()}
                </div>
                <div style={styles.formSection}>
                  <h4 style={styles.formSectionTitle}>2. Configurações</h4>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>
                      Link de Redirecionamento
                    </label>
                    <input
                      type="text"
                      name="mideaRedirect"
                      value={newOffer.mideaRedirect}
                      onChange={handleInputChange}
                      style={styles.formInput}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Categoria</label>
                    <select
                      name="categoryName"
                      value={selectedCategoryId}
                      onChange={handleInputChange}
                      style={styles.formInput}
                    >
                      <option value="" disabled>
                        Selecione uma categoria...
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Posição no Painel</label>
                    <div style={styles.radioGroup}>
                      <label style={styles.radioLabel}>
                        <input
                          type="radio"
                          name="panelSide"
                          value={1}
                          checked={newOffer.panelSide === 1}
                          onChange={handleInputChange}
                        />{" "}
                        Esquerda
                      </label>
                      <label style={styles.radioLabel}>
                        <input
                          type="radio"
                          name="panelSide"
                          value={2}
                          checked={newOffer.panelSide === 2}
                          onChange={handleInputChange}
                        />{" "}
                        Direita
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div style={styles.cardFooter}>
                <button
                  style={{
                    ...styles.saveOfferButton,
                    ...(loading.form && styles.saveOfferButtonDisabled),
                  }}
                  onClick={handleCreateOrUpdateOffer}
                  disabled={loading.form}
                >
                  {renderSaveButtonContent()}
                </button>
              </div>
            </div>
            <div style={styles.offerPreviewSection}>
              <div style={styles.cardHeaderNoBorder}>
                <i
                  className="fa-solid fa-eye"
                  style={{ ...styles.cardHeaderIcon, color: "#6366f1" }}
                ></i>
                <h3 style={styles.cardHeaderH3}>Preview</h3>
              </div>
              <div style={styles.previewArea}>
                <OfferPreview offerData={newOffer} />
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "list" && (
        <div style={{ position: "relative" }}>
          {loading.page && <LoadingOverlay />}
          <MyOffers
            offers={offers}
            onEdit={handleEditOffer}
            onDelete={handleDeleteOffer}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      )}
    </div>
  );
}

export default OffersPage;
