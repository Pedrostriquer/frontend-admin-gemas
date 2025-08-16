import React, { useState, useMemo, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styles from './WithdrawalsPageStyle';

// --- Dados Estáticos ---
const staticWithdrawals = [
    { id: 1, clientName: 'Andrei Ferreira', cpf: '09006808905', requestDate: '2025-08-10', value: 2635.00, status: 'Pendente', contractId: '#6091', bankInfo: { bank: 'Sicredi Araxingu', agency: '0806', account: '67464-8', type: 'Conta Corrente', pix: 'sem pix' } },
    { id: 2, clientName: 'Eduardo Lopes Cardoso', cpf: '04669048600', requestDate: '2025-08-10', value: 1372.00, status: 'Pendente', contractId: '#6011', bankInfo: { bank: 'Banco do Brasil', agency: '1234', account: '56789-0', type: 'Conta Corrente', pix: 'eduardo@email.com' } },
    { id: 3, clientName: 'Golden Treinamento', cpf: '61209682055', requestDate: '2025-08-10', value: 980.00, status: 'Aprovado', contractId: '#7505', bankInfo: { bank: 'Itaú', agency: '0001', account: '11223-3', type: 'Conta Corrente', pix: 'financeiro@golden.com' } },
    { id: 4, clientName: 'Samara Mahmud', cpf: '04548608383', requestDate: '2025-08-08', value: 1548.00, status: 'Negado', contractId: '#2315', bankInfo: { bank: 'Bradesco', agency: '4321', account: '09876-5', type: 'Conta Poupança', pix: '54998765432' } },
    { id: 5, clientName: 'Luciano da Rocha Berto', cpf: '000.075.916-47', requestDate: '2025-08-07', value: 550.00, status: 'Aprovado', contractId: '#7497', bankInfo: { bank: 'Santander', agency: '5555', account: '44444-4', type: 'Conta Corrente', pix: 'luciano@email.com' } },
    { id: 6, clientName: 'Priscila Lopes', cpf: '02248219032', requestDate: '2025-08-06', value: 125.00, status: 'Pendente', contractId: '#7501', bankInfo: { bank: 'Caixa', agency: '2233', account: '88776-6', type: 'Conta Poupança', pix: 'priscila@email.com' } },
];
const allClientsForModal = [
    { id: 1, name: 'Andrei Ferreira', totalAvailable: 4500.00 },
    { id: 2, name: 'Eduardo Lopes Cardoso', totalAvailable: 1800.00 },
    { id: 3, name: 'Golden Treinamento', totalAvailable: 1200.00 },
    { id: 4, name: 'Samara Mahmud', totalAvailable: 2000.00 },
    { id: 5, name: 'Luciano da Rocha Berto', totalAvailable: 800.00 },
    { id: 6, name: 'Priscila Lopes', totalAvailable: 250.00 },
];

const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const CLIENTS_PER_MODAL_PAGE = 4;

// --- Estilos Globais para Animações ---
const GlobalStyles = () => (
    <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes scaleDown { from { transform: scale(1); opacity: 1; } to { transform: scale(0.95); opacity: 0; } }
        @keyframes shake { 10%, 90% { transform: translateX(-1px); } 20%, 80% { transform: translateX(2px); } 30%, 50%, 70% { transform: translateX(-4px); } 40%, 60% { transform: translateX(4px); } }
        /* Sua Animação de Sucesso Personalizada */
        .success-checkmark__circle { stroke-dasharray: 166; stroke-dashoffset: 166; stroke-width: 3; stroke-miterlimit: 10; stroke: #10b981; fill: none; animation: stroke 0.4s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
        .success-checkmark__check { transform-origin: 50% 50%; stroke-dasharray: 48; stroke-dashoffset: 48; stroke-width: 3; animation: stroke 0.2s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards; }
        .success-checkmark { animation: fill .3s ease-in-out .3s forwards, scale .2s ease-in-out .7s both; }
        @keyframes stroke { 100% { stroke-dashoffset: 0; } }
        @keyframes scale { 0%, 100% { transform: none; } 50% { transform: scale3d(1.3, 1.3, 1); } }
        @keyframes fill { 100% { box-shadow: inset 0px 0px 0px 40px #10b981; } }
    `}</style>
);

// --- Hook e Componente de Dropdown Customizado ---
const useOutsideAlerter = (ref, callback) => { useEffect(() => { function handleClickOutside(event) { if (ref.current && !ref.current.contains(event.target)) { callback(); } } document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [ref, callback]); }
const CustomDropdown = ({ options, selected, onSelect, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false); const wrapperRef = useRef(null); useOutsideAlerter(wrapperRef, () => setIsOpen(false));
    return (
        <div style={styles.customDropdownContainer} ref={wrapperRef}>
            <button style={styles.dropdownHeader} onClick={() => setIsOpen(!isOpen)}>{options.find(opt => opt.value === selected)?.label || placeholder}<i className={`fa-solid fa-chevron-down`} style={{...styles.dropdownHeaderIcon, ...(isOpen && styles.dropdownHeaderIconOpen)}}></i></button>
            {isOpen && (<ul style={styles.dropdownList}>{options.map(option => (<li key={option.value} style={styles.dropdownListItem} onClick={() => { onSelect(option.value); setIsOpen(false); }}>{option.label}</li>))}</ul>)}
        </div>
    );
};

// --- Componente da Animação de Sucesso ---
const SuccessAnimation = () => (
    <div style={styles.successAnimationContainer}>
        <div style={{...styles.successCheckmark, stroke: '#fff', strokeWidth: 3, strokeMiterlimit: 10, boxShadow: 'inset 0px 0px 0px #10b981'}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 54 54">
                <circle className="success-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="success-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
        </div>
        <h3 style={{animation: 'fadeInText 0.4s ease-in-out 1.0s forwards', opacity: 0}}>Saque Realizado com Sucesso!</h3>
        <p style={{animation: 'fadeInText 0.4s ease-in-out 1.2s forwards', opacity: 0}}>A solicitação foi processada e será concluída em breve.</p>
    </div>
);

// --- Componentes dos Modais ---
const BankAccountModal = ({ info, onClose, isClosing }) => ( 
    ReactDOM.createPortal(
        <div style={{...styles.modalBackdrop, ...(isClosing && styles.modalBackdropClosing)}} onClick={onClose}>
            <GlobalStyles />
            <div style={{...styles.modalContent, ...styles.modalContentSmall, ...(isClosing && styles.modalContentClosing)}} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}><h3 style={styles.modalHeaderH3}>Conta de {info.clientName}</h3><button onClick={onClose} style={styles.modalHeaderButton}><i className="fa-solid fa-xmark"></i></button></div>
                <div><p style={styles.bankDetailsP}><span style={styles.bankDetailsSpan}>Banco:</span> {info.bankInfo.bank}</p><p style={styles.bankDetailsP}><span style={styles.bankDetailsSpan}>Agência:</span> {info.bankInfo.agency}</p><p style={styles.bankDetailsP}><span style={styles.bankDetailsSpan}>Conta:</span> {info.bankInfo.account}</p><p style={styles.bankDetailsP}><span style={styles.bankDetailsSpan}>Tipo:</span> {info.bankInfo.type}</p><p style={styles.bankDetailsP}><span style={styles.bankDetailsSpan}>PIX:</span> {info.bankInfo.pix}</p></div>
            </div>
        </div>, document.body
    )
);
const CreateWithdrawalModal = ({ onClose, isClosing }) => {
    const [step, setStep] = useState(1);
    const [selectedClient, setSelectedClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [clientPage, setClientPage] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    const [error, setError] = useState('');

    const filteredClients = allClientsForModal.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalClientPages = Math.ceil(filteredClients.length / CLIENTS_PER_MODAL_PAGE);
    const paginatedClients = filteredClients.slice((clientPage - 1) * CLIENTS_PER_MODAL_PAGE, clientPage * CLIENTS_PER_MODAL_PAGE);

    const handleConfirmWithdrawal = () => {
        const amount = parseFloat(withdrawalAmount);
        if (!amount || amount <= 0) { setError('Por favor, insira um valor válido.'); setTimeout(() => setError(''), 2000); return; }
        if (amount > selectedClient.totalAvailable) { setError('Valor excede o saldo disponível.'); setTimeout(() => setError(''), 2000); return; }
        setShowSuccess(true);
        setTimeout(() => { onClose(); }, 1500);
    };

    return ReactDOM.createPortal(
        <div style={{...styles.modalBackdrop, ...(isClosing && styles.modalBackdropClosing)}} onClick={onClose}>
            <GlobalStyles />
            <div style={{...styles.modalContent, ...styles.modalContentLarge, ...(isClosing && styles.modalContentClosing)}} onClick={e => e.stopPropagation()}>
                {showSuccess ? <SuccessAnimation /> : (
                    <>
                        <div style={styles.modalHeader}><h3 style={styles.modalHeaderH3}>Realizar Novo Saque</h3><button onClick={onClose} style={styles.modalHeaderButton}><i className="fa-solid fa-xmark"></i></button></div>
                        <div style={{...styles.wizardSteps, ...styles.wizardStepsSimplified}}>
                            <div style={{...styles.step, ...(step >= 1 && styles.stepActive)}}><span style={{...styles.stepSpan, ...(step >= 1 && styles.stepSpanActive)}}>1</span><p>Selecionar Cliente</p></div>
                            <div style={{...styles.step, ...(step >= 2 && styles.stepActive)}}><span style={{...styles.stepSpan, ...(step >= 2 && styles.stepSpanActive)}}>2</span><p>Informar Valor</p></div>
                        </div>
                        <div style={styles.wizardContent}>
                            {step === 1 && <div><input type="text" placeholder="Pesquisar cliente..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setClientPage(1); }} style={styles.clientSearchStepInput} /><ul style={styles.clientSearchResults}>{paginatedClients.map(c => <li key={c.id} onClick={() => { setSelectedClient(c); setStep(2); }} style={styles.clientSearchResultsLi}>{c.name}</li>)}</ul><div style={styles.paginationContainerModal}><button onClick={() => setClientPage(p => Math.max(p - 1, 1))} disabled={clientPage === 1} style={styles.paginationModalButton}>&lt;</button><span style={styles.paginationModalSpan}>{clientPage} de {totalClientPages}</span><button onClick={() => setClientPage(p => Math.min(p + 1, totalClientPages))} disabled={clientPage === totalClientPages} style={styles.paginationModalButton}>&gt;</button></div></div>}
                            {step === 2 && <div><h4 style={styles.valueStepH4}>Disponível para Saque (Cliente: {selectedClient.name}): <span style={styles.availableValue}>{formatCurrency(selectedClient.totalAvailable)}</span></h4><div style={{...styles.formGroup, ...(error && {animation: 'shake 0.5s ease-in-out'})}}><label style={styles.formGroupLabel}>Valor do Saque (R$)</label><input type="number" placeholder="0,00" value={withdrawalAmount} onChange={e => setWithdrawalAmount(e.target.value)} style={{...styles.formGroupInput, ...(error && styles.formGroupErrorInput)}} />{error && <p style={styles.errorMessage}>{error}</p>}</div></div>}
                        </div>
                        <div style={styles.modalFooter}>{step > 1 && <button style={styles.backBtn} onClick={() => setStep(step - 1)}>Voltar</button>}{step === 2 && <button style={styles.confirmBtn} onClick={handleConfirmWithdrawal}>Confirmar Saque</button>}</div>
                    </>
                )}
            </div>
        </div>, document.body
    );
};

// --- Componente Principal da Página ---
function WithdrawalsPage() {
    const [modal, setModal] = useState({ type: null, data: null });
    const [isClosing, setIsClosing] = useState(false);
    const [filters, setFilters] = useState({ searchTerm: '', status: 'Todos', sort: 'date_desc' });

    const handleFilterChange = (name, value) => { setFilters(prev => ({ ...prev, [name]: value })); };
    
    const handleOpenModal = (type, data = null) => { setModal({ type, data }); };
    const handleCloseModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setModal({ type: null, data: null });
            setIsClosing(false);
        }, 300);
    };

    const filteredWithdrawals = useMemo(() => {
        let withdrawals = staticWithdrawals.filter(w => w.clientName.toLowerCase().includes(filters.searchTerm.toLowerCase())).filter(w => filters.status === 'Todos' || w.status === filters.status);
        withdrawals.sort((a, b) => {
            switch (filters.sort) {
                case 'value_asc': return a.value - b.value;
                case 'value_desc': return b.value - a.value;
                case 'date_asc': return new Date(a.requestDate) - new Date(b.requestDate);
                default: return new Date(b.requestDate) - new Date(a.requestDate);
            }
        });
        return withdrawals;
    }, [filters]);

    const totalWithdrawals = staticWithdrawals.length;
    const pendingWithdrawals = staticWithdrawals.filter(w => w.status === 'Pendente').length;
    const totalValue = staticWithdrawals.reduce((acc, w) => acc + w.value, 0);

    return (
        <div style={styles.withdrawalsPageContainer}>
            <header style={styles.withdrawalsPageHeader}><h1 style={styles.headerH1}>Validar Saques</h1></header>
            <section style={styles.withdrawalKpiCards}>
                <div style={styles.withdrawalKpiCard}><i className="fa-solid fa-receipt" style={styles.kpiIcon}></i><div><h4 style={styles.kpiH4}>Solicitações de Saque</h4><p style={styles.kpiMainValue}>{totalWithdrawals} <span style={styles.kpiUnit}>Total</span></p><p style={styles.kpiSubValue}>{pendingWithdrawals} Pendentes</p></div></div>
                <div style={styles.withdrawalKpiCard}><i className="fa-solid fa-sack-dollar" style={styles.kpiIcon}></i><div><h4 style={styles.kpiH4}>Volume Total Solicitado</h4><p style={styles.kpiMainValue}>{formatCurrency(totalValue)}</p><p style={styles.kpiSubValue}>Soma de todas as solicitações</p></div></div>
            </section>
            <div style={styles.tableControlsHeader}>
                <div style={styles.searchBox}><i className="fa-solid fa-magnifying-glass" style={styles.searchIcon}></i><input type="text" placeholder="Buscar por cliente..." onChange={(e) => handleFilterChange('searchTerm', e.target.value)} style={styles.searchInput} /></div>
                <div style={styles.actionsGroup}>
                    <CustomDropdown placeholder="Status" options={[{value: 'Todos', label: 'Todos Status'}, {value: 'Pendente', label: 'Pendente'}, {value: 'Aprovado', label: 'Aprovado'}, {value: 'Negado', label: 'Negado'}]} selected={filters.status} onSelect={(value) => handleFilterChange('status', value)} />
                    <CustomDropdown placeholder="Ordenar por" options={[{value: 'date_desc', label: 'Mais Recentes'}, {value: 'date_asc', label: 'Mais Antigos'}, {value: 'value_desc', label: 'Maior Valor'}, {value: 'value_asc', label: 'Menor Valor'}]} selected={filters.sort} onSelect={(value) => handleFilterChange('sort', value)} />
                    <button style={styles.createWithdrawalButton} onClick={() => handleOpenModal('create')}><i className="fa-solid fa-plus"></i> Realizar Novo Saque</button>
                </div>
            </div>
            <div style={styles.withdrawalsTableCard}>
                <table style={styles.withdrawalsTable}>
                    <thead><tr><th style={styles.tableHeaderCell}>Cliente</th><th style={styles.tableHeaderCell}>CPF</th><th style={styles.tableHeaderCell}>Data</th><th style={styles.tableHeaderCell}>Valor</th><th style={styles.tableHeaderCell}>Conta</th><th style={styles.tableHeaderCell}>Fundos</th><th style={styles.tableHeaderCell}>Status</th><th style={styles.tableHeaderCell}>Ações</th></tr></thead>
                    <tbody>{filteredWithdrawals.map(w => (<tr key={w.id}>
                        <td style={styles.tableCell}>{w.clientName}</td>
                        <td style={styles.tableCell}>{w.cpf}</td>
                        <td style={styles.tableCell}>{new Date(w.requestDate).toLocaleDateString('pt-BR')}</td>
                        <td style={styles.tableCell}>{formatCurrency(w.value)}</td>
                        <td style={styles.tableCell}><button style={styles.viewAccountBtn} onClick={() => handleOpenModal('bank', w)}>Ver Conta</button></td>
                        <td style={styles.tableCell}>{w.contractId}</td>
                        <td style={styles.tableCell}><span style={{...styles.statusBadge, ...styles[`status${w.status.toLowerCase()}`]}}>{w.status}</span></td>
                        <td style={styles.tableCell}>{w.status === 'Pendente' && (<div style={styles.actionButtons}><button style={{...styles.actionButton, ...styles.approveBtn}}><i className="fa-solid fa-check"></i></button><button style={{...styles.actionButton, ...styles.denyBtn}}><i className="fa-solid fa-xmark"></i></button></div>)}</td>
                    </tr>))}</tbody>
                </table>
            </div>

            {modal.type === 'bank' && <BankAccountModal info={modal.data} onClose={handleCloseModal} isClosing={isClosing} />}
            {modal.type === 'create' && <CreateWithdrawalModal onClose={handleCloseModal} isClosing={isClosing} />}
        </div>
    );
}

export default WithdrawalsPage;