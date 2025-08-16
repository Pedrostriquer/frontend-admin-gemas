import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import styles from './ClientsPageStyle';

// --- Dados Estáticos ---
const staticClients = [
    { id: 1, name: 'Anderson Rodrigo de Jesus', cpf: '699.401.770-20', email: 'andersondejesus@hotmail.com', phone: '54991560961', investment: 4250.00, address: 'Rua Conde D\'Eu, 1620', city: 'Caxias do Sul', cep: '95076-090', consultant: 'Ana Silva', username: 'andersondejesus', bairro: 'São Virgílio', profissao: 'Investidor', reinvestimento: 'Desativado', balance: 150.00, contracts: [{ id: 7505, value: 4250.00, status: 'Valorizando', endDate: '09/08/2028' }] },
    { id: 2, name: 'Fabiano Baldasso', cpf: '000.000.000-00', email: 'costa@goldenmineracao.com', phone: '11999999999', investment: 400.50, address: 'Av. Paulista, 1000', city: 'São Paulo', cep: '01310-100', consultant: 'Carlos Souza', username: 'baldasso', bairro: 'Bela Vista', profissao: 'Jornalista', reinvestimento: 'Ativado', balance: 0.00, contracts: [{ id: 7503, value: 400.50, status: 'Pendente', endDate: '07/08/2028' }] },
    { id: 3, name: 'Luciano da Rocha Berto', cpf: '000.075.916-47', email: 'lucianoberto@hotmail.com', phone: '51999817142', investment: 2550.00, address: 'Rua das Flores, 123', city: 'Porto Alegre', cep: '90010-000', consultant: 'Beatriz Lima', username: 'lberto', bairro: 'Centro', profissao: 'Empresário', reinvestimento: 'Ativado', balance: 500.75, contracts: [{ id: 7497, value: 2550.00, status: 'Valorizando', endDate: '07/08/2028' }] },
];

const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const ITEMS_PER_PAGE = 5;

