import React, { useState, useMemo, useEffect } from 'react';
import './ClientsPage.css';

// --- Dados Estáticos (Expandidos com contratos por cliente) ---
const staticClients = [
    { 
        id: 1, name: 'Anderson Rodrigo de Jesus', cpf: '699.401.770-20', email: 'andersondejesus@hotmail.com', phone: '54991560961', investment: 4250.00, address: 'Rua Conde D\'Eu, 1620', city: 'Caxias do Sul', cep: '95076-090', consultant: 'Ana Silva', username: 'andersondejesus', bairro: 'São Virgílio', profissao: 'Investidor', reinvestimento: 'Desativado', balance: 150.00,
        contracts: [
            { id: 7505, value: 4250.00, status: 'Valorizando', endDate: '09/08/2028' },
        ] 
    },
    { 
        id: 2, name: 'Fabiano Baldasso', cpf: '000.000.000-00', email: 'costa@goldenmineracao.com', phone: '11999999999', investment: 400.50, address: 'Av. Paulista, 1000', city: 'São Paulo', cep: '01310-100', consultant: 'Carlos Souza', username: 'baldasso', bairro: 'Bela Vista', profissao: 'Jornalista', reinvestimento: 'Ativado', balance: 0.00,
        contracts: [
            { id: 7503, value: 400.50, status: 'Pendente', endDate: '07/08/2028' },
        ]
    },
    { 
        id: 3, name: 'Luciano da Rocha Berto', cpf: '000.075.916-47', email: 'lucianoberto@hotmail.com', phone: '51999817142', investment: 2550.00, address: 'Rua das Flores, 123', city: 'Porto Alegre', cep: '90010-000', consultant: 'Beatriz Lima', username: 'lberto', bairro: 'Centro', profissao: 'Empresário', reinvestimento: 'Ativado', balance: 500.75,
        contracts: [
            { id: 7497, value: 2550.00, status: 'Valorizando', endDate: '07/08/2028' },
        ]
    },
    // ... mais clientes
];

const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const ITEMS_PER_PAGE = 5;

