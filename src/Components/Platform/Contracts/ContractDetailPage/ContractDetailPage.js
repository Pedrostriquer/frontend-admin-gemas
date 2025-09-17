import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styles from "./ContractDetailPageStyle";
import contractServices from "../../../../dbServices/contractServices";
import { useAuth } from "../../../../Context/AuthContext";
import CancelContractModal from "./CancelContractModal/CancelContractModal";
import { toPng } from "html-to-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useLoad } from "../../../../Context/LoadContext";

// --- Funções Auxiliares e Mapeamentos ---

const formatCurrency = (v) =>
  (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "N/A";

const statusMap = {
  1: "Pendente",
  2: "Valorizando",
  3: "Cancelado",
  4: "Finalizado",
};

const statusStyleMap = {
  1: "statusPendente",
  2: "statusValorizando",
  3: "statusCancelado",
  4: "statusFinalizado",
};

// NOVO: Mapeamento para status de pagamento
const paymentStatusMap = {
  PENDING: "Pendente",
  RECEIVED: "Recebido",
  CONFIRMED: "Confirmado",
  OVERDUE: "Vencido",
  CANCELLED: "Cancelado",
};

// NOVO: Mapeamento de estilos para status de pagamento
const paymentStatusStyleMap = {
  PENDING: "paymentStatusPending",
  RECEIVED: "paymentStatusReceived",
  CONFIRMED: "paymentStatusReceived",
  OVERDUE: "paymentStatusOverdue",
  CANCELLED: "paymentStatusCancelled",
};

const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

// --- Componentes Internos (Completos) ---

const LoadingOverlay = ({ text }) => (
  <div style={styles.loadingOverlay}>
    <div style={styles.loadingSpinner}></div>
    <p style={styles.loadingText}>{text}</p>
  </div>
);

const CertificateModal = ({ isOpen, onClose, onGenerate }) => {
  const [stoneName, setStoneName] = useState("");
  const [stoneCode, setStoneCode] = useState("");
  const [certificateCode, setCertificateCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = useRef(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stoneName || !stoneCode || !certificateCode) {
      alert("Preencha todos os campos do certificado.");
      return;
    }
    if (certificateRef.current === null) return;

    setIsGenerating(true);
    try {
      const dataUrl = await toPng(certificateRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const file = dataURLtoFile(dataUrl, `certificado_${certificateCode}.png`);
      onGenerate(file);

      setStoneName("");
      setStoneCode("");
      setCertificateCode("");
      onClose();
    } catch (err) {
      console.error("Oops, algo deu errado!", err);
      alert("Não foi possível gerar a imagem do certificado.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div ref={certificateRef} style={styles.certificatePreview}>
          <div style={styles.certHeader}>
            <i className="fa-solid fa-gem" style={styles.certIcon}></i>
            <h2 style={styles.certTitle}>Certificado de Autenticidade</h2>
            <p style={styles.certSubtitle}>Gemas Brilhantes Co.</p>
          </div>
          <div style={styles.certBody}>
            <p>
              Certificamos que a gema descrita abaixo é autêntica e de alta
              qualidade.
            </p>
            <div style={styles.certDetail}>
              <span>Nome da Gema:</span>{" "}
              <strong>{stoneName || "Ex: Diamante Negro"}</strong>
            </div>
            <div style={styles.certDetail}>
              <span>Código da Gema:</span>{" "}
              <strong>{stoneCode || "Ex: DN-12345"}</strong>
            </div>
            <div style={styles.certDetail}>
              <span>Código do Certificado:</span>{" "}
              <strong>{certificateCode || "Ex: GBC-CERT-XYZ"}</strong>
            </div>
          </div>
          <div style={styles.certFooter}>
            <p>Emitido em: {new Date().toLocaleDateString("pt-BR")}</p>
            <div style={styles.certSeal}>AUTÊNTICO</div>
          </div>
        </div>
        <form onSubmit={handleSubmit} style={styles.certForm}>
          <input
            type="text"
            placeholder="Nome da Pedra"
            value={stoneName}
            onChange={(e) => setStoneName(e.target.value)}
            style={styles.actionCardInput}
            disabled={isGenerating}
          />
          <input
            type="text"
            placeholder="Código da Pedra"
            value={stoneCode}
            onChange={(e) => setStoneCode(e.target.value)}
            style={styles.actionCardInput}
            disabled={isGenerating}
          />
          <input
            type="text"
            placeholder="Código do Certificado"
            value={certificateCode}
            onChange={(e) => setCertificateCode(e.target.value)}
            style={styles.actionCardInput}
            disabled={isGenerating}
          />
          <div style={styles.certFormActions}>
            <button
              type="button"
              onClick={onClose}
              style={{ ...styles.actionCardButton, ...styles.buttonSecondary }}
              disabled={isGenerating}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{ ...styles.actionCardButton, ...styles.buttonPrimary }}
              disabled={isGenerating}
            >
              {isGenerating ? "Gerando..." : "Gerar Certificado"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TrackingModal = ({ isOpen, onClose, onSubmit, existingTracking }) => {
  const [companyName, setCompanyName] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [hasLink, setHasLink] = useState("nao");
  const [trackingLink, setTrackingLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingTracking) {
      setCompanyName(existingTracking.companyName || "");
      setTrackingCode(existingTracking.trackingCode || "");
      if (existingTracking.trackingLink) {
        setHasLink("sim");
        setTrackingLink(existingTracking.trackingLink);
      } else {
        setHasLink("nao");
        setTrackingLink("");
      }
    } else {
      setCompanyName("");
      setTrackingCode("");
      setHasLink("nao");
      setTrackingLink("");
    }
  }, [isOpen, existingTracking]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = {
      companyName,
      trackingCode,
      trackingLink: hasLink === "sim" ? trackingLink : null,
    };
    await onSubmit(data);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.modalTitle}>Informações de Rastreio</h3>
        <form onSubmit={handleSubmit} style={styles.modalForm}>
          <input
            type="text"
            placeholder="Nome da Transportadora"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            style={styles.actionCardInput}
            required
          />
          <input
            type="text"
            placeholder="Código de Rastreio"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            style={styles.actionCardInput}
            required
          />
          <div style={styles.modalSelectGroup}>
            <label>Possui link de rastreamento?</label>
            <select
              value={hasLink}
              onChange={(e) => setHasLink(e.target.value)}
              style={styles.modalSelect}
            >
              <option value="nao">Não</option>
              <option value="sim">Sim</option>
            </select>
          </div>
          {hasLink === "sim" && (
            <input
              type="text"
              placeholder="Link de Rastreamento (URL completa)"
              value={trackingLink}
              onChange={(e) => setTrackingLink(e.target.value)}
              style={styles.actionCardInput}
              required
            />
          )}
          <div style={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              style={{ ...styles.actionCardButton, ...styles.buttonSecondary }}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{ ...styles.actionCardButton, ...styles.buttonPrimary }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Componente Principal ---

function ContractDetailPage() {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { startLoading, stopLoading } = useLoad();

  // Estados do Contrato e UI
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  // NOVO: Estados do Pagamento
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isFetchingPayment, setIsFetchingPayment] = useState(false);
  const [isApprovingPayment, setIsApprovingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // Estados de Arquivos e Mídias
  const [media, setMedia] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [newMediaFiles, setNewMediaFiles] = useState([]);
  const [newCertificateFiles, setNewCertificateFiles] = useState([]);

  // Estados dos Modais e Ações
  const [addMonths, setAddMonths] = useState(1);
  const [reinvestAmount, setReinvestAmount] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [showCertOptions, setShowCertOptions] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  // Estados dos Toggles
  const [isTogglingReinvestment, setIsTogglingReinvestment] = useState(false);
  const [isTogglingAutoReinvest, setIsTogglingAutoReinvest] = useState(false);

  // Refs
  const mediaInputRef = useRef(null);
  const certImageInputRef = useRef(null);

  const hasPendingChanges =
    newMediaFiles.length > 0 || newCertificateFiles.length > 0;

  // --- Funções de API ---

  // NOVO: Função para buscar detalhes do pagamento
  const fetchPaymentDetails = useCallback(
    async (paymentId) => {
      if (!token || !paymentId) return;
      setIsFetchingPayment(true);
      setPaymentError(null);
      try {
        const data = await contractServices.getPaymentDetails(token, paymentId);
        setPaymentDetails(data);
      } catch (err) {
        setPaymentError("Não foi possível carregar os detalhes do pagamento.");
      } finally {
        setIsFetchingPayment(false);
      }
    },
    [token]
  );

  const fetchContract = useCallback(async () => {
    if (!token || !contractId) return;
    setIsLoading(true);
    setError(null);
    startLoading();
    try {
      const data = await contractServices.getById(token, contractId);
      setContract(data);
      setMedia(
        data.rockData?.map((url) => ({
          type: url.includes(".mp4") ? "video" : "image",
          url,
          isNew: false,
        })) || []
      );
      setCertificates(
        data.certificados?.map((url) => ({
          type: "image",
          url,
          isNew: false,
        })) || []
      );

      // NOVO: Chama a busca de detalhes do pagamento após carregar o contrato
      if (data.paymentId) {
        await fetchPaymentDetails(data.paymentId);
      }
    } catch (err) {
      setError("Não foi possível carregar o contrato.");
    } finally {
      setIsLoading(false);
      stopLoading();
    }
  }, [contractId, token, fetchPaymentDetails]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  // --- Handlers de Ações ---

  // NOVO: Função para aprovar o pagamento
  const handleApprovePayment = async () => {
    if (!contract?.paymentId || isApprovingPayment) return;
    setIsApprovingPayment(true);
    try {
      startLoading();
      await contractServices.approveLocalPayment(token, contract.paymentId);
      alert("Pagamento aprovado com sucesso!");
      await fetchPaymentDetails(contract.paymentId);
    } catch (err) {
      alert("Ocorreu um erro ao aprovar o pagamento.");
    } finally {
      setIsApprovingPayment(false);
      stopLoading();
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    const action = newStatus === 2 ? "ativar" : "cancelar";
    if (!window.confirm(`Tem certeza que deseja ${action} este contrato?`))
      return;
    setIsUpdatingStatus(true);
    try {
      startLoading();
      await contractServices.updateContractStatus(
        token,
        [contractId],
        newStatus
      );
      await fetchContract();
      alert(
        `Contrato ${action === "ativar" ? "ativado" : "cancelado"} com sucesso!`
      );
    } catch (err) {
      alert(`Ocorreu um erro ao ${action} o contrato.`);
    } finally {
      setIsUpdatingStatus(false);
      stopLoading();
    }
  };

  const handleReinvest = async () => {};

  const handleToggleAutoReinvest = async () => {
    if (isTogglingAutoReinvest) return;
    setIsTogglingAutoReinvest(true);
    try {
      startLoading();
      const newState = !contract.autoReinvest;
      await contractServices.atualizarAutoReinvestimentoCliente(
        token,
        contractId,
        newState,
        contract.clientId
      );
      setContract((prev) => ({ ...prev, autoReinvest: newState }));
    } catch (err) {
      alert("Erro ao alterar o reinvestimento automático.");
    } finally {
      setIsTogglingAutoReinvest(false);
      stopLoading();
    }
  };

  const handleExtendContract = () =>
    alert(`Funcionalidade de extensão ainda não implementada.`);

  const handleOpenCancelModal = () => setIsCancelModalOpen(true);

  const handleToggleReinvestmentAvailability = async () => {
    if (isTogglingReinvestment) return;
    setIsTogglingReinvestment(true);
    try {
      startLoading();
      const newState = !contract.reivestmentAvaliable;
      const updatedContract =
        await contractServices.setReinvestmentAvailability(
          token,
          contractId,
          newState
        );
      setContract(updatedContract);
    } catch (err) {
      alert("Erro ao alterar a permissão de reinvestimento.");
    } finally {
      setIsTogglingReinvestment(false);
      stopLoading();
    }
  };

  const handleMediaFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMediaFiles((prev) => [...prev, file]);
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith("video") ? "video" : "image";
      setMedia((prev) => [
        ...prev,
        { url, type, name: file.name, isNew: true, fileRef: file },
      ]);
      e.target.value = null;
    }
  };

  const handleCertificateImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCertificateFiles((prev) => [...prev, file]);
      const url = URL.createObjectURL(file);
      setCertificates((prev) => [
        ...prev,
        { type: "image", url, name: file.name, isNew: true, fileRef: file },
      ]);
      setShowCertOptions(false);
      e.target.value = null;
    }
  };

  const handleGenerateCertificate = (file) => {
    setNewCertificateFiles((prev) => [...prev, file]);
    const url = URL.createObjectURL(file);
    setCertificates((prev) => [
      ...prev,
      { type: "image", url, name: file.name, isNew: true, fileRef: file },
    ]);
  };

  const handleSaveFiles = async () => {
    if (!hasPendingChanges || isSaving) return;
    setIsSaving(true);
    try {
      startLoading();
      await contractServices.uploadContractFiles(
        token,
        contractId,
        newCertificateFiles,
        newMediaFiles
      );
      setNewCertificateFiles([]);
      setNewMediaFiles([]);
      await fetchContract();
      alert("Arquivos salvos com sucesso!");
    } catch (err) {
      alert("Ocorreu um erro ao salvar os arquivos. Tente novamente.");
    } finally {
      setIsSaving(false);
      stopLoading();
    }
  };

  const handleRemoveStagedItem = (itemToRemove, type) => {
    if (isSaving) return;
    if (type === "media") {
      setMedia((prev) => prev.filter((item) => item !== itemToRemove));
      setNewMediaFiles((prev) =>
        prev.filter((file) => file !== itemToRemove.fileRef)
      );
    } else {
      setCertificates((prev) => prev.filter((item) => item !== itemToRemove));
      setNewCertificateFiles((prev) =>
        prev.filter((file) => file !== itemToRemove.fileRef)
      );
    }
  };

  const handleRemoveFile = async (fileUrl, fileType) => {
    if (
      !window.confirm(
        `Tem certeza que deseja excluir este arquivo? A ação não pode ser desfeita.`
      )
    )
      return;
    setIsDeleting(true);
    try {
      startLoading();
      await contractServices.deleteContractFile(
        token,
        contractId,
        fileUrl,
        fileType
      );
      await fetchContract();
    } catch (err) {
      alert("Erro ao excluir o arquivo.");
    } finally {
      setIsDeleting(false);
      stopLoading();
    }
  };

  const handleRemoveAllFiles = async (fileType) => {
    const typeName = fileType === "media" ? "mídias" : "certificados";
    if (
      !window.confirm(
        `ATENÇÃO! Tem certeza que deseja excluir TODAS as ${typeName} deste contrato? A ação não pode ser desfeita.`
      )
    )
      return;
    setIsDeleting(true);
    try {
      startLoading();
      await contractServices.deleteAllContractFiles(
        token,
        contractId,
        fileType
      );
      await fetchContract();
    } catch (err) {
      alert(`Erro ao excluir todas as ${typeName}.`);
    } finally {
      stopLoading();
      setIsDeleting(false);
    }
  };

  const handleSaveTracking = async (trackingData) => {
    setIsSaving(true);
    try {
      startLoading();
      await contractServices.addOrUpdateTracking(
        token,
        contractId,
        trackingData
      );
      await fetchContract();
      alert("Informações de rastreio salvas com sucesso!");
    } catch (err) {
      alert("Erro ao salvar as informações de rastreio.");
    } finally {
      stopLoading();
      setIsSaving(false);
    }
  };

  // --- Renderização Condicional ---

  if (isLoading || isDeleting || isUpdatingStatus) {
    let text = "Carregando contrato...";
    if (isDeleting) text = "Excluindo arquivos...";
    if (isUpdatingStatus) text = "Atualizando status...";
    return <LoadingOverlay text={text} />;
  }

  if (error)
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "red" }}>
        {error}
      </div>
    );
  if (!contract)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Contrato não encontrado.
      </div>
    );

  const progressPercentage =
    (contract.totalIncome / contract.finalAmount) * 100;

  // --- JSX de Retorno ---

  return (
    <>
      {isSaving && <LoadingOverlay text="Salvando alterações..." />}
      <input
        type="file"
        ref={mediaInputRef}
        style={{ display: "none" }}
        accept="image/*,video/*"
        onChange={handleMediaFileChange}
      />
      <input
        type="file"
        ref={certImageInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleCertificateImageChange}
      />

      <div style={styles.detailPageContainer}>
        <header style={styles.detailHeader}>
          <div style={styles.headerLeft}>
            <button
              style={styles.backButton}
              onClick={() => navigate(-1)}
              title="Voltar"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h1 style={styles.headerTitle}>
              Contrato <span style={styles.headerTitleId}>#{contract.id}</span>
            </h1>
          </div>
          <div style={styles.headerActions}>
            {hasPendingChanges && (
              <button
                onClick={handleSaveFiles}
                style={{
                  ...styles.actionCardButton,
                  ...styles.saveChangesButton,
                }}
                disabled={isSaving}
              >
                {isSaving ? (
                  <div style={styles.buttonSpinner}></div>
                ) : (
                  <i className="fa-solid fa-save"></i>
                )}
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </button>
            )}
            <Link
              to={`/platform/clients/${contract?.clientId}`}
              style={{ textDecoration: "none" }}
            >
              <button style={styles.goToClientButton}>
                <i className="fa-solid fa-user"></i> Ir para Cliente
              </button>
            </Link>

            {contract.status === 1 && (
              <div style={styles.pendingActions}>
                <button
                  onClick={() => handleUpdateStatus(3)}
                  style={{ ...styles.actionButton, ...styles.denyBtn }}
                  disabled={isUpdatingStatus}
                >
                  <i className="fa-solid fa-xmark"></i> Cancelar
                </button>
                <button
                  onClick={() => handleUpdateStatus(2)}
                  style={{ ...styles.actionButton, ...styles.approveBtn }}
                  disabled={isUpdatingStatus}
                >
                  <i className="fa-solid fa-check"></i> Ativar Contrato
                </button>
              </div>
            )}

            <span
              style={{
                ...styles.statusBadge,
                ...styles[statusStyleMap[contract.status]],
              }}
            >
              {statusMap[contract.status]}
            </span>
          </div>
        </header>

        <div style={styles.detailGrid}>
          <div style={styles.mainContent}>
            <div style={styles.kpiGrid}>
              <div style={styles.kpiCard}>
                <h2 style={styles.kpiCardTitle}>
                  <i className="fa-solid fa-piggy-bank"></i> Valor Investido
                </h2>
                <p style={styles.kpiCardValue}>
                  {formatCurrency(contract.amount)}
                </p>
              </div>
              <div style={styles.kpiCard}>
                <h2 style={styles.kpiCardTitle}>
                  <i className="fa-solid fa-arrow-trend-up"></i> Lucro Atual
                </h2>
                <p style={styles.kpiCardValue}>
                  {formatCurrency(contract.currentIncome)}
                </p>
              </div>
              <div style={styles.kpiCard}>
                <h2 style={styles.kpiCardTitle}>
                  <i className="fa-solid fa-trophy"></i> Valor Teto
                </h2>
                <p style={styles.kpiCardValue}>
                  {formatCurrency(contract.finalAmount)}
                </p>
              </div>
            </div>

            <div style={styles.progressSection}>
              <div style={styles.progressHeader}>
                <h3 style={styles.progressTitle}>Progresso do Contrato</h3>
                <span style={styles.progressDates}>
                  {formatDate(contract.activationDate)} -{" "}
                  {formatDate(contract.endContractDate)}
                </span>
              </div>
              <div style={styles.progressBarContainer}>
                <div
                  style={{
                    ...styles.progressBarFill,
                    width: `${progressPercentage}%`,
                  }}
                ></div>
              </div>
              <div style={styles.progressLabels}>
                <span>{formatCurrency(contract.totalIncome)}</span>
                <span>{progressPercentage.toFixed(1)}%</span>
              </div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.cardHeaderAction}>
                <h3 style={styles.infoCardTitle}>
                  <i className="fa-solid fa-photo-film"></i> Imagens e Vídeos
                </h3>
                {media.filter((m) => !m.isNew).length > 0 && (
                  <button
                    style={styles.deleteAllButton}
                    onClick={() => handleRemoveAllFiles("media")}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Excluir Todas
                  </button>
                )}
              </div>
              <div style={styles.mediaGrid}>
                {media.map((item, index) => (
                  <div key={index} style={styles.mediaItem}>
                    {item.isNew ? (
                      <button
                        style={styles.removeItemButton}
                        onClick={() => handleRemoveStagedItem(item, "media")}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    ) : (
                      <button
                        style={styles.removeItemButton}
                        onClick={() => handleRemoveFile(item.url, "media")}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    )}
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        style={styles.mediaContent}
                      />
                    ) : (
                      <video
                        src={item.url}
                        style={styles.mediaContent}
                        controls
                      />
                    )}
                  </div>
                ))}
                <button
                  style={styles.addMediaButton}
                  onClick={() => mediaInputRef.current.click()}
                >
                  <i className="fa-solid fa-plus"></i> Adicionar Mídia
                </button>
              </div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.cardHeaderAction}>
                <h3 style={styles.infoCardTitle}>
                  <i className="fa-solid fa-award"></i> Certificados
                </h3>
                {certificates.filter((c) => !c.isNew).length > 0 && (
                  <button
                    style={styles.deleteAllButton}
                    onClick={() => handleRemoveAllFiles("certificate")}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Excluir Todas
                  </button>
                )}
              </div>
              <div style={styles.certificateList}>
                {certificates.map((cert, index) => (
                  <div key={index} style={styles.certificateItem}>
                    {cert.isNew ? (
                      <button
                        style={styles.removeItemButton}
                        onClick={() =>
                          handleRemoveStagedItem(cert, "certificate")
                        }
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    ) : (
                      <button
                        style={styles.removeItemButton}
                        onClick={() =>
                          handleRemoveFile(cert.url, "certificate")
                        }
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    )}
                    <img
                      src={cert.url}
                      alt={cert.name || "Certificado"}
                      style={styles.certificateImage}
                    />
                  </div>
                ))}
              </div>
              <div style={styles.certActionsContainer}>
                {!showCertOptions ? (
                  <button
                    onClick={() => setShowCertOptions(true)}
                    style={{
                      ...styles.actionCardButton,
                      ...styles.buttonPrimary,
                      width: "auto",
                    }}
                  >
                    <i
                      className="fa-solid fa-plus"
                      style={{ marginRight: "8px" }}
                    ></i>{" "}
                    Adicionar Certificado
                  </button>
                ) : (
                  <div style={styles.certOptionButtons}>
                    <button
                      onClick={() => certImageInputRef.current.click()}
                      style={{
                        ...styles.actionCardButton,
                        ...styles.buttonSecondary,
                      }}
                    >
                      <i
                        className="fa-solid fa-image"
                        style={{ marginRight: "8px" }}
                      ></i>{" "}
                      Adicionar Imagem
                    </button>
                    <button
                      onClick={() => setIsCertModalOpen(true)}
                      style={{
                        ...styles.actionCardButton,
                        ...styles.buttonPrimary,
                      }}
                    >
                      <i
                        className="fa-solid fa-scroll"
                        style={{ marginRight: "8px" }}
                      ></i>{" "}
                      Gerar Certificado Digital
                    </button>
                    <button
                      onClick={() => setShowCertOptions(false)}
                      style={styles.certCancelButton}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside style={styles.actionPanel}>
            {/* NOVO: Card de Status de Pagamento */}
            {contract.paymentId && (
              <div style={styles.actionCard}>
                <h3 style={styles.actionCardTitle}>
                  <i className="fa-solid fa-receipt"></i> Status do Pagamento
                </h3>
                {isFetchingPayment ? (
                  <p>Buscando status...</p>
                ) : paymentError ? (
                  <p style={{ color: "red" }}>{paymentError}</p>
                ) : paymentDetails ? (
                  <>
                    <div style={styles.paymentInfoContainer}>
                      <div style={styles.paymentInfoRow}>
                        <span style={styles.paymentInfoLabel}>Método:</span>
                        <strong>{paymentDetails.paymentMethod}</strong>
                      </div>
                      <div style={styles.paymentInfoRow}>
                        <span style={styles.paymentInfoLabel}>Status:</span>
                        <span
                          style={{
                            ...styles.paymentStatusBadge,
                            ...styles[
                              paymentStatusStyleMap[paymentDetails.status] ||
                                "paymentStatusCancelled"
                            ],
                          }}
                        >
                          {paymentStatusMap[paymentDetails.status] ||
                            "Desconhecido"}
                        </span>
                      </div>
                    </div>
                    {paymentDetails.status !== "RECEIVED" &&
                      paymentDetails.status !== "CONFIRMED" && (
                        <button
                          onClick={handleApprovePayment}
                          style={{
                            ...styles.actionCardButton,
                            ...styles.approvePaymentButton,
                          }}
                          disabled={isApprovingPayment}
                        >
                          {isApprovingPayment ? (
                            <div style={styles.buttonSpinner}></div>
                          ) : (
                            <i className="fa-solid fa-check-double"></i>
                          )}
                          {isApprovingPayment
                            ? "Aprovando..."
                            : "Aprovar Pagamento (Teste)"}
                        </button>
                      )}
                  </>
                ) : (
                  <p>Nenhum detalhe de pagamento encontrado.</p>
                )}
              </div>
            )}

            <div style={styles.actionCard}>
              <h3 style={styles.actionCardTitle}>
                <i className="fa-solid fa-truck-fast"></i> Rastreio da Pedra
              </h3>
              {contract.tracking ? (
                <div style={styles.trackingInfo}>
                  <span>
                    <strong>Transportadora:</strong>{" "}
                    {contract.tracking.companyName}
                  </span>
                  <span>
                    <strong>Código:</strong> {contract.tracking.trackingCode}
                  </span>
                  {contract.tracking.trackingLink && (
                    <a
                      href={contract.tracking.trackingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Rastrear Envio
                    </a>
                  )}
                  <button
                    onClick={() => setIsTrackingModalOpen(true)}
                    style={styles.editTrackingButton}
                  >
                    Editar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsTrackingModalOpen(true)}
                  style={{
                    ...styles.actionCardButton,
                    ...styles.buttonPrimary,
                    width: "100%",
                  }}
                >
                  <i className="fa-solid fa-plus"></i> Inserir Código de
                  Rastreio
                </button>
              )}
            </div>

            <div style={styles.actionCard}>
              <h3 style={styles.actionCardTitle}>
                <i className="fa-solid fa-calendar-plus"></i> Estender Contrato
              </h3>
              <div style={styles.actionCardInputGroup}>
                <input
                  type="number"
                  min="1"
                  value={addMonths}
                  onChange={(e) => setAddMonths(e.target.value)}
                  style={styles.actionCardInput}
                  placeholder="Meses"
                />
                <button
                  onClick={handleExtendContract}
                  style={{
                    ...styles.actionCardButton,
                    ...styles.buttonPrimary,
                  }}
                >
                  Adicionar
                </button>
              </div>
            </div>

            <div style={styles.actionCard}>
              <h3 style={styles.actionCardTitle}>
                <i className="fa-solid fa-sack-dollar"></i> Reinvestir Lucros
              </h3>
              <div style={styles.actionCardInputGroup}>
                <input
                  type="text"
                  value={reinvestAmount}
                  onChange={(e) => setReinvestAmount(e.target.value)}
                  style={styles.actionCardInput}
                  placeholder="R$ 0,00"
                />
                <button
                  onClick={handleReinvest}
                  style={{
                    ...styles.actionCardButton,
                    ...styles.buttonPrimary,
                  }}
                >
                  Reinvestir
                </button>
              </div>
              <div
                style={{
                  ...styles.toggleSwitchContainer,
                  marginBottom: "12px",
                }}
              >
                <span style={styles.toggleLabel}>Permitir Reinvestimento</span>
                <label style={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={contract.reivestmentAvaliable || false}
                    onChange={handleToggleReinvestmentAvailability}
                    disabled={isTogglingReinvestment}
                    style={styles.toggleSwitchInput}
                  />
                  <span
                    style={{
                      ...styles.toggleSlider,
                      ...(contract.reivestmentAvaliable &&
                        styles.toggleSwitchInputChecked),
                    }}
                  >
                    {isTogglingReinvestment ? (
                      <div style={styles.toggleSpinner} />
                    ) : (
                      <span
                        style={{
                          ...styles.toggleSliderBefore,
                          ...(contract.reivestmentAvaliable &&
                            styles.toggleSwitchInputCheckedBefore),
                        }}
                      ></span>
                    )}
                  </span>
                </label>
              </div>
              <div style={styles.toggleSwitchContainer}>
                <span
                  style={{
                    ...styles.toggleLabel,
                    color: !contract.reivestmentAvaliable
                      ? "#9ca3af"
                      : "#334155",
                  }}
                >
                  Reinvest. automático
                </span>
                <label style={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={contract.autoReinvest || false}
                    onChange={handleToggleAutoReinvest}
                    disabled={
                      !contract.reivestmentAvaliable || isTogglingAutoReinvest
                    }
                    style={styles.toggleSwitchInput}
                  />
                  <span
                    style={{
                      ...styles.toggleSlider,
                      ...(contract.autoReinvest &&
                        contract.reivestmentAvaliable &&
                        styles.toggleSwitchInputChecked),
                    }}
                  >
                    {isTogglingAutoReinvest ? (
                      <div style={styles.toggleSpinner} />
                    ) : (
                      <span
                        style={{
                          ...styles.toggleSliderBefore,
                          ...(contract.autoReinvest &&
                            contract.reivestmentAvaliable &&
                            styles.toggleSwitchInputCheckedBefore),
                        }}
                      ></span>
                    )}
                  </span>
                </label>
              </div>
            </div>

            {contract.status !== 3 && contract.status !== 4 && (
              <div style={styles.actionCard}>
                <h3 style={styles.actionCardTitle}>
                  <i className="fa-solid fa-triangle-exclamation"></i> Zona de
                  Perigo
                </h3>
                <button
                  onClick={handleOpenCancelModal}
                  style={{ ...styles.actionCardButton, ...styles.buttonDanger }}
                >
                  Cancelar Contrato
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>

      <CancelContractModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        contract={contract}
      />
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        onGenerate={handleGenerateCertificate}
      />
      <TrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        onSubmit={handleSaveTracking}
        existingTracking={contract?.tracking}
      />
    </>
  );
}

export default ContractDetailPage;