// --- Estilos Globais para Animações ---
const GlobalStyles = () => (
    <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    `}</style>
);

// --- Componente do Modal de Detalhes ---
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

    return ReactDOM.createPortal(
        <div style={styles.modalBackdrop} onClick={onClose}>
            <GlobalStyles />
            <div style={styles.modalContentLarge} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <h2 style={styles.modalHeaderH2}>Detalhes do Cliente</h2>
                    <button style={styles.loginAsClientButton}><i className="fa-solid fa-right-to-bracket"></i>Logar com cliente</button>
                </div>
                <div>
                    <div style={styles.detailGridV2}>
                        <div><label style={styles.detailItemV2Label}>Nome</label><input type="text" name="name" value={clientData.name} onChange={handleInputChange} disabled={!isEditing} style={{...styles.detailItemV2Input, ...(!isEditing && styles.detailItemV2InputDisabled)}} /></div>
                        <div><label style={styles.detailItemV2Label}>CPF</label><input type="text" name="cpf" value={clientData.cpf} onChange={handleInputChange} disabled={!isEditing} style={{...styles.detailItemV2Input, ...(!isEditing && styles.detailItemV2InputDisabled)}} /></div>
                        <div><label style={styles.detailItemV2Label}>Username</label><input type="text" name="username" value={clientData.username} onChange={handleInputChange} disabled={!isEditing} style={{...styles.detailItemV2Input, ...(!isEditing && styles.detailItemV2InputDisabled)}} /></div>
                        <div><label style={styles.detailItemV2Label}>Email</label><input type="email" name="email" value={clientData.email} onChange={handleInputChange} disabled={!isEditing} style={{...styles.detailItemV2Input, ...(!isEditing && styles.detailItemV2InputDisabled)}} /></div>
                        <div><label style={styles.detailItemV2Label}>Endereço</label><input type="text" name="address" value={clientData.address} onChange={handleInputChange} disabled={!isEditing} style={{...styles.detailItemV2Input, ...(!isEditing && styles.detailItemV2InputDisabled)}} /></div>
                        <div><label style={styles.detailItemV2Label}>Bairro</label><input type="text" name="bairro" value={clientData.bairro} onChange={handleInputChange} disabled={!isEditing} style={{...styles.detailItemV2Input, ...(!isEditing && styles.detailItemV2InputDisabled)}} /></div>
                        <div><label style={styles.detailItemV2Label}>Cidade</label><input type="text" name="city" value={clientData.city} onChange={handleInputChange} disabled={!isEditing} style={{...styles.detailItemV2Input, ...(!isEditing && styles.detailItemV2InputDisabled)}} /></div>
                        <div><label style={styles.detailItemV2Label}>CEP</label><input type="text" name="cep" value={clientData.cep} onChange={handleInputChange} disabled={!isEditing} style={{...styles.detailItemV2Input, ...(!isEditing && styles.detailItemV2InputDisabled)}} /></div>
                        <div><label style={styles.detailItemV2Label}>Profissão</label><input type="text" name="profissao" value={clientData.profissao} onChange={handleInputChange} disabled={!isEditing} style={{...styles.detailItemV2Input, ...(!isEditing && styles.detailItemV2InputDisabled)}} /></div>
                        <div><label style={styles.detailItemV2Label}>Telefone</label><input type="text" name="phone" value={clientData.phone} onChange={handleInputChange} disabled={!isEditing} style={{...styles.detailItemV2Input, ...(!isEditing && styles.detailItemV2InputDisabled)}} /></div>
                        <div><label style={styles.detailItemV2Label}>Consultor</label><input type="text" name="consultant" value={clientData.consultant} onChange={handleInputChange} disabled={!isEditing} style={{...styles.detailItemV2Input, ...(!isEditing && styles.detailItemV2InputDisabled)}} /></div>
                        <div><label style={styles.detailItemV2Label}>Reinvestimento</label>
                            <select name="reinvestimento" value={clientData.reinvestimento} onChange={handleInputChange} disabled={!isEditing} style={{...styles.detailItemV2Input, ...(!isEditing && styles.detailItemV2InputDisabled)}}>
                                <option>Ativado</option>
                                <option>Desativado</option>
                            </select>
                        </div>
                    </div>
                    <div style={styles.contractsSection}>
                        <div style={styles.contractsSectionHeader} onClick={() => setShowContracts(!showContracts)}>
                            <div style={styles.headerInfo}><i className="fa-solid fa-file-signature" style={styles.headerInfoIcon}></i><h4 style={styles.headerInfoH4}>Contratos ({client.contracts.length})</h4></div>
                            <i className={`fa-solid fa-chevron-down`} style={{...styles.toggleArrow, ...(showContracts && styles.toggleArrowOpen)}}></i>
                        </div>
                        <div style={{...styles.contractsListContainer, ...(showContracts && styles.contractsListContainerOpen)}}>
                            <div style={styles.contractListSearch}><i className="fa-solid fa-magnifying-glass" style={styles.contractListSearchIcon}></i><input type="text" placeholder="Pesquisar por ID do contrato..." onChange={e => setContractSearch(e.target.value)} style={styles.contractListSearchInput} /></div>
                            <ul style={styles.contractList}>
                                {filteredContracts.map((contract, index) => (<li key={contract.id} style={{...styles.contractListItem, ...((index % 2 !== 0) && styles.contractListItemOdd)}}><span>ID: #{contract.id}</span><span>Valor: {formatCurrency(contract.value)}</span><span>Status: {contract.status}</span><span>Finaliza em: {contract.endDate}</span></li>))}
                            </ul>
                        </div>
                    </div>
                    <div style={styles.balanceSection}>
                        <div style={styles.balanceInfo}>
                            <div><label style={styles.detailItemV2Label}>Saldo do Cliente</label><p style={styles.balanceValue}>{formatCurrency(clientData.balance)}</p></div>
                            <button style={styles.addBalanceButton} onClick={() => setAddingBalance(!isAddingBalance)}><i className={`fa-solid ${isAddingBalance ? 'fa-xmark' : 'fa-plus'}`}></i> {isAddingBalance ? 'Cancelar' : 'Adicionar Saldo'}</button>
                        </div>
                        <div style={{...styles.addBalanceForm, ...(isAddingBalance && styles.addBalanceFormOpen)}}>
                            <input type="number" placeholder="Valor (R$)" style={styles.addBalanceFormInput} /><input type="text" placeholder="Descrição (Ex: Aporte inicial)" style={styles.addBalanceFormInput} /><button style={styles.addBalanceFormButton}>Confirmar</button>
                        </div>
                    </div>
                </div>
                 <div style={styles.modalFooter}>
                    {isEditing ? (
                        <>
                            <button style={{...styles.modalActionButton, ...styles.modalActionButtonCancel}} onClick={() => { setEditing(false); setClientData(client); }}>Cancelar</button>
                            <button style={{...styles.modalActionButton, ...styles.modalActionButtonSave}} onClick={() => setEditing(false)}><i className="fa-solid fa-check"></i> Salvar</button>
                        </>
                    ) : (
                        <button style={{...styles.modalActionButton, ...styles.modalActionButtonPrimary}} onClick={() => setEditing(true)}><i className="fa-solid fa-pencil"></i> Editar</button>
                    )}
                    <button style={styles.modalCloseButton} onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- Componente Principal da Página ---
function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const sortedAndFilteredClients = useMemo(() => {
    const filtered = staticClients.filter(client => client.name.toLowerCase().includes(searchTerm.toLowerCase()) || client.cpf.includes(searchTerm));
    return filtered.sort((a, b) => { if (sortOrder === 'asc') return a.investment - b.investment; return b.investment - a.investment; });
  }, [searchTerm, sortOrder]);

  const totalPages = Math.ceil(sortedAndFilteredClients.length / ITEMS_PER_PAGE);
  const paginatedClients = sortedAndFilteredClients.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalInvestment = useMemo(() => staticClients.reduce((acc, client) => acc + client.investment, 0), []);
  const averageTicket = totalInvestment / staticClients.length;

  return (
    <div style={styles.clientsPageContainer}>
      <header style={styles.clientsPageHeader}><h1 style={styles.clientsPageHeaderH1}>Clientes</h1></header>
      <section style={styles.clientKpiCards}>
        <div style={styles.clientKpiCard}><i className="fa-solid fa-users" style={styles.clientKpiCardIcon}></i><div><h4 style={styles.clientKpiCardH4}>Total de Clientes</h4><p style={styles.kpiMainValue}>{staticClients.length}</p></div></div>
        <div style={styles.clientKpiCard}><i className="fa-solid fa-hand-holding-dollar" style={styles.clientKpiCardIcon}></i><div><h4 style={styles.clientKpiCardH4}>Ticket Médio</h4><p style={styles.kpiMainValue}>{formatCurrency(averageTicket)}</p></div></div>
      </section>
      <div style={styles.tableControlsHeader}>
        <div style={styles.searchBox}><i className="fa-solid fa-magnifying-glass" style={styles.searchBoxIcon}></i><input type="text" placeholder="Buscar por nome ou CPF..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.searchInput} /></div>
        <div style={styles.actionsGroup}>
            <div style={styles.filterBox}><select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={styles.filterSelect}><option value="desc">Maior Investimento</option><option value="asc">Menor Investimento</option></select></div>
            <button style={styles.addClientButton}><i className="fa-solid fa-plus"></i> Adicionar Cliente</button>
        </div>
      </div>
      <div style={styles.clientsTableCard}>
        <table style={styles.clientsTable}>
          <thead><tr><th style={styles.tableCell}>Nome</th><th style={styles.tableCell}>CPF/CNPJ</th><th style={styles.tableCell}>Email</th><th style={styles.tableCell}>Celular</th><th style={styles.tableCell}>Total Investido</th></tr></thead>
          <tbody>{paginatedClients.map(client => (<tr key={client.id} onClick={() => setSelectedClient(client)} onMouseEnter={() => setHoveredRow(client.id)} onMouseLeave={() => setHoveredRow(null)} style={{...styles.tableRow, ...(hoveredRow === client.id && styles.tableRowHover)}}>
            <td style={styles.tableCell}>{client.name}</td>
            <td style={styles.tableCell}>{client.cpf}</td>
            <td style={styles.tableCell}><div style={styles.emailCell}>{client.email}</div></td>
            <td style={styles.tableCell}>{client.phone}</td>
            <td style={styles.tableCell}>{formatCurrency(client.investment)}</td>
          </tr>))}</tbody>
        </table>
        <div style={styles.paginationContainer}>
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} style={{...styles.paginationButton, ...(currentPage === 1 && styles.paginationButtonDisabled)}}>Anterior</button>
            <span style={styles.paginationSpan}>Página {currentPage} de {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} style={{...styles.paginationButton, ...(currentPage === totalPages && styles.paginationButtonDisabled)}}>Próxima</button>
        </div>
      </div>
      {selectedClient && <ClientDetailModal client={selectedClient} onClose={() => setSelectedClient(null)} />}
    </div>
  );
}

export default ClientsPage;