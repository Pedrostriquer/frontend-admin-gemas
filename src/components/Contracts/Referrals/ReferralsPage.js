import React, { useState, useMemo } from 'react';
import styles from './ReferralsPage.styles.js';

// --- Dados Estáticos ---
const staticClients = [
    { id: 1, name: 'Andrei Ferreira', cpf: '090.068.089-05' },
    { id: 2, name: 'Eduardo Lopes Cardoso', cpf: '046.690.486-00' },
    { id: 3, name: 'Golden Treinamento', cpf: '612.096.820-55' },
    { id: 4, name: 'Samara Mahmud', cpf: '045.486.083-83' },
    { id: 5, name: 'Luciano da Rocha Berto', cpf: '000.075.916-47' },
    { id: 6, name: 'Priscila Lopes', cpf: '022.482.190-32' },
];

// --- Componente de Item da Lista (para controlar hover) ---
const ClientListItem = ({ client, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const itemStyle = {
        ...styles.clientResultItem,
        ...(isHovered && styles.clientResultItemHover)
    };
    return (
        <li 
            style={itemStyle} 
            onClick={() => onClick(client)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span style={styles.clientName}>{client.name}</span>
            <span style={styles.clientCpf}>{client.cpf}</span>
        </li>
    );
};

// --- Componente Principal da Página ---
function ReferralsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [referralValue, setReferralValue] = useState('');

    const filteredClients = useMemo(() => {
        if (!searchTerm) return [];
        return staticClients.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.cpf.includes(searchTerm)
        );
    }, [searchTerm]);

    const handleSelectClient = (client) => {
        setSelectedClient(client);
        setSearchTerm('');
    };

    const handleConfirm = () => {
        alert(`Indicação de R$ ${referralValue} adicionada para ${selectedClient.name}`);
        setSelectedClient(null);
        setReferralValue('');
    };

    return (
        <div style={styles.referralsPageContainer}>
            <header style={styles.referralsPageHeader}>
                <h1 style={styles.headerH1}>Indicação</h1>
                <p style={styles.headerP}>Adicione um valor de indicação para um cliente específico.</p>
            </header>

            <div style={styles.referralCard}>
                {!selectedClient ? (
                    // Passo 1: Pesquisar Cliente
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
                            {searchTerm && (
                                <ul style={styles.clientResultsList}>
                                    {filteredClients.length > 0 ? (
                                        filteredClients.map(client => (
                                            <ClientListItem key={client.id} client={client} onClick={handleSelectClient} />
                                        ))
                                    ) : (
                                        <li style={styles.noResults}>Nenhum cliente encontrado.</li>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                ) : (
                    // Passo 2: Adicionar Valor
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
                                style={{...styles.confirmButton, ...(!referralValue && styles.confirmButtonDisabled)}} 
                                onClick={handleConfirm} 
                                disabled={!referralValue}
                            >
                                <i className="fa-solid fa-check"></i>
                                Confirmar Adição
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReferralsPage;