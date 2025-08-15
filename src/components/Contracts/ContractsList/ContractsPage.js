import React, { useState, useMemo, useRef, useEffect } from 'react';
import './ContractsPage.css';

// --- Dados Estáticos ---
const staticContracts = [
    { id: 7505, clientName: 'Golden Treinamento', cpf: '61209682055', purchaseDate: '10/08/2025', value: 4250.00, profitAmount: 1000.00, profitPercent: 23.53, endDate: '09/08/2028', status: 'Valorizando', firstYieldDate: '10/09/2025', description: 'Contrato inicial de teste.', reinvestmentAllowed: false },
    { id: 7503, clientName: 'Renato Oliveira Pereira', cpf: '98656686704', purchaseDate: '2025-08-08', value: 200175.00, profitAmount: 0.00, profitPercent: 0.00, endDate: '07/08/2028', status: 'Pendente', firstYieldDate: 'N/A', description: '', reinvestmentAllowed: true },
    { id: 7501, clientName: 'Priscila Lopes', cpf: '02248219032', purchaseDate: '2025-08-08', value: 425.00, profitAmount: 0.00, profitPercent: 0.00, endDate: '07/08/2028', status: 'Pendente', firstYieldDate: 'N/A', description: 'Contrato de pequeno valor.', reinvestmentAllowed: true },
    { id: 7499, clientName: 'Fábio Pitaluga Nogueira', cpf: '04211440784', purchaseDate: '2025-08-07', value: 425.00, profitAmount: 0.00, profitPercent: 0.00, endDate: '07/08/2028', status: 'Pendente', firstYieldDate: 'N/A', description: '', reinvestmentAllowed: false },
    { id: 7491, clientName: 'Diego Leonardo Brand', cpf: '77760832087', purchaseDate: '2025-08-07', value: 46750.00, profitAmount: 0.00, profitPercent: 0.00, endDate: '07/08/2028', status: 'Pendente', firstYieldDate: 'N/A', description: '', reinvestmentAllowed: true },
    { id: 7489, clientName: 'Fernando Samuel Scherer', cpf: '00695241060', purchaseDate: '2025-08-05', value: 200175.00, profitAmount: 733.98, profitPercent: 0.37, endDate: '07/08/2028', status: 'Valorizando', firstYieldDate: '08/09/2025', description: 'Contrato de cliente antigo.', reinvestmentAllowed: true },
    { id: 7487, clientName: 'Adriano Marques Bertalha', cpf: '29529317808', purchaseDate: '2025-08-05', value: 42500.00, profitAmount: 118.06, profitPercent: 0.28, endDate: '07/08/2028', status: 'Valorizando', firstYieldDate: '08/09/2025', description: '', reinvestmentAllowed: false },
    { id: 7485, clientName: 'Ana Clara Rezende', cpf: '12345678901', purchaseDate: '2025-07-01', value: 50000.00, profitAmount: 1250.00, profitPercent: 2.5, endDate: '10/12/2027', status: 'Finalizado', firstYieldDate: '11/01/2026', description: 'Contrato finalizado com sucesso.', reinvestmentAllowed: false },
];

const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const ITEMS_PER_PAGE = 5;

