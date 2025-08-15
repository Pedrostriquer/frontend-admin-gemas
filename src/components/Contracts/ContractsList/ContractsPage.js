import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './ContractsPage.styles.js';

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

// --- Estilos Globais para Animações ---
const GlobalStyles = () => (
    <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes scaleDown { from { transform: scale(1); opacity: 1; } to { transform: scale(0.95); opacity: 0; } }
    `}</style>
);

// --- Hook e Componente de Dropdown Customizado ---
const useOutsideAlerter = (ref, callback) => { useEffect(() => { function handleClickOutside(event) { if (ref.current && !ref.current.contains(event.target)) { callback(); } } document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [ref, callback]); }
const CustomDropdown = ({ options, selected, onSelect, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, () => setIsOpen(false));
    return (
        <div style={styles.customDropdownContainer} ref={wrapperRef}>
            <button style={styles.dropdownHeader} onClick={() => setIsOpen(!isOpen)}>{options.find(opt => opt.value === selected)?.label || placeholder}<i className={`fa-solid fa-chevron-down`} style={{...styles.dropdownHeaderIcon, ...(isOpen && styles.dropdownHeaderIconOpen)}}></i></button>
            {isOpen && (<ul style={styles.dropdownList}>{options.map(option => (<li key={option.value} style={styles.dropdownListItem} onClick={() => { onSelect(option.value); setIsOpen(false); }}>{option.label}</li>))}</ul>)}
        </div>
    );
};

// --- Componente do Modal de Detalhes ---
const ContractDetailModal = ({ contract, onClose, isClosing }) => {
    return ReactDOM.createPortal(
        <div style={{...styles.modalBackdrop, animation: isClosing ? 'fadeOut 0.3s ease forwards' : 'fadeIn 0.3s ease'}}>
            <GlobalStyles />
            <div style={{...styles.modalContent, animation: isClosing ? 'scaleDown 0.3s ease forwards' : 'scaleUp 0.3s ease'}} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <h2 style={styles.modalHeaderH2}>Detalhes do Contrato</h2>
                    <button style={styles.loginAsClientButton}><i className="fa-solid fa-right-to-bracket"></i>Logar com cliente</button>
                </div>
                <div>
                    <div style={styles.detailGrid}>
                        <div><span style={styles.detailItemSpan}>Cliente</span><p style={styles.detailItemP}>{contract.clientName}</p></div>
                        <div><span style={styles.detailItemSpan}>CPF</span><p style={styles.detailItemP}>{contract.cpf}</p></div>
                        <div><span style={styles.detailItemSpan}>ID</span><p style={styles.detailItemP}>#{contract.id}</p></div>
                        <div><span style={styles.detailItemSpan}>Data da Compra</span><p style={styles.detailItemP}>{contract.purchaseDate}</p></div>
                        <div><span style={styles.detailItemSpan}>Primeiro Rendimento</span><p style={styles.detailItemP}>{contract.firstYieldDate}</p></div>
                        <div><span style={styles.detailItemSpan}>Finaliza em</span><p style={styles.detailItemP}>{contract.endDate}</p></div>
                        <div><span style={styles.detailItemSpan}>Valor Investido</span><p style={styles.detailItemP}>{formatCurrency(contract.value)}</p></div>
                        <div><span style={styles.detailItemSpan}>Total de Lucro Atual (%)</span><p style={styles.detailItemP}>{contract.profitPercent.toFixed(2)}%</p></div>
                        <div><span style={styles.detailItemSpan}>Valor Lucro do Contrato (R$)</span><p style={styles.detailItemP}>{formatCurrency(contract.profitAmount)}</p></div>
                        <div style={styles.detailItemFullWidth}><span style={styles.detailItemSpan}>Descrição</span><p style={styles.detailItemP}>{contract.description || 'Sem descrição.'}</p></div>
                        <div><span style={styles.detailItemSpan}>Permitir Reinvestimento</span>
                            <select style={styles.detailSelect} defaultValue={contract.reinvestmentAllowed ? 'sim' : 'nao'}>
                                <option value="sim">PERMITIR</option>
                                <option value="nao">NÃO PERMITIR</option>
                            </select>
                        </div>
                    </div>
                    <div style={styles.actionSectionsGrid}>
                        <div><h4 style={styles.actionSectionH4}>Deseja realizar a recompra?</h4><div style={{...styles.actionInputGroup, ...styles.actionInputGroupSingle}}><input type="text" placeholder="Digite SIM para confirmar a recompra" style={styles.actionInput} /><button style={styles.actionButton}>Confirmar</button></div></div>
                        <div><h4 style={styles.actionSectionH4}>Prolongar/Reativar Contrato</h4><div style={styles.actionInputGroup}><input type="number" placeholder="Meses a adicionar" style={styles.actionInput} /><input type="text" placeholder="Novo teto de valorização" style={styles.actionInput} /><input type="text" placeholder="Digite SIM para confirmar" style={styles.actionInput} /></div></div>
                    </div>
                </div>
                 <div style={styles.modalFooter}>
                    <button style={{...styles.modalActionButton, ...styles.modalActionButtonPrimary}}><i className="fa-solid fa-pencil"></i> Editar</button>
                    <button style={styles.modalCloseButton} onClick={onClose}><i className="fa-solid fa-xmark"></i> Fechar</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- Componente Principal da Página ---
function ContractsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContract, setSelectedContract] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [filters, setFilters] = useState({ searchTerm: '', status: 'Todos', sort: 'date_desc' });
  const [hoveredRow, setHoveredRow] = useState(null);

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
    <div style={styles.contractsPageContainer}>
      <header style={styles.contractsPageHeader}><h1 style={styles.contractsPageHeaderH1}>Contratos</h1></header>

      <section style={styles.contractKpiCard}>
        <div style={styles.kpiTotal}><p style={styles.kpiTotalP}>Total de Contratos</p><span style={styles.kpiTotalSpan}>{staticContracts.length}</span></div>
        <div style={styles.kpiDivider}></div>
        <div style={styles.kpiStatusBreakdown}>
            <div style={styles.statusItem}><span style={styles.statusItemSpan}>{contractStatusCounts['Valorizando'] || 0}</span><p style={styles.statusItemP}>Valorizando</p></div>
            <div style={styles.statusItem}><span style={styles.statusItemSpan}>{contractStatusCounts['Pendente'] || 0}</span><p style={styles.statusItemP}>Pendentes</p></div>
            <div style={styles.statusItem}><span style={styles.statusItemSpan}>{contractStatusCounts['Finalizado'] || 0}</span><p style={styles.statusItemP}>Finalizados</p></div>
        </div>
      </section>

      <div style={styles.tableControlsHeader}>
        <div style={styles.searchBox}><i className="fa-solid fa-magnifying-glass" style={styles.searchBoxIcon}></i><input type="text" placeholder="Buscar por Cliente, CPF ou ID..." onChange={(e) => handleFilterChange('searchTerm', e.target.value)} style={styles.searchInput} /></div>
        <div style={styles.filters}>
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

      <div style={styles.contractsTableCard}>
        <table style={styles.contractsTable}>
          <thead><tr><th style={{...styles.tableCell, ...styles.tableHeader}}>ID</th><th style={{...styles.tableCell, ...styles.tableHeader}}>Cliente</th><th style={{...styles.tableCell, ...styles.tableHeader}}>CPF</th><th style={{...styles.tableCell, ...styles.tableHeader}}>Valor Investido</th><th style={{...styles.tableCell, ...styles.tableHeader}}>Lucro Atual (%)</th><th style={{...styles.tableCell, ...styles.tableHeader}}>Finaliza em</th><th style={{...styles.tableCell, ...styles.tableHeader}}>Status</th></tr></thead>
          <tbody>
            {paginatedContracts.map(contract => (
              <tr key={contract.id} onClick={() => handleOpenModal(contract)} onMouseEnter={() => setHoveredRow(contract.id)} onMouseLeave={() => setHoveredRow(null)} style={{...styles.tableRow, ...(hoveredRow === contract.id && styles.tableRowHover)}}>
                <td style={styles.tableCell}>#{contract.id}</td>
                <td style={styles.tableCell}>{contract.clientName}</td>
                <td style={styles.tableCell}>{contract.cpf}</td>
                <td style={styles.tableCell}>{formatCurrency(contract.value)}</td>
                <td style={styles.tableCell}>{contract.profitPercent.toFixed(2)}%</td>
                <td style={styles.tableCell}>{contract.endDate}</td>
                <td style={styles.tableCell}><span style={{...styles.statusBadge, ...styles[`status${contract.status.toLowerCase()}`]}}>{contract.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={styles.paginationContainer}>
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} style={{...styles.paginationButton, ...(currentPage === 1 && styles.paginationButtonDisabled)}}>Anterior</button>
            <span style={styles.paginationSpan}>Página {currentPage} de {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} style={{...styles.paginationButton, ...(currentPage === totalPages && styles.paginationButtonDisabled)}}>Próxima</button>
        </div>
      </div>

      {selectedContract && <ContractDetailModal contract={selectedContract} onClose={handleCloseModal} isClosing={isClosing} />}
    </div>
  );
}

export default ContractsPage;