import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ConsultantDetailPageStyle";
import { useAuth } from "../../../../Context/AuthContext";
import consultantService from "../../../../dbServices/consultantService";
import formatServices from "../../../../formatServices/formatServices";
import AddBalanceModal from "./AddBalanceModal/AddBalanceModal";
import { useLoad } from "../../../../Context/LoadContext";

const CLIENTS_PER_PAGE = 5;

function ConsultantDetailPage() {
  const { consultantId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [consultant, setConsultant] = useState(null);
  const [originalConsultant, setOriginalConsultant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const { startLoading, stopLoading } = useLoad();

  // Estados para a lista de clientes
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [clientsCurrentPage, setClientsCurrentPage] = useState(1);
  const [clientsTotalPages, setClientsTotalPages] = useState(0);

  const fetchClients = useCallback(
    async (page) => {
      if (!token || !consultantId) return;
      setClientsLoading(true);
      startLoading();
      try {
        const data = await consultantService.getClientsForConsultant(
          token,
          consultantId,
          page,
          CLIENTS_PER_PAGE
        );
        setClients(data.items || []);
        setClientsTotalPages(
          Math.ceil((data.totalCount || 0) / CLIENTS_PER_PAGE)
        );
      } catch (error) {
        console.error("Falha ao buscar clientes:", error);
        setClients([]);
      } finally {
        setClientsLoading(false);
        stopLoading();
      }
    },
    [consultantId, token]
  );

  const fetchConsultant = useCallback(async () => {
    if (!token || !consultantId) return;
    setIsLoading(true);
    startLoading();
    try {
      const data = await consultantService.getConsultantById(
        token,
        consultantId
      );
      setConsultant(data);
      setOriginalConsultant(data);
      // Busca a primeira página de clientes
      await fetchClients(1);
    } catch (error) {
      navigate("/platform/consultants");
    } finally {
      setIsLoading(false);
      stopLoading();
    }
  }, [consultantId, token, navigate, fetchClients]);

  useEffect(() => {
    fetchConsultant();
  }, [fetchConsultant]);

  useEffect(() => {
    // Evita a busca inicial duplicada, só busca quando a página muda
    if (!isLoading && !isEditing) {
      fetchClients(clientsCurrentPage);
    }
  }, [clientsCurrentPage, isLoading, isEditing, fetchClients]);

  const handleEditToggle = () => {
    if (isEditing) {
      setConsultant(originalConsultant);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConsultant((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      startLoading();
      const updatedData = {
        ...consultant,
        status: parseInt(consultant.status, 10),
        commissionPercentage: parseFloat(consultant.commissionPercentage),
      };
      await consultantService.updateConsultant(
        token,
        consultantId,
        updatedData
      );
      setOriginalConsultant(updatedData);
      setIsEditing(false);
      alert("Consultor atualizado com sucesso!");
    } catch (error) {
      alert("Falha ao atualizar o consultor.");
    } finally {
      setIsSaving(false);
      stopLoading();
    }
  };

  const handleAddBalance = async ({ amount }) => {
    setIsSaving(true);
    try {
      startLoading();
      await consultantService.addBalance(token, consultantId, amount);
      alert("Saldo adicionado com sucesso!");
      setIsBalanceModalOpen(false);
      await fetchConsultant();
    } catch (error) {
      alert(`Erro: ${error.message || "Não foi possível adicionar o saldo."}`);
    } finally {
      setIsSaving(false);
      stopLoading();
    }
  };

  if (isLoading)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>Carregando...</div>
    );
  if (!consultant)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Consultor não encontrado.
      </div>
    );

  return (
    <>
      <div style={styles.pageContainer}>
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <button
              style={styles.backButton}
              onClick={() => navigate(-1)}
              title="Voltar"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h1 style={styles.headerTitle}>{originalConsultant.name}</h1>
          </div>
          <div style={styles.headerActions}>
            {isEditing ? (
              <>
                <button
                  style={styles.saveButton}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    "Salvando..."
                  ) : (
                    <>
                      <i className="fa-solid fa-save"></i> Salvar
                    </>
                  )}
                </button>
                <button
                  style={styles.cancelButton}
                  onClick={handleEditToggle}
                  disabled={isSaving}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  style={styles.actionButton}
                  onClick={() => setIsBalanceModalOpen(true)}
                >
                  <i className="fa-solid fa-plus"></i> Adicionar Saldo
                </button>
                <button style={styles.editButton} onClick={handleEditToggle}>
                  <i className="fa-solid fa-pencil"></i> Editar
                </button>
              </>
            )}
          </div>
        </header>

        <div style={styles.mainGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.infoCard}>
              <h3 style={styles.cardTitle}>
                <i className="fa-solid fa-user"></i> Informações Pessoais
              </h3>
              <div style={styles.infoGrid}>
                <div style={styles.infoGroup}>
                  <label style={styles.infoLabel}>Nome Completo</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={consultant.name}
                      onChange={handleInputChange}
                      style={styles.formInput}
                    />
                  ) : (
                    <p style={styles.infoValue}>{consultant.name}</p>
                  )}
                </div>
                <div style={styles.infoGroup}>
                  <label style={styles.infoLabel}>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={consultant.email}
                      onChange={handleInputChange}
                      style={styles.formInput}
                    />
                  ) : (
                    <p style={styles.infoValue}>{consultant.email}</p>
                  )}
                </div>
                <div style={styles.infoGroup}>
                  <label style={styles.infoLabel}>CPF</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="cpfCnpj"
                      value={consultant.cpfCnpj}
                      onChange={handleInputChange}
                      style={styles.formInput}
                    />
                  ) : (
                    <p style={styles.infoValue}>
                      {formatServices.formatCpfCnpj(consultant.cpfCnpj)}
                    </p>
                  )}
                </div>
                <div style={styles.infoGroup}>
                  <label style={styles.infoLabel}>Telefone</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phoneNumber"
                      value={consultant.phoneNumber}
                      onChange={handleInputChange}
                      style={styles.formInput}
                    />
                  ) : (
                    <p style={styles.infoValue}>{consultant.phoneNumber}</p>
                  )}
                </div>
              </div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.cardTitleContainer}>
                <h3 style={styles.cardTitle}>
                  <i className="fa-solid fa-users"></i> Clientes Associados
                </h3>
                {clientsTotalPages > 1 && (
                  <div style={styles.paginationControls}>
                    <button
                      onClick={() => setClientsCurrentPage((p) => p - 1)}
                      disabled={clientsCurrentPage === 1}
                      style={styles.paginationButton}
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <span style={styles.pageInfo}>
                      {clientsCurrentPage} / {clientsTotalPages}
                    </span>
                    <button
                      onClick={() => setClientsCurrentPage((p) => p + 1)}
                      disabled={clientsCurrentPage === clientsTotalPages}
                      style={styles.paginationButton}
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </div>
              {clientsLoading ? (
                <p style={styles.loadingText}>Carregando clientes...</p>
              ) : clients.length > 0 ? (
                <div style={styles.clientsList}>
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      style={styles.clientItem}
                      onClick={() => navigate(`/platform/clients/${client.id}`)}
                    >
                      <div style={styles.clientAvatar}>
                        {client.profilePictureUrl ? (
                          <img
                            src={client.profilePictureUrl}
                            alt={client.name}
                            style={styles.clientAvatarImg}
                          />
                        ) : (
                          client.name.charAt(0)
                        )}
                      </div>
                      <div style={styles.clientInfo}>
                        <p style={styles.clientName}>{client.name}</p>
                        <p style={styles.clientEmail}>{client.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={styles.loadingText}>
                  Nenhum cliente associado a este consultor.
                </p>
              )}
            </div>
          </div>

          <div style={styles.rightColumn}>
            <div style={styles.infoCard}>
              <h3 style={styles.cardTitle}>
                <i className="fa-solid fa-wallet"></i> Saldo
              </h3>
              <p
                style={{
                  ...styles.infoValue,
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  padding: 0,
                  background: "none",
                  border: "none",
                }}
              >
                {formatServices.formatCurrencyBR(consultant.balance)}
              </p>
            </div>
            <div style={styles.infoCard}>
              <h3 style={styles.cardTitle}>
                <i className="fa-solid fa-gear"></i> Configurações
              </h3>
              <div style={styles.infoGroup}>
                <label style={styles.infoLabel}>Status</label>
                {isEditing ? (
                  <select
                    name="status"
                    value={consultant.status}
                    onChange={handleInputChange}
                    style={styles.formSelect}
                  >
                    <option value={1}>Ativo</option>
                    <option value={0}>Inativo</option>
                  </select>
                ) : (
                  <p style={styles.infoValue}>
                    {consultant.status === 1 ? "Ativo" : "Inativo"}
                  </p>
                )}
              </div>
              <div style={styles.infoGroup}>
                <label style={styles.infoLabel}>Comissão (%)</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="commissionPercentage"
                    value={consultant.commissionPercentage || ""}
                    onChange={handleInputChange}
                    style={styles.formInput}
                  />
                ) : (
                  <p style={styles.infoValue}>
                    {consultant.commissionPercentage != null
                      ? `${consultant.commissionPercentage}%`
                      : "N/A"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddBalanceModal
        isOpen={isBalanceModalOpen}
        onClose={() => setIsBalanceModalOpen(false)}
        onSave={handleAddBalance}
      />
    </>
  );
}

export default ConsultantDetailPage;
