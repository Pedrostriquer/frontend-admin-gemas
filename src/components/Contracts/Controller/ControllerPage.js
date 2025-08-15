import React, { useState, useMemo } from 'react';
import './ControllerPage.css';

const savedRulesData = [
    { id: 1, name: 'Plano Padrão', months: 12, valuation: 5.5, gemOption: true },
    { id: 2, name: 'Plano Ouro', months: 24, valuation: 6.0, gemOption: true },
    { id: 3, name: 'Plano Premium', months: 36, valuation: 6.5, gemOption: false },
    { id: 4, name: 'Plano Básico', months: 12, valuation: 5.0, gemOption: false },
    { id: 5, name: 'Plano Diamante', months: 48, valuation: 7.0, gemOption: true },
];
const initialClientPages = [
    { id: 1, name: "Dashboard", icon: "fa-solid fa-house", path: "/", enabled: true },
    { id: 2, name: "Contratos", icon: "fa-solid fa-file-signature", path: "/contracts", enabled: true },
    { id: 3, name: "Wallet", icon: "fa-solid fa-wallet", path: "/wallet", enabled: true },
    { id: 4, name: "Ordens de Venda", icon: "fa-solid fa-arrow-trend-up", path: "/sell-orders", enabled: true },
    { id: 5, name: "Ordens de Compra", icon: "fa-solid fa-arrow-trend-down", path: "/buy-orders", enabled: true },
    { id: 6, name: "Ecommerce", icon: "fa-solid fa-store", path: "/ecommerce", enabled: true },
];

const ToggleSwitch = ({ label, enabled, setEnabled }) => (
    <div className="toggle-switch-container">
        <label className="toggle-switch">
            <input type="checkbox" checked={enabled} onChange={() => setEnabled(!enabled)} />
            <span className="slider"></span>
        </label>
        {label && <span>{label}</span>}
    </div>
);

