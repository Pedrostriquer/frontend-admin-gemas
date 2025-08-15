import React, { useState, useMemo, useRef, useEffect } from 'react';
import './WithdrawalsPage.css';

// --- Dados Estáticos ---
const staticWithdrawals = [
    { id: 1, clientName: 'Andrei Ferreira', cpf: '09006808905', requestDate: '2025-08-10', value: 2635.00, status: 'Pendente', contractId: '#6091', bankInfo: { bank: 'Sicredi Araxingu', agency: '0806', account: '67464-8', type: 'Conta Corrente', pix: 'sem pix' } },
    { id: 2, clientName: 'Eduardo Lopes Cardoso', cpf: '04669048600', requestDate: '2025-08-10', value: 1372.00, status: 'Pendente', contractId: '#6011', bankInfo: { bank: 'Banco do Brasil', agency: '1234', account: '56789-0', type: 'Conta Corrente', pix: 'eduardo@email.com' } },
    { id: 3, clientName: 'Golden Treinamento', cpf: '61209682055', requestDate: '2025-08-10', value: 980.00, status: 'Aprovado', contractId: '#7505', bankInfo: { bank: 'Itaú', agency: '0001', account: '11223-3', type: 'Conta Corrente', pix: 'financeiro@golden.com' } },
    { id: 4, clientName: 'Samara Mahmud', cpf: '04548608383', requestDate: '2025-08-08', value: 1548.00, status: 'Negado', contractId: '#2315', bankInfo: { bank: 'Bradesco', agency: '4321', account: '09876-5', type: 'Conta Poupança', pix: '54998765432' } },
    { id: 5, clientName: 'Luciano da Rocha Berto', cpf: '000.075.916-47', requestDate: '2025-08-07', value: 550.00, status: 'Aprovado', contractId: '#7497', bankInfo: { bank: 'Santander', agency: '5555', account: '44444-4', type: 'Conta Corrente', pix: 'luciano@email.com' } },
    { id: 6, clientName: 'Priscila Lopes', cpf: '02248219032', requestDate: '2025-08-06', value: 125.00, status: 'Pendente', contractId: '#7501', bankInfo: { bank: 'Caixa', agency: '2233', account: '88776-6', type: 'Conta Poupança', pix: 'priscila@email.com' } },
];
// Lista de clientes com o valor total disponível
const allClientsForModal = [
    { id: 1, name: 'Andrei Ferreira', totalAvailable: 4500.00 },
    { id: 2, name: 'Eduardo Lopes Cardoso', totalAvailable: 1800.00 },
    { id: 3, name: 'Golden Treinamento', totalAvailable: 1200.00 },
    { id: 4, name: 'Samara Mahmud', totalAvailable: 2000.00 },
    { id: 5, name: 'Luciano da Rocha Berto', totalAvailable: 800.00 },
    { id: 6, name: 'Priscila Lopes', totalAvailable: 250.00 },
    { id: 7, name: 'Fabiano Baldasso', totalAvailable: 50.00 },
    { id: 8, name: 'Juliana Paes', totalAvailable: 2000.00 },
    { id: 9, name: 'Fernanda Montenegro', totalAvailable: 50000.00 },
    { id: 10, name: 'Pedro Alvares Cabral', totalAvailable: 1.50 },
];

const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const ITEMS_PER_PAGE = 5;
const CLIENTS_PER_MODAL_PAGE = 4;