// --- Hook e Componente de Dropdown Customizado ---
const useOutsideAlerter = (ref, callback) => { useEffect(() => { function handleClickOutside(event) { if (ref.current && !ref.current.contains(event.target)) { callback(); } } document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [ref, callback]); }
const CustomDropdown = ({ options, selected, onSelect, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false); const wrapperRef = useRef(null); useOutsideAlerter(wrapperRef, () => setIsOpen(false));
    return (
        <div className="custom-dropdown-container-ct" ref={wrapperRef}>
            <button className="dropdown-header-ct" onClick={() => setIsOpen(!isOpen)}>{options.find(opt => opt.value === selected)?.label || placeholder}<i className={`fa-solid fa-chevron-down ${isOpen ? 'open' : ''}`}></i></button>
            {isOpen && (<ul className="dropdown-list-ct">{options.map(option => (<li key={option.value} onClick={() => { onSelect(option.value); setIsOpen(false); }}>{option.label}</li>))}</ul>)}
        </div>
    );
};

// --- Componente do Modal de Detalhes (Completo) ---
const ContractDetailModal = ({ contract, onClose, isClosing }) => {
    return (
        <div className={`modal-backdrop-ct ${isClosing ? 'closing' : ''}`} onClick={onClose}>
            <div className={`modal-content-ct large ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header-ct">
                    <h2>Detalhes do Contrato</h2>
                    <button className="login-as-client-button-ct">
                        <i className="fa-solid fa-right-to-bracket"></i>
                        Logar com cliente
                    </button>
                </div>
                <div className="modal-body-ct">
                    <div className="detail-grid-v3">
                        <div className="detail-item-v3"><span>Cliente</span><p>{contract.clientName}</p></div>
                        <div className="detail-item-v3"><span>CPF</span><p>{contract.cpf}</p></div>
                        <div className="detail-item-v3"><span>ID</span><p>#{contract.id}</p></div>
                        <div className="detail-item-v3"><span>Data da Compra</span><p>{contract.purchaseDate}</p></div>
                        <div className="detail-item-v3"><span>Primeiro Rendimento</span><p>{contract.firstYieldDate}</p></div>
                        <div className="detail-item-v3"><span>Finaliza em</span><p>{contract.endDate}</p></div>
                        <div className="detail-item-v3"><span>Valor Investido</span><p>{formatCurrency(contract.value)}</p></div>
                        <div className="detail-item-v3"><span>Total de Lucro Atual (%)</span><p>{contract.profitPercent.toFixed(2)}%</p></div>
                        <div className="detail-item-v3"><span>Valor Lucro do Contrato (R$)</span><p>{formatCurrency(contract.profitAmount)}</p></div>
                        <div className="detail-item-v3 full-width"><span>Descrição</span><p>{contract.description || 'Sem descrição.'}</p></div>
                        <div className="detail-item-v3"><span>Permitir Reinvestimento</span>
                            <select className="detail-select-ct" defaultValue={contract.reinvestmentAllowed ? 'sim' : 'nao'}>
                                <option value="sim">PERMITIR</option>
                                <option value="nao">NÃO PERMITIR</option>
                            </select>
                        </div>
                    </div>
                    <div className="action-sections-grid-ct">
                        <div className="action-section-ct">
                            <h4>Deseja realizar a recompra?</h4>
                            <div className="action-input-group-ct single">
                                <input type="text" placeholder="Digite SIM para confirmar a recompra" />
                                <button>Confirmar</button>
                            </div>
                        </div>
                        <div className="action-section-ct">
                            <h4>Prolongar/Reativar Contrato</h4>
                            <div className="action-input-group-ct triple">
                                <input type="number" placeholder="Meses a adicionar" />
                                <input type="text" placeholder="Novo teto de valorização" />
                                <input type="text" placeholder="Digite SIM para confirmar" />
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="modal-footer-ct">
                    <button className="modal-action-button-ct primary"><i className="fa-solid fa-pencil"></i> Editar</button>
                    <button className="modal-close-button-ct" onClick={onClose}><i className="fa-solid fa-xmark"></i> Fechar</button>
                </div>
            </div>
        </div>
    );
};

// --- Componente Principal da Página ---
function ContractsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContract, setSelectedContract] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [filters, setFilters] = useState({ searchTerm: '', status: 'Todos', sort: 'date_desc' });

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleOpenModal = (contract) => { setSelectedContract(contract); };
  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
        setSelectedContract(null);
        setIsClosing(false);
    }, 300);
  };

  const contractStatusCounts = useMemo(() => {
    return staticContracts.reduce((acc, contract) => {
        acc[contract.status] = (acc[contract.status] || 0) + 1;
        return acc;
    }, {});
  }, []);

  const filteredAndSortedContracts = useMemo(() => {
    let contracts = staticContracts
        .filter(contract => {
            const searchMatch = filters.searchTerm === '' ||
                contract.clientName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                contract.cpf.includes(filters.searchTerm) ||
                String(contract.id).includes(filters.searchTerm);
            const statusMatch = filters.status === 'Todos' || contract.status === filters.status;
            return searchMatch && statusMatch;
        });

    contracts.sort((a, b) => {
        switch(filters.sort) {
            case 'value_desc': return b.value - a.value;
            case 'value_asc': return a.value - b.value;
            case 'date_asc': return new Date(a.purchaseDate.split('/').reverse().join('-')) - new Date(b.purchaseDate.split('/').reverse().join('-'));
            default: return new Date(b.purchaseDate.split('/').reverse().join('-')) - new Date(a.purchaseDate.split('/').reverse().join('-'));
        }
    });
    return contracts;
  }, [filters]);

  const totalPages = Math.ceil(filteredAndSortedContracts.length / ITEMS_PER_PAGE);
  const paginatedContracts = filteredAndSortedContracts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="contracts-page-container">
      <header className="contracts-page-header"><h1>Contratos</h1></header>

      <section className="contract-kpi-card">
        <div className="kpi-total">
            <p>Total de Contratos</p>
            <span>{staticContracts.length}</span>
        </div>
        <div className="kpi-divider"></div>
        <div className="kpi-status-breakdown">
            <div className="status-item"><span>{contractStatusCounts['Valorizando'] || 0}</span><p>Valorizando</p></div>
            <div className="status-item"><span>{contractStatusCounts['Pendente'] || 0}</span><p>Pendentes</p></div>
            <div className="status-item"><span>{contractStatusCounts['Finalizado'] || 0}</span><p>Finalizados</p></div>
        </div>
      </section>

      <div className="table-controls-header-ct">
        <div className="search-box-ct">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Buscar por Cliente, CPF ou ID..." onChange={(e) => handleFilterChange('searchTerm', e.target.value)} />
        </div>
        <div className="filters-ct">
            <CustomDropdown 
                placeholder="Status"
                options={[
                    { value: 'Todos', label: 'Todos os Status' },
                    { value: 'Valorizando', label: 'Valorizando' },
                    { value: 'Pendente', label: 'Pendente' },
                    { value: 'Finalizado', label: 'Finalizado' },
                ]}
                selected={filters.status}
                onSelect={(value) => handleFilterChange('status', value)}
            />
            <CustomDropdown 
                placeholder="Ordenar por"
                options={[
                    { value: 'date_desc', label: 'Mais Recentes' },
                    { value: 'date_asc', label: 'Mais Antigos' },
                    { value: 'value_desc', label: 'Maior Valor' },
                    { value: 'value_asc', label: 'Menor Valor' },
                ]}
                selected={filters.sort}
                onSelect={(value) => handleFilterChange('sort', value)}
            />
        </div>
      </div>

      <div className="contracts-table-card">
        <table className="contracts-table">
          <thead><tr><th>ID</th><th>Cliente</th><th>CPF</th><th>Valor Investido</th><th>Lucro Atual (%)</th><th>Finaliza em</th><th>Status</th></tr></thead>
          <tbody>
            {paginatedContracts.map(contract => (
              <tr key={contract.id} onClick={() => handleOpenModal(contract)}>
                <td>#{contract.id}</td>
                <td>{contract.clientName}</td>
                <td>{contract.cpf}</td>
                <td>{formatCurrency(contract.value)}</td>
                <td>{contract.profitPercent.toFixed(2)}%</td>
                <td>{contract.endDate}</td>
                <td><span className={`status-badge-ct status-${contract.status.toLowerCase()}`}>{contract.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-container-ct">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Anterior</button>
            <span>Página {currentPage} de {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Próxima</button>
        </div>
      </div>

      {selectedContract && <ContractDetailModal contract={selectedContract} onClose={handleCloseModal} isClosing={isClosing} />}
    </div>
  );
}

export default ContractsPage;