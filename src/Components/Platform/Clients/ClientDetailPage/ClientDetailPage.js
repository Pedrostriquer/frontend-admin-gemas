import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ClientDetailPageStyle";
import { useAuth } from "../../../../Context/AuthContext";
import clientServices from "../../../../dbServices/clientServices";
import contractServices from "../../../../dbServices/contractServices";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import AddBalanceModal from "./AddBalanceModal/AddBalanceModal";
import ChangePasswordModal from "./ChangePasswordModal/ChangePasswordModal";
import AssociateConsultantModal from "./AssociateConsultantModal/AssociateConsultantModal";
import ImageWithLoader from "../../ImageWithLoader/ImageWithLoader";
import { useLoad } from "../../../../Context/LoadContext";

const formatCurrency = (value) =>
  (value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const formatDate = (dateString) =>
  dateString ? new Date(dateString).toLocaleDateString("pt-BR") : "N/A";
const chartData = [
  { v: 10 },
  { v: 25 },
  { v: 20 },
  { v: 40 },
  { v: 35 },
  { v: 60 },
  { v: 70 },
];

// MUDANÇA: Usando o mesmo mapeamento de status da sua ContractsPage para consistência
const statusMap = {
  1: "Pendente",
  2: "Valorizando",
  3: "Cancelado",
  4: "Finalizado",
  5: "Recomprado",
};
const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 2: // Valorizando
      return styles.statusActive; // Mapeando para o estilo 'Active'
    case 4: // Finalizado
      return styles.statusFinished;
    case 3: // Cancelado
      return styles.statusCancelled;
    case 1: // Pendente e outros
    default:
      return styles.statusDefault;
  }
};

const CONTRACTS_PER_PAGE = 3;

function ClientDetailPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableClient, setEditableClient] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [allContracts, setAllContracts] = useState([]);
  const [contractsLoading, setContractsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { startLoading, stopLoading } = useLoad();

  const fetchClientData = useCallback(async () => {
    if (!token || !clientId) return;
    setIsLoading(true);
    setContractsLoading(true);
    startLoading();
    try {
      const data = await clientServices.getById(token, clientId);
      setClient(data);
      setEditableClient(data);

      const contractsData = await contractServices.obterContratosDoCliente(
        token,
        clientId
      );
      setAllContracts(contractsData || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setAllContracts([]);
    } finally {
      setIsLoading(false);
      setContractsLoading(false);
      stopLoading();
    }
  }, [token, clientId]);

  useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);

  const totalPages = Math.ceil(allContracts.length / CONTRACTS_PER_PAGE);
  const startIndex = (currentPage - 1) * CONTRACTS_PER_PAGE;
  const endIndex = startIndex + CONTRACTS_PER_PAGE;
  const paginatedContracts = allContracts.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleLoginAsClient = async () => {
    try {
      const authResponse = await clientServices.loginAsClient(token, clientId);
      const clientToken = authResponse.token;
      const clientPlatformUrl = `http://gemas.demelloagent.app/login?token=${clientToken}`;
      window.open(clientPlatformUrl, "_blank");
    } catch (error) {
      alert("Não foi possível logar como cliente. Tente novamente.");
    }
  };
  const handleAddBalance = async ({ amount }) => {
    try {
      startLoading();
      await clientServices.addExtraBalance(token, clientId, amount);
      alert("Saldo adicionado com sucesso!");
      setIsBalanceModalOpen(false);
      fetchClientData();
    } catch (error) {
      alert(`Erro: ${error.message || "Não foi possível adicionar o saldo."}`);
    } finally {
      stopLoading();
    }
  };
  const handleChangePassword = async ({ password }) => {
    try {
      startLoading();
      await clientServices.changePasswordByAdmin(token, clientId, password);
      alert("Senha alterada com sucesso!");
      setIsPasswordModalOpen(false);
    } catch (error) {
      alert(`Erro: ${error.message || "Não foi possível alterar a senha."}`);
    } finally {
      stopLoading();
    }
  };
  const handleAssociateConsultant = async (consultantId) => {
    try {
      startLoading();
      await clientServices.associateConsultant(token, clientId, consultantId);
      setIsAssociateModalOpen(false);
      await fetchClientData();
    } catch (error) {
      alert("Falha ao associar consultor.");
    } finally {
      stopLoading();
    }
  };
  const handleRemoveConsultant = async () => {
    if (
      window.confirm(
        `Tem certeza que deseja remover o consultor ${client.consultantName} deste cliente?`
      )
    ) {
      startLoading();
      try {
        await clientServices.removeConsultant(token, clientId);
        await fetchClientData();
      } catch (error) {
        alert("Falha ao remover consultor.");
      } finally {
        stopLoading();
      }
    }
  };
  const handleRemoveProfilePicture = async () => {
    if (
      window.confirm(
        "Tem certeza que deseja remover a foto de perfil deste cliente?"
      )
    ) {
      try {
        startLoading();
        await clientServices.deleteProfilePicture(clientId, token);
        alert("Foto de perfil removida com sucesso.");
        fetchClientData();
      } catch (error) {
        alert("Não foi possível remover a foto de perfil.");
      } finally {
        stopLoading();
      }
    }
  };
  const handleEditToggle = () => {
    if (!isEditing) {
      setEditableClient({ ...client });
    }
    setIsEditing(!isEditing);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableClient((prev) => ({ ...prev, [name]: value }));
  };
  const handleSaveChanges = async () => {
    setIsSaving(true);
    const updates = [];
    if (editableClient.name !== client.name) {
      updates.push({ FieldName: "Name", FieldNewValue: editableClient.name });
    }
    if (editableClient.email !== client.email) {
      updates.push({ FieldName: "Email", FieldNewValue: editableClient.email });
    }
    if (editableClient.phoneNumber !== client.phoneNumber) {
      updates.push({
        FieldName: "PhoneNumber",
        FieldNewValue: editableClient.phoneNumber,
      });
    }
    if (editableClient.jobTitle !== client.jobTitle) {
      updates.push({
        FieldName: "JobTitle",
        FieldNewValue: editableClient.jobTitle,
      });
    }
    if (updates.length === 0) {
      setIsEditing(false);
      setIsSaving(false);
      return;
    }
    try {
      startLoading();
      await clientServices.updateClientPartial(clientId, updates, token);
      alert("Cliente atualizado com sucesso!");
      setIsEditing(false);
      await fetchClientData();
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      alert(
        "Falha ao atualizar o cliente. Verifique os dados e tente novamente."
      );
    } finally {
      setIsSaving(false);
      stopLoading();
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>Carregando perfil do cliente...</div>
    );
  }
  if (!client) {
    return <div style={styles.loadingContainer}>Cliente não encontrado.</div>;
  }

  const personalInfoContent = isEditing ? (
    <>
      <div style={styles.infoGrid}>
        <input
          name="name"
          value={editableClient.name || ""}
          onChange={handleInputChange}
          style={styles.inputField}
        />
        <input
          name="email"
          type="email"
          value={editableClient.email || ""}
          onChange={handleInputChange}
          style={styles.inputField}
        />
        <p style={{ ...styles.infoValue, color: "#9ca3af" }}>
          {client.cpfCnpj} (não editável)
        </p>
        <input
          name="phoneNumber"
          value={editableClient.phoneNumber || ""}
          onChange={handleInputChange}
          style={styles.inputField}
        />
        <p style={{ ...styles.infoValue, color: "#9ca3af" }}>
          {formatDate(client.birthDate)} (não editável)
        </p>
        <input
          name="jobTitle"
          value={editableClient.jobTitle || ""}
          onChange={handleInputChange}
          style={styles.inputField}
        />
      </div>
      <div style={styles.editActions}>
        <button
          onClick={handleEditToggle}
          style={styles.cancelButton}
          disabled={isSaving}
        >
          Cancelar
        </button>
        <button
          onClick={handleSaveChanges}
          style={styles.saveButton}
          disabled={isSaving}
        >
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </>
  ) : (
    <div style={styles.infoGrid}>
      <div>
        <span style={styles.infoLabel}>CPF/CNPJ</span>
        <p style={styles.infoValue}>{client.cpfCnpj}</p>
      </div>
      <div>
        <span style={styles.infoLabel}>Telefone</span>
        <p style={styles.infoValue}>{client.phoneNumber}</p>
      </div>
      <div>
        <span style={styles.infoLabel}>Data de Nasc.</span>
        <p style={styles.infoValue}>{formatDate(client.birthDate)}</p>
      </div>
      <div>
        <span style={styles.infoLabel}>Profissão</span>
        <p style={styles.infoValue}>{client.jobTitle || "Não informado"}</p>
      </div>
    </div>
  );

  return (
    <>
      <div style={styles.pageContainer}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerInfo}>
            <button
              onClick={() => navigate("/platform/clients")}
              style={styles.backButton}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <div style={styles.avatarContainer}>
              <div style={styles.avatar}>
                {client.profilePictureUrl ? (
                  <ImageWithLoader
                    src={client.profilePictureUrl}
                    alt={client.name}
                    style={styles.avatarImage}
                  />
                ) : (
                  client.name.charAt(0)
                )}
              </div>
              {client.profilePictureUrl && (
                <button
                  onClick={handleRemoveProfilePicture}
                  style={styles.removePhotoButton}
                  title="Remover foto"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              )}
            </div>
            <div>
              <h1 style={styles.clientName}>{client.name}</h1>
              <p style={styles.clientEmail}>{client.email}</p>
            </div>
          </div>
          <div style={styles.headerActions}>
            <button
              onClick={() => setIsBalanceModalOpen(true)}
              style={styles.actionButton}
            >
              <i className="fa-solid fa-plus"></i> Adicionar Saldo
            </button>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              style={styles.actionButton}
            >
              <i className="fa-solid fa-key"></i> Alterar Senha
            </button>
            <button
              onClick={handleLoginAsClient}
              style={{ ...styles.actionButton, ...styles.loginButton }}
            >
              <i className="fa-solid fa-right-to-bracket"></i> Logar como
              Cliente
            </button>
          </div>
        </div>
        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <i className="fa-solid fa-sack-dollar"></i>
            </div>
            <div>
              <p style={styles.statLabel}>Saldo em Conta</p>
              <p style={styles.statValue}>{formatCurrency(client.balance)}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <i className="fa-solid fa-file-invoice-dollar"></i>
            </div>
            <div>
              <p style={styles.statLabel}>Total Investido</p>
              <p style={styles.statValue}>-</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <div>
              <p style={styles.statLabel}>Rendimento Total</p>
              <p style={styles.statValue}>-</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#grad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.contentGrid}>
          {/* Card de Informações Pessoais */}
          <div
            style={
              isEditing
                ? { ...styles.card, ...styles.cardEditing }
                : styles.card
            }
          >
            <div style={styles.cardTitleContainer}>
              <h3 style={styles.cardTitle}>Informações Pessoais</h3>
              {!isEditing && (
                <button
                  onClick={handleEditToggle}
                  style={styles.editButton}
                  title="Editar Informações"
                >
                  <i className="fa-solid fa-pencil"></i> Editar
                </button>
              )}
            </div>
            {personalInfoContent}
          </div>
          {/* Card de Consultor */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Consultor Associado</h3>
            {client.consultantId ? (
              <div
                style={{
                  ...styles.infoGrid,
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                }}
              >
                <div>
                  <span style={styles.infoLabel}>Nome</span>
                  <p style={styles.infoValue}>{client.consultantName}</p>
                </div>
                <button
                  onClick={handleRemoveConsultant}
                  style={{
                    ...styles.actionButton,
                    backgroundColor: "#fee2e2",
                    color: "#ef4444",
                  }}
                >
                  Remover
                </button>
              </div>
            ) : (
              <div
                style={{
                  ...styles.infoGrid,
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                }}
              >
                <div>
                  <span style={styles.infoLabel}>Status</span>
                  <p style={styles.infoValue}>Nenhum consultor associado</p>
                </div>
                <button
                  onClick={() => setIsAssociateModalOpen(true)}
                  style={{
                    ...styles.actionButton,
                    backgroundColor: "#dbeafe",
                    color: "#3b82f6",
                  }}
                >
                  Associar
                </button>
              </div>
            )}
          </div>

          {/* Card de Contratos com Paginação */}
          <div style={{ ...styles.card, gridColumn: "1 / -1" }}>
            <div style={styles.cardTitleContainer}>
              <h3 style={styles.cardTitle}>Contratos Recentes</h3>
              {totalPages > 1 && (
                <div style={styles.paginationControls}>
                  <span style={styles.pageInfo}>
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    style={styles.paginationButton}
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    style={styles.paginationButton}
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>
            <div style={styles.contractsListContainer}>
              {contractsLoading ? (
                <p style={styles.loadingText}>Carregando contratos...</p>
              ) : paginatedContracts.length > 0 ? (
                paginatedContracts.map((contract) => (
                  <button
                    key={contract.id}
                    style={styles.contractItemButton}
                    onClick={() =>
                      navigate(`/platform/contracts/${contract.id}`)
                    }
                  >
                    <div style={styles.contractItem}>
                      <div style={styles.contractHeader}>
                        <span style={styles.contractId}>
                          Contrato #{contract.id}
                        </span>
                        <span
                          style={{
                            ...styles.contractStatus,
                            ...getStatusBadgeStyle(contract.status),
                          }}
                        >
                          {statusMap[contract.status] || "Desconhecido"}
                        </span>
                      </div>
                      <div style={styles.contractBody}>
                        {/* MUDANÇA AQUI: Usando os nomes corretos dos campos */}
                        <div style={styles.contractInfo}>
                          <span style={styles.contractInfoLabel}>
                            Valor Investido
                          </span>
                          <span style={styles.contractInfoValue}>
                            {formatCurrency(contract.amount)}
                          </span>
                        </div>
                        <div style={styles.contractInfo}>
                          <span style={styles.contractInfoLabel}>
                            Rentabilidade Acumulada
                          </span>
                          <span style={styles.contractInfoValue}>
                            {formatCurrency(contract.currentIncome)}
                          </span>
                        </div>
                        <div style={styles.contractInfo}>
                          <span style={styles.contractInfoLabel}>
                            Data de Criação
                          </span>
                          <span style={styles.contractInfoValue}>
                            {formatDate(contract.dateCreated)}
                          </span>
                        </div>
                        <div style={styles.contractInfo}>
                          <span style={styles.contractInfoLabel}>
                            Finaliza em
                          </span>
                          <span style={styles.contractInfoValue}>
                            {formatDate(contract.endContractDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <p style={styles.loadingText}>
                  Nenhum contrato encontrado para este cliente.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isBalanceModalOpen && (
        <AddBalanceModal
          client={client}
          onClose={() => setIsBalanceModalOpen(false)}
          onSave={handleAddBalance}
        />
      )}
      {isPasswordModalOpen && (
        <ChangePasswordModal
          client={client}
          onClose={() => setIsPasswordModalOpen(false)}
          onSave={handleChangePassword}
        />
      )}
      <AssociateConsultantModal
        isOpen={isAssociateModalOpen}
        onClose={() => setIsAssociateModalOpen(false)}
        onAssociate={handleAssociateConsultant}
      />
    </>
  );
}

export default ClientDetailPage;