// --- Componente do Modal de Regras (Criar/Editar) ---
const RuleModal = ({ rule, onClose, isClosing }) => {
    const isEditing = !!rule;
    const [gemOption, setGemOption] = useState(isEditing ? rule.gemOption : true);
    return (
        <div className={`modal-backdrop-ctrl ${isClosing ? 'closing' : ''}`} onClick={onClose}>
            <div className={`modal-content-ctrl ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header-ctrl"><h3>{isEditing ? 'Editar Regra' : 'Criar Nova Regra'}</h3></div>
                <div className="create-rule-form">
                    <div className="form-group-ctrl"><label>Nome da Regra</label><input type="text" placeholder="Ex: Plano Ouro 24m" defaultValue={isEditing ? rule.name : ''} /></div>
                    <div className="form-group-ctrl"><label>Quantidade de Meses</label><input type="number" placeholder="Ex: 12" defaultValue={isEditing ? rule.months : ''} /></div>
                    <div className="form-group-ctrl"><label>Valorização Mensal (%)</label><input type="number" placeholder="Ex: 5.5" defaultValue={isEditing ? rule.valuation : ''} /></div>
                    <div className="form-group-ctrl centered">
                        <ToggleSwitch label={gemOption ? "Com Gema para Casa" : "Sem Gema para Casa"} enabled={gemOption} setEnabled={setGemOption} />
                    </div>
                </div>
                <div className="modal-footer-ctrl">
                    <button className="cancel-btn-ctrl" onClick={onClose}>Cancelar</button>
                    <button className="save-card-button">Salvar Regra</button>
                </div>
            </div>
        </div>
    );
};

// --- Componente do Modal de Botão (Criar/Editar) ---
const PageModal = ({ page, onClose, isClosing }) => {
    const isEditing = !!page;
    return (
        <div className={`modal-backdrop-ctrl ${isClosing ? 'closing' : ''}`} onClick={onClose}>
            <div className={`modal-content-ctrl ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header-ctrl"><h3>{isEditing ? 'Editar Botão' : 'Criar Novo Botão'}</h3></div>
                <div className="create-rule-form">
                    <div className="form-group-ctrl"><label>Nome do Botão</label><input type="text" placeholder="Ex: Minha Carteira" defaultValue={isEditing ? page.name : ''} /></div>
                    <div className="form-group-ctrl"><label>Ícone (Font Awesome)</label><input type="text" placeholder="Ex: fa-solid fa-wallet" defaultValue={isEditing ? page.icon : ''} /></div>
                    <div className="form-group-ctrl"><label>Caminho (URL)</label><input type="text" placeholder="Ex: /minha-carteira" defaultValue={isEditing ? page.path : ''} /></div>
                </div>
                <div className="modal-footer-ctrl">
                    <button className="cancel-btn-ctrl" onClick={onClose}>Cancelar</button>
                    <button className="save-card-button">Salvar</button>
                </div>
            </div>
        </div>
    );
};


// --- Componente Principal da Página ---
function ControllerPage() {
    const [withdrawalSettings, setWithdrawalSettings] = useState({ is_active: true });
    const [referralEnabled, setReferralEnabled] = useState(true);
    const [valuationEnabled, setValuationEnabled] = useState(true);
    const [reinvestmentEnabled, setReinvestmentEnabled] = useState(true);
    const [visiblePages, setVisiblePages] = useState(initialClientPages);
    const [showRules, setShowRules] = useState(false);
    const [modal, setModal] = useState({ type: null, data: null });
    const [isClosing, setIsClosing] = useState(false);
    const [ruleSearch, setRuleSearch] = useState('');
    const [rulePage, setRulePage] = useState(1);

    const handleOpenModal = (type, data = null) => { setModal({ type, data }); };
    const handleCloseModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setModal({ type: null, data: null });
            setIsClosing(false);
        }, 300);
    };

    const handlePageToggle = (pageId) => {
        setVisiblePages(prevPages => prevPages.map(page => page.id === pageId ? { ...page, enabled: !page.enabled } : page));
    };

    const filteredRules = useMemo(() => savedRulesData.filter(r => r.name.toLowerCase().includes(ruleSearch.toLowerCase())), [ruleSearch]);
    const paginatedRules = filteredRules.slice((rulePage - 1) * 3, rulePage * 3);
    const totalRulePages = Math.ceil(filteredRules.length / 3);

    return (
        <div className="controller-page-container">
            <header className="controller-page-header">
                <h1>Controlador</h1>
                <p>Gerencie as regras de negócio e a visibilidade de páginas para seus clientes.</p>
            </header>

            <div className="controller-layout-final">
                {/* Card de Saque */}
                <div className="controller-card">
                    <div className="card-header-ctrl"><i className="fa-solid fa-money-bill-transfer"></i><h3>Saque</h3></div>
                    <div className="card-body-ctrl">
                        <div className="form-group-ctrl"><label>Valor Mínimo (R$)</label><input type="number" defaultValue="500" /></div>
                        <div className="form-group-ctrl"><label>Taxa de Saque (%)</label><input type="number" defaultValue="5" /></div>
                        <div className="form-group-ctrl"><label>Dia do Mês para Saque</label><input type="number" min="1" max="31" defaultValue="10" /></div>
                        <div className="form-group-row-ctrl">
                            <div className="form-group-ctrl"><label>Horário de Início</label><input type="time" defaultValue="06:00" /></div>
                            <div className="form-group-ctrl"><label>Horário de Fim</label><input type="time" defaultValue="18:00" /></div>
                        </div>
                        <div className="toggle-wrapper">
                            <ToggleSwitch label={withdrawalSettings.is_active ? 'Saques Ativados' : 'Saques Desativados'} enabled={withdrawalSettings.is_active} setEnabled={(val) => setWithdrawalSettings(p => ({...p, is_active: val}))} />
                        </div>
                    </div>
                    <div className="card-footer-ctrl"><button className="save-card-button"><i className="fa-solid fa-save"></i> Salvar</button></div>
                </div>

                {/* Card de Contrato */}
                <div className="controller-card">
                    <div className="card-header-ctrl"><i className="fa-solid fa-file-signature"></i><h3>Contrato</h3></div>
                    <div className="card-body-ctrl">
                        <div className="form-group-row-ctrl">
                            <div className="form-group-ctrl"><label>Valor Mínimo (R$)</label><input type="number" defaultValue="5000" /></div>
                            <div className="form-group-ctrl"><label>Valor de Intervalo (R$)</label><input type="number" defaultValue="500" /></div>
                        </div>
                        <div className="toggle-wrapper-separated">
                            <ToggleSwitch label="Valorização Ativada" enabled={valuationEnabled} setEnabled={setValuationEnabled} />
                            <ToggleSwitch label="Reinvestimento Ativado" enabled={reinvestmentEnabled} setEnabled={setReinvestmentEnabled} />
                        </div>
                        <div className="rules-management-section">
                            <button className={`rules-btn view ${showRules ? 'active' : ''}`} onClick={() => setShowRules(!showRules)}><i className="fa-solid fa-eye"></i> Ver Regras</button>
                            <button className="rules-btn create" onClick={() => handleOpenModal('create_rule')}><i className="fa-solid fa-plus"></i> Criar Nova Regra</button>
                        </div>
                        <div className={`rules-list-wrapper ${showRules ? 'open' : ''}`}>
                            <div className="rules-list">
                                <h4>Regras Salvas</h4>
                                <input type="text" className="rules-search" placeholder="Buscar regra por nome..." onChange={e => setRuleSearch(e.target.value)} />
                                <ul>
                                    {paginatedRules.map(rule => (
                                        <li key={rule.id}>
                                            <span className="rule-name">{rule.name}</span>
                                            <div className="rule-details"><span>{rule.months}m</span><span>{rule.valuation}%</span><span>{rule.gemOption ? "C/ Gema" : "S/ Gema"}</span></div>
                                            <div className="rule-actions"><button onClick={() => handleOpenModal('edit_rule', rule)}><i className="fa-solid fa-pencil"></i></button><button className="danger"><i className="fa-solid fa-trash-can"></i></button></div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="pagination-container-rules">
                                    <button onClick={() => setRulePage(p => Math.max(p - 1, 1))} disabled={rulePage === 1}>&lt;</button>
                                    <span>{rulePage} de {totalRulePages}</span>
                                    <button onClick={() => setRulePage(p => Math.min(p + 1, totalRulePages))} disabled={rulePage === totalRulePages}>&gt;</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer-ctrl"><button className="save-card-button"><i className="fa-solid fa-save"></i> Salvar</button></div>
                </div>

                {/* Card de Indicação */}
                <div className="controller-card">
                    <div className="card-header-ctrl"><i className="fa-solid fa-share-nodes"></i><h3>Indicação</h3></div>
                    <div className="card-body-ctrl">
                        <div className="form-group-ctrl">
                            <label>Percentual de Comissão (%)</label>
                            <input type="number" defaultValue="10" />
                        </div>
                        <div className="toggle-wrapper">
                            <ToggleSwitch label="Indicações Ativadas" enabled={referralEnabled} setEnabled={setReferralEnabled} />
                        </div>
                    </div>
                    <div className="card-footer-ctrl"><button className="save-card-button"><i className="fa-solid fa-save"></i> Salvar</button></div>
                </div>

                {/* Card de Páginas Visíveis */}
                <div className="controller-card">
                    <div className="card-header-ctrl">
                        <i className="fa-solid fa-eye"></i>
                        <h3>Páginas Visíveis</h3>
                        <button className="create-page-btn" onClick={() => handleOpenModal('create_page')}><i className="fa-solid fa-plus"></i></button>
                    </div>
                    <div className="card-body-ctrl">
                        <ul className="visible-pages-list">
                            {visiblePages.map(page => (
                                <li key={page.id}>
                                    <div className="page-info"><i className={page.icon}></i><span>{page.name}</span></div>
                                    <div className="page-actions">
                                        <button onClick={() => handleOpenModal('edit_page', page)}><i className="fa-solid fa-pencil"></i></button>
                                        <ToggleSwitch enabled={page.enabled} setEnabled={() => handlePageToggle(page.id)} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="card-footer-ctrl"><button className="save-card-button"><i className="fa-solid fa-save"></i> Salvar</button></div>
                </div>
            </div>

            {(modal.type === 'create_rule' || modal.type === 'edit_rule') && <RuleModal rule={modal.data} onClose={handleCloseModal} isClosing={isClosing} />}
            {(modal.type === 'create_page' || modal.type === 'edit_page') && <PageModal page={modal.data} onClose={handleCloseModal} isClosing={isClosing} />}
        </div>
    );
}

export default ControllerPage;