// --- Hook e Componentes de Dropdown ---
const useOutsideAlerter = (ref, callback) => { useEffect(() => { function handleClickOutside(event) { if (ref.current && !ref.current.contains(event.target)) { callback(); } } document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [ref, callback]); }
const CustomDropdown = ({ options, selected, onSelect, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false); const wrapperRef = useRef(null); useOutsideAlerter(wrapperRef, () => setIsOpen(false));
    return (
        <div className="custom-dropdown-container-wd" ref={wrapperRef}>
            <button className="dropdown-header-wd" onClick={() => setIsOpen(!isOpen)}>{options.find(opt => opt.value === selected)?.label || placeholder}<i className={`fa-solid fa-chevron-down ${isOpen ? 'open' : ''}`}></i></button>
            {isOpen && (<ul className="dropdown-list-wd">{options.map(option => (<li key={option.value} onClick={() => { onSelect(option.value); setIsOpen(false); }}>{option.label}</li>))}</ul>)}
        </div>
    );
};

// --- Componente da Animação de Sucesso ---
const SuccessAnimation = () => (
    <div className="success-animation-container">
        <div className="success-checkmark">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 54 54">
                <circle className="success-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="success-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
        </div>
        <h3>Saque Realizado com Sucesso!</h3>
        <p>A solicitação foi processada e será concluída em breve.</p>
    </div>
);


// --- Componentes dos Modais ---
const BankAccountModal = ({ info, onClose, isClosing }) => ( <div className={`modal-backdrop-wd ${isClosing ? 'closing' : ''}`} onClick={onClose}><div className={`modal-content-wd small ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}><div className="modal-header-wd"><h3>Conta de {info.clientName}</h3><button onClick={onClose}><i className="fa-solid fa-xmark"></i></button></div><div className="bank-details"><p><span>Banco:</span> {info.bankInfo.bank}</p><p><span>Agência:</span> {info.bankInfo.agency}</p><p><span>Conta:</span> {info.bankInfo.account}</p><p><span>Tipo:</span> {info.bankInfo.type}</p><p><span>PIX:</span> {info.bankInfo.pix}</p></div></div></div> );
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
        setTimeout(() => {
            onClose();
        }, 1500); // SEU TEMPO PERSONALIZADO
    };

    return (
        <div className={`modal-backdrop-wd ${isClosing ? 'closing' : ''}`} onClick={onClose}>
            <div className={`modal-content-wd large ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
                {showSuccess ? <SuccessAnimation /> : (
                    <>
                        <div className="modal-header-wd"><h3>Realizar Novo Saque</h3><button onClick={onClose}><i className="fa-solid fa-xmark"></i></button></div>
                        <div className="wizard-steps simplified">
                            <div className={`step ${step >= 1 ? 'active' : ''}`}><span>1</span><p>Selecionar Cliente</p></div>
                            <div className={`step ${step >= 2 ? 'active' : ''}`}><span>2</span><p>Informar Valor</p></div>
                        </div>
                        <div className="wizard-content">
                            {step === 1 && <div className="client-search-step"><input type="text" placeholder="Pesquisar cliente..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setClientPage(1); }} /><ul className="client-search-results">{paginatedClients.map(c => <li key={c.id} onClick={() => { setSelectedClient(c); setStep(2); }}>{c.name}</li>)}</ul><div className="pagination-container-modal"><button onClick={() => setClientPage(p => Math.max(p - 1, 1))} disabled={clientPage === 1}>&lt;</button><span>{clientPage} de {totalClientPages}</span><button onClick={() => setClientPage(p => Math.min(p + 1, totalClientPages))} disabled={clientPage === totalClientPages}>&gt;</button></div></div>}
                            {step === 2 && <div className="value-step"><h4>Disponível para Saque (Cliente: {selectedClient.name}): <span className="available-value">{formatCurrency(selectedClient.totalAvailable)}</span></h4><div className={`form-group-wd ${error ? 'error' : ''}`}><label>Valor do Saque (R$)</label><input type="number" placeholder="0,00" value={withdrawalAmount} onChange={e => setWithdrawalAmount(e.target.value)} />{error && <p className="error-message">{error}</p>}</div></div>}
                        </div>
                        <div className="modal-footer-wd">{step > 1 && <button className="back-btn-wd" onClick={() => setStep(step - 1)}>Voltar</button>}{step === 2 && <button className="confirm-btn-wd" onClick={handleConfirmWithdrawal}>Confirmar Saque</button>}</div>
                    </>
                )}
            </div>
        </div>
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

    const paginatedWithdrawals = filteredWithdrawals;
    const totalWithdrawals = staticWithdrawals.length;
    const pendingWithdrawals = staticWithdrawals.filter(w => w.status === 'Pendente').length;
    const totalValue = staticWithdrawals.reduce((acc, w) => acc + w.value, 0);

    return (
        <div className="withdrawals-page-container">
            <header className="withdrawals-page-header"><h1>Validar Saques</h1></header>
            <section className="withdrawal-kpi-cards">
                <div className="withdrawal-kpi-card"><i className="fa-solid fa-receipt"></i><div><h4>Solicitações de Saque</h4><p className="kpi-main-value">{totalWithdrawals} <span className="kpi-unit">Total</span></p><p className="kpi-sub-value">{pendingWithdrawals} Pendentes</p></div></div>
                <div className="withdrawal-kpi-card"><i className="fa-solid fa-sack-dollar"></i><div><h4>Volume Total Solicitado</h4><p className="kpi-main-value">{formatCurrency(totalValue)}</p><p className="kpi-sub-value">Soma de todas as solicitações</p></div></div>
            </section>
            <div className="table-controls-header">
                <div className="search-box-wd"><i className="fa-solid fa-magnifying-glass"></i><input type="text" placeholder="Buscar por cliente..." onChange={(e) => handleFilterChange('searchTerm', e.target.value)} /></div>
                <div className="actions-group-wd">
                    <CustomDropdown placeholder="Status" options={[{value: 'Todos', label: 'Todos Status'}, {value: 'Pendente', label: 'Pendente'}, {value: 'Aprovado', label: 'Aprovado'}, {value: 'Negado', label: 'Negado'}]} selected={filters.status} onSelect={(value) => handleFilterChange('status', value)} />
                    <CustomDropdown placeholder="Ordenar por" options={[{value: 'date_desc', label: 'Mais Recentes'}, {value: 'date_asc', label: 'Mais Antigos'}, {value: 'value_desc', label: 'Maior Valor'}, {value: 'value_asc', label: 'Menor Valor'}]} selected={filters.sort} onSelect={(value) => handleFilterChange('sort', value)} />
                    <button className="create-withdrawal-button" onClick={() => handleOpenModal('create')}><i className="fa-solid fa-plus"></i> Realizar Novo Saque</button>
                </div>
            </div>
            <div className="withdrawals-table-card">
                <table className="withdrawals-table">
                    <thead><tr><th>Cliente</th><th>CPF</th><th>Data</th><th>Valor</th><th>Conta</th><th>Fundos</th><th>Status</th><th>Ações</th></tr></thead>
                    <tbody>{paginatedWithdrawals.map(w => (<tr key={w.id}><td>{w.clientName}</td><td>{w.cpf}</td><td>{new Date(w.requestDate).toLocaleDateString('pt-BR')}</td><td>{formatCurrency(w.value)}</td><td><button className="view-account-btn" onClick={() => handleOpenModal('bank', w)}>Ver Conta</button></td><td>{w.contractId}</td><td><span className={`status-badge-wd status-${w.status.toLowerCase()}`}>{w.status}</span></td><td>{w.status === 'Pendente' && (<div className="action-buttons"><button className="approve-btn"><i className="fa-solid fa-check"></i></button><button className="deny-btn"><i className="fa-solid fa-xmark"></i></button></div>)}</td></tr>))}</tbody>
                </table>
            </div>
            {modal.type === 'bank' && <BankAccountModal info={modal.data} onClose={handleCloseModal} isClosing={isClosing} />}
            {modal.type === 'create' && <CreateWithdrawalModal onClose={handleCloseModal} isClosing={isClosing} />}
        </div>
    );
}

export default WithdrawalsPage;