// --- Componente do Modal de Detalhes (VERSÃO FINAL) ---
const ClientDetailModal = ({ client, onClose }) => {
    const [isEditing, setEditing] = useState(false);
    const [isAddingBalance, setAddingBalance] = useState(false);
    const [showContracts, setShowContracts] = useState(false);
    const [contractSearch, setContractSearch] = useState('');
    const [clientData, setClientData] = useState(client);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClientData(prev => ({ ...prev, [name]: value }));
    };

    const filteredContracts = client.contracts.filter(c => String(c.id).includes(contractSearch));

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content-large" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Detalhes do Cliente</h2>
                    <button className="login-as-client-button"><i className="fa-solid fa-right-to-bracket"></i>Logar com cliente</button>
                </div>
                <div className="modal-body">
                    <div className="detail-grid-v2">
                        <div className="detail-item-v2"><label>Nome</label><input type="text" name="name" value={clientData.name} onChange={handleInputChange} disabled={!isEditing} /></div>
                        <div className="detail-item-v2"><label>CPF</label><input type="text" name="cpf" value={clientData.cpf} onChange={handleInputChange} disabled={!isEditing} /></div>
                        <div className="detail-item-v2"><label>Username</label><input type="text" name="username" value={clientData.username} onChange={handleInputChange} disabled={!isEditing} /></div>
                        <div className="detail-item-v2"><label>Email</label><input type="email" name="email" value={clientData.email} onChange={handleInputChange} disabled={!isEditing} /></div>
                        <div className="detail-item-v2"><label>Endereço</label><input type="text" name="address" value={clientData.address} onChange={handleInputChange} disabled={!isEditing} /></div>
                        <div className="detail-item-v2"><label>Bairro</label><input type="text" name="bairro" value={clientData.bairro} onChange={handleInputChange} disabled={!isEditing} /></div>
                        <div className="detail-item-v2"><label>Cidade</label><input type="text" name="city" value={clientData.city} onChange={handleInputChange} disabled={!isEditing} /></div>
                        <div className="detail-item-v2"><label>CEP</label><input type="text" name="cep" value={clientData.cep} onChange={handleInputChange} disabled={!isEditing} /></div>
                        <div className="detail-item-v2"><label>Profissão</label><input type="text" name="profissao" value={clientData.profissao} onChange={handleInputChange} disabled={!isEditing} /></div>
                        <div className="detail-item-v2"><label>Telefone</label><input type="text" name="phone" value={clientData.phone} onChange={handleInputChange} disabled={!isEditing} /></div>
                        <div className="detail-item-v2"><label>Consultor</label><input type="text" name="consultant" value={clientData.consultant} onChange={handleInputChange} disabled={!isEditing} /></div>
                        <div className="detail-item-v2"><label>Reinvestimento</label>
                            <select name="reinvestimento" value={clientData.reinvestimento} onChange={handleInputChange} disabled={!isEditing}>
                                <option>Ativado</option>
                                <option>Desativado</option>
                            </select>
                        </div>
                    </div>

                    <div className={`contracts-section ${showContracts ? 'open' : ''}`}>
                        <div className="contracts-section-header" onClick={() => setShowContracts(!showContracts)}>
                            <div className="header-info">
                                <i className="fa-solid fa-file-signature"></i>
                                <h4>Contratos ({client.contracts.length})</h4>
                            </div>
                            <i className={`fa-solid fa-chevron-down toggle-arrow`}></i>
                        </div>
                        <div className="contracts-list-container">
                            <div className="contract-list-search">
                                <i className="fa-solid fa-magnifying-glass"></i>
                                <input type="text" placeholder="Pesquisar por ID do contrato..." onChange={e => setContractSearch(e.target.value)} />
                            </div>
                            <ul className="contract-list">
                                {filteredContracts.map(contract => (
                                    <li key={contract.id}>
                                        <span>ID: #{contract.id}</span>
                                        <span>Valor: {formatCurrency(contract.value)}</span>
                                        <span>Status: {contract.status}</span>
                                        <span>Finaliza em: {contract.endDate}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="balance-section">
                        <div className="balance-info">
                            <div className="detail-item-v2"><label>Saldo do Cliente</label><p className="balance-value">{formatCurrency(clientData.balance)}</p></div>
                            <button className="add-balance-button" onClick={() => setAddingBalance(!isAddingBalance)}><i className={`fa-solid ${isAddingBalance ? 'fa-xmark' : 'fa-plus'}`}></i> {isAddingBalance ? 'Cancelar' : 'Adicionar Saldo'}</button>
                        </div>
                        <div className={`add-balance-form ${isAddingBalance ? 'open' : ''}`}>
                            <input type="number" placeholder="Valor (R$)" /><input type="text" placeholder="Descrição (Ex: Aporte inicial)" /><button>Confirmar</button>
                        </div>
                    </div>
                </div>
                 <div className="modal-footer">
                    {isEditing ? (
                        <>
                            <button className="modal-action-button cancel" onClick={() => { setEditing(false); setClientData(client); }}>Cancelar</button>
                            <button className="modal-action-button save" onClick={() => setEditing(false)}><i className="fa-solid fa-check"></i> Salvar</button>
                        </>
                    ) : (
                        <button className="modal-action-button primary" onClick={() => setEditing(true)}><i className="fa-solid fa-pencil"></i> Editar</button>
                    )}
                    <button className="modal-close-button" onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>
    );
};


// --- Componente Principal da Página ---
function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);

  const sortedAndFilteredClients = useMemo(() => {
    const filtered = staticClients.filter(client => client.name.toLowerCase().includes(searchTerm.toLowerCase()) || client.cpf.includes(searchTerm));
    return filtered.sort((a, b) => { if (sortOrder === 'asc') return a.investment - b.investment; return b.investment - a.investment; });
  }, [searchTerm, sortOrder]);

  const totalPages = Math.ceil(sortedAndFilteredClients.length / ITEMS_PER_PAGE);
  const paginatedClients = sortedAndFilteredClients.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalInvestment = useMemo(() => staticClients.reduce((acc, client) => acc + client.investment, 0), []);
  const averageTicket = totalInvestment / staticClients.length;

  return (
    <div className="clients-page-container">
      <header className="clients-page-header"><h1>Clientes</h1></header>
      <section className="client-kpi-cards">
        <div className="client-kpi-card"><i className="fa-solid fa-users"></i><div><h4>Total de Clientes</h4><p className="kpi-main-value">{staticClients.length}</p></div></div>
        <div className="client-kpi-card"><i className="fa-solid fa-hand-holding-dollar"></i><div><h4>Ticket Médio</h4><p className="kpi-main-value">{formatCurrency(averageTicket)}</p></div></div>
      </section>
      <div className="table-controls-header">
        <div className="search-box"><i className="fa-solid fa-magnifying-glass"></i><input type="text" placeholder="Buscar por nome ou CPF..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        <div className="actions-group">
            <div className="filter-box"><select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}><option value="desc">Maior Investimento</option><option value="asc">Menor Investimento</option></select></div>
            <button className="add-client-button"><i className="fa-solid fa-plus"></i> Adicionar Cliente</button>
        </div>
      </div>
      <div className="clients-table-card">
        <table className="clients-table">
          <thead><tr><th>Nome</th><th>CPF/CNPJ</th><th>Email</th><th>Celular</th><th>Total Investido</th></tr></thead>
          <tbody>{paginatedClients.map(client => (<tr key={client.id} onClick={() => setSelectedClient(client)}><td>{client.name}</td><td>{client.cpf}</td><td><div className="email-cell">{client.email}</div></td><td>{client.phone}</td><td>{formatCurrency(client.investment)}</td></tr>))}</tbody>
        </table>
        <div className="pagination-container">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Anterior</button>
            <span>Página {currentPage} de {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Próxima</button>
        </div>
      </div>
      {selectedClient && <ClientDetailModal client={selectedClient} onClose={() => setSelectedClient(null)} />}
    </div>
  );
}

export default ClientsPage;