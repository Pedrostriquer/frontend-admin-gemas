import React, { useState, useMemo } from 'react';
import './ReferralsPage.css';

// --- Dados Estáticos ---
const staticClients = [
    { id: 1, name: 'Andrei Ferreira', cpf: '090.068.089-05' },
    { id: 2, name: 'Eduardo Lopes Cardoso', cpf: '046.690.486-00' },
    { id: 3, name: 'Golden Treinamento', cpf: '612.096.820-55' },
    { id: 4, name: 'Samara Mahmud', cpf: '045.486.083-83' },
    { id: 5, name: 'Luciano da Rocha Berto', cpf: '000.075.916-47' },
    { id: 6, name: 'Priscila Lopes', cpf: '022.482.190-32' },
];

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
        setSearchTerm(''); // Limpa a busca após selecionar
    };

    const handleConfirm = () => {
        // Lógica para adicionar o valor da indicação
        alert(`Indicação de R$ ${referralValue} adicionada para ${selectedClient.name}`);
        // Resetar o estado
        setSelectedClient(null);
        setReferralValue('');
    };

    return (
        <div className="referrals-page-container">
            <header className="referrals-page-header">
                <h1>Indicação</h1>
                <p>Adicione um valor de indicação para um cliente específico.</p>
            </header>

            <div className="referral-card">
                {!selectedClient ? (
                    // Passo 1: Pesquisar Cliente
                    <div className="search-step">
                        <div className="card-header-ref">
                            <i className="fa-solid fa-user-plus"></i>
                            <h3>Selecionar Cliente</h3>
                        </div>
                        <div className="card-body-ref">
                            <div className="search-box-ref">
                                <i className="fa-solid fa-magnifying-glass"></i>
                                <input
                                    type="text"
                                    placeholder="Pesquisar cliente por nome ou CPF..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {searchTerm && (
                                <ul className="client-results-list">
                                    {filteredClients.length > 0 ? (
                                        filteredClients.map(client => (
                                            <li key={client.id} onClick={() => handleSelectClient(client)}>
                                                <span className="client-name">{client.name}</span>
                                                <span className="client-cpf">{client.cpf}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="no-results">Nenhum cliente encontrado.</li>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                ) : (
                    // Passo 2: Adicionar Valor
                    <div className="value-step">
                        <div className="card-header-ref">
                            <i className="fa-solid fa-dollar-sign"></i>
                            <h3>Adicionar Valor</h3>
                        </div>
                        <div className="card-body-ref">
                            <div className="selected-client-info">
                                <div className="client-info-text">
                                    <p>Cliente Selecionado:</p>
                                    <h4>{selectedClient.name}</h4>
                                </div>
                                <button onClick={() => setSelectedClient(null)}>Trocar Cliente</button>
                            </div>
                            <div className="form-group-ref">
                                <label>Valor da Indicação (R$)</label>
                                <input
                                    type="number"
                                    placeholder="0,00"
                                    value={referralValue}
                                    onChange={e => setReferralValue(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="card-footer-ref">
                            <button className="confirm-button-ref" onClick={handleConfirm} disabled={!referralValue}>
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