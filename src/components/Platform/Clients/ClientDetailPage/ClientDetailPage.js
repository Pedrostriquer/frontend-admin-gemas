import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ClientDetailPageStyle';
import { useAuth } from '../../../../Context/AuthContext';
import clientServices from '../../../../dbServices/clientServices';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import AddBalanceModal from './AddBalanceModal/AddBalanceModal';
import ChangePasswordModal from './ChangePasswordModal/ChangePasswordModal';
import AssociateConsultantModal from './AssociateConsultantModal/AssociateConsultantModal';

const formatCurrency = (value) => (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('pt-BR') : 'N/A';
const chartData = [{v:10},{v:25},{v:20},{v:40},{v:35},{v:60},{v:70}];

function ClientDetailPage() {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [client, setClient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);

    const fetchClientData = useCallback(async () => {
        if (!token || !clientId) return;
        setIsLoading(true);
        try {
            const data = await clientServices.getById(token, clientId);
            setClient(data);
        } catch (error) {
            console.error("Erro ao buscar dados do cliente:", error);
        } finally {
            setIsLoading(false);
        }
    }, [token, clientId]);

    useEffect(() => {
        fetchClientData();
    }, [fetchClientData]);

    const handleLoginAsClient = async () => {
        try {
            const authResponse = await clientServices.loginAsClient(token, clientId);
            const clientToken = authResponse.token;
            const clientPlatformUrl = `http://gemas.demelloagent.app/login?token=${clientToken}`; 
            window.open(clientPlatformUrl, '_blank');
        } catch (error) {
            alert('Não foi possível logar como cliente. Tente novamente.');
        }
    };

    const handleAddBalance = async ({ amount }) => {
        try {
            await clientServices.addExtraBalance(token, clientId, amount);
            alert('Saldo adicionado com sucesso!');
            setIsBalanceModalOpen(false);
            fetchClientData();
        } catch (error) {
            alert(`Erro: ${error.message || 'Não foi possível adicionar o saldo.'}`);
        }
    };

    const handleChangePassword = async ({ password }) => {
        try {
            await clientServices.changePasswordByAdmin(token, clientId, password);
            alert('Senha alterada com sucesso!');
            setIsPasswordModalOpen(false);
        } catch (error) {
            alert(`Erro: ${error.message || 'Não foi possível alterar a senha.'}`);
        }
    };

    const handleAssociateConsultant = async (consultantId) => {
        try {
            await clientServices.associateConsultant(token, clientId, consultantId);
            setIsAssociateModalOpen(false);
            await fetchClientData();
        } catch (error) {
            alert('Falha ao associar consultor.');
        }
    };

    const handleRemoveConsultant = async () => {
        if (window.confirm(`Tem certeza que deseja remover o consultor ${client.consultantName} deste cliente?`)) {
            try {
                await clientServices.removeConsultant(token, clientId);
                await fetchClientData();
            } catch (error) {
                alert('Falha ao remover consultor.');
            }
        }
    };
    
    if (isLoading) {
        return <div style={styles.loadingContainer}>Carregando perfil do cliente...</div>;
    }

    if (!client) {
        return <div style={styles.loadingContainer}>Cliente não encontrado.</div>;
    }

    const fullAddress = client.address 
        ? `${client.address.street}, ${client.address.number} - ${client.address.neighborhood}, ${client.address.city} - ${client.address.state}, ${client.address.zipcode}`
        : 'Endereço não cadastrado';
    
    return (
        <>
            <div style={styles.pageContainer}>
                <div style={styles.header}>
                    <div style={styles.headerInfo}>
                        <button onClick={() => navigate('/platform/clients')} style={styles.backButton}><i className="fa-solid fa-arrow-left"></i></button>
                        <div style={styles.avatar}>{client.name.charAt(0)}</div>
                        <div>
                            <h1 style={styles.clientName}>{client.name}</h1>
                            <p style={styles.clientEmail}>{client.email}</p>
                        </div>
                    </div>
                    <div style={styles.headerActions}>
                        <button onClick={() => setIsBalanceModalOpen(true)} style={styles.actionButton}><i className="fa-solid fa-plus"></i> Adicionar Saldo</button>
                        <button onClick={() => setIsPasswordModalOpen(true)} style={styles.actionButton}><i className="fa-solid fa-key"></i> Alterar Senha</button>
                        <button onClick={handleLoginAsClient} style={{...styles.actionButton, ...styles.loginButton}}><i className="fa-solid fa-right-to-bracket"></i> Logar como Cliente</button>
                    </div>
                </div>

                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}><i className="fa-solid fa-sack-dollar"></i></div>
                        <div>
                            <p style={styles.statLabel}>Saldo em Conta</p>
                            <p style={styles.statValue}>{formatCurrency(client.balance)}</p>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}><i className="fa-solid fa-file-invoice-dollar"></i></div>
                        <div>
                            <p style={styles.statLabel}>Total Investido</p>
                            <p style={styles.statValue}>-</p>
                        </div>
                    </div>
                     <div style={styles.statCard}>
                        <div style={styles.statIcon}><i className="fa-solid fa-chart-line"></i></div>
                        <div>
                            <p style={styles.statLabel}>Rendimento Total</p>
                            <p style={styles.statValue}>-</p>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                         <ResponsiveContainer width="100%" height={60}>
                            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                              <defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                              <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} fill="url(#grad)" />
                            </AreaChart>
                          </ResponsiveContainer>
                    </div>
                </div>

                <div style={styles.contentGrid}>
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Informações Pessoais</h3>
                        <div style={styles.infoGrid}>
                            <div><span style={styles.infoLabel}>CPF/CNPJ</span><p style={styles.infoValue}>{client.cpfCnpj}</p></div>
                            <div><span style={styles.infoLabel}>Telefone</span><p style={styles.infoValue}>{client.phoneNumber}</p></div>
                            <div><span style={styles.infoLabel}>Data de Nasc.</span><p style={styles.infoValue}>{formatDate(client.birthDate)}</p></div>
                            <div><span style={styles.infoLabel}>Profissão</span><p style={styles.infoValue}>{client.jobTitle || 'Não informado'}</p></div>
                        </div>
                    </div>
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Consultor Associado</h3>
                        {client.consultantId ? (
                            <div style={{...styles.infoGrid, gridTemplateColumns: '1fr auto', alignItems: 'center'}}>
                                <div><span style={styles.infoLabel}>Nome</span><p style={styles.infoValue}>{client.consultantName}</p></div>
                                <button onClick={handleRemoveConsultant} style={{...styles.actionButton, backgroundColor: '#fee2e2', color: '#ef4444'}}>Remover</button>
                            </div>
                        ) : (
                             <div style={{...styles.infoGrid, gridTemplateColumns: '1fr auto', alignItems: 'center'}}>
                                <div><span style={styles.infoLabel}>Status</span><p style={styles.infoValue}>Nenhum consultor associado</p></div>
                                <button onClick={() => setIsAssociateModalOpen(true)} style={{...styles.actionButton, backgroundColor: '#dbeafe', color: '#3b82f6'}}>Associar</button>
                            </div>
                        )}
                    </div>
                    <div style={{...styles.card, gridColumn: '1 / -1'}}>
                        <h3 style={styles.cardTitle}>Contratos Recentes</h3>
                    </div>
                </div>
            </div>

            {isBalanceModalOpen && <AddBalanceModal client={client} onClose={() => setIsBalanceModalOpen(false)} onSave={handleAddBalance} />}
            {isPasswordModalOpen && <ChangePasswordModal client={client} onClose={() => setIsPasswordModalOpen(false)} onSave={handleChangePassword} />}
            <AssociateConsultantModal isOpen={isAssociateModalOpen} onClose={() => setIsAssociateModalOpen(false)} onAssociate={handleAssociateConsultant} />
        </>
    );
}

export default ClientDetailPage;