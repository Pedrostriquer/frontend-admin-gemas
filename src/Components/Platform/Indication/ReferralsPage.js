import React, { useState, useEffect, useCallback } from 'react';
import styles from './ReferralsPageStyle';
import { useAuth } from '../../../Context/AuthContext';
import clientServices from '../../../dbServices/clientServices';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

const ClientListItem = ({ client, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const itemStyle = { ...styles.clientResultItem, ...(isHovered && styles.clientResultItemHover) };
    return (
        <li style={itemStyle} onClick={() => onClick(client)} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <span style={styles.clientName}>{client.name}</span>
            <span style={styles.clientCpf}>{client.cpfCnpj}</span>
        </li>
    );
};

function ReferralsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [clientResults, setClientResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [referralValue, setReferralValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { token } = useAuth();
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (debouncedSearchTerm.length > 2) {
            const fetchClients = async () => {
                setIsSearching(true);
                try {
                    const response = await clientServices.getClients(token, debouncedSearchTerm, 1, 10);
                    setClientResults(response.items || []);
                } catch (error) {
                    console.error("Erro ao buscar clientes:", error);
                    setClientResults([]);
                } finally {
                    setIsSearching(false);
                }
            };
            fetchClients();
        } else {
            setClientResults([]);
        }
    }, [debouncedSearchTerm, token]);

    const handleSelectClient = (client) => {
        setSelectedClient(client);
        setSearchTerm('');
        setClientResults([]);
    };

    const handleConfirm = async () => {
        if (!referralValue || !selectedClient) return;

        setIsSubmitting(true);
        try {
            const amount = parseFloat(referralValue);
            await clientServices.addExtraBalance(token, selectedClient.id, amount, "Bônus de Indicação");
            alert(`Indicação de ${amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} adicionada para ${selectedClient.name} com sucesso!`);
            setSelectedClient(null);
            setReferralValue('');
        } catch (error) {
            alert("Ocorreu um erro ao adicionar a indicação. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.referralsPageContainer}>
            <header style={styles.referralsPageHeader}>
                <h1 style={styles.headerH1}>Indicação</h1>
                <p style={styles.headerP}>Adicione um valor de indicação para um cliente específico.</p>
            </header>

            <div style={styles.referralCard}>
                {!selectedClient ? (
                    <div>
                        <div style={styles.cardHeader}>
                            <i className="fa-solid fa-user-plus" style={styles.cardHeaderIcon}></i>
                            <h3 style={styles.cardHeaderH3}>Selecionar Cliente</h3>
                        </div>
                        <div style={styles.cardBody}>
                            <div style={styles.searchBox}>
                                <i className="fa-solid fa-magnifying-glass" style={styles.searchBoxIcon}></i>
                                <input
                                    type="text"
                                    placeholder="Pesquisar cliente por nome ou CPF..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    style={styles.searchInput}
                                />
                            </div>
                            {searchTerm.length > 0 && (
                                <ul style={styles.clientResultsList}>
                                    {isSearching ? (
                                        <li style={styles.noResults}>Buscando...</li>
                                    ) : clientResults.length > 0 ? (
                                        clientResults.map(client => (
                                            <ClientListItem key={client.id} client={client} onClick={handleSelectClient} />
                                        ))
                                    ) : debouncedSearchTerm.length > 2 ? (
                                        <li style={styles.noResults}>Nenhum cliente encontrado.</li>
                                    ) : null}
                                </ul>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>
                        <div style={styles.cardHeader}>
                            <i className="fa-solid fa-dollar-sign" style={styles.cardHeaderIcon}></i>
                            <h3 style={styles.cardHeaderH3}>Adicionar Valor</h3>
                        </div>
                        <div style={styles.cardBody}>
                            <div style={styles.selectedClientInfo}>
                                <div>
                                    <p style={styles.clientInfoTextP}>Cliente Selecionado:</p>
                                    <h4 style={styles.clientInfoTextH4}>{selectedClient.name}</h4>
                                </div>
                                <button style={styles.changeClientButton} onClick={() => setSelectedClient(null)}>Trocar Cliente</button>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>Valor da Indicação (R$)</label>
                                <input
                                    type="number"
                                    placeholder="0,00"
                                    value={referralValue}
                                    onChange={e => setReferralValue(e.target.value)}
                                    style={styles.formInput}
                                />
                            </div>
                        </div>
                        <div style={styles.cardFooter}>
                            <button 
                                style={{...styles.confirmButton, ...((!referralValue || isSubmitting) && styles.confirmButtonDisabled)}} 
                                onClick={handleConfirm} 
                                disabled={!referralValue || isSubmitting}
                            >
                                <i className="fa-solid fa-check"></i>
                                {isSubmitting ? 'Confirmando...' : 'Confirmar Adição'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReferralsPage;