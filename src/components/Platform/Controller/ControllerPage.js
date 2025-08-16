import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './ControllerPageStyle';

// --- Dados Estáticos ---
const savedRulesData = [
    { id: 1, name: 'Plano Padrão', months: 12, valuation: 5.5, gemOption: true },
    { id: 2, name: 'Plano Ouro', months: 24, valuation: 6.0, gemOption: true },
    { id: 3, name: 'Plano Premium', months: 36, valuation: 6.5, gemOption: false },
    { id: 4, name: 'Plano Básico', months: 12, valuation: 5.0, gemOption: false },
    { id: 5, name: 'Plano Diamante', months: 48, valuation: 7.0, gemOption: true },
];
const initialClientPages = [
    { id: 1, name: "Dashboard", icon: "fa-solid fa-house", path: "/dashboard", enabled: true },
    { id: 2, name: "Contratos", icon: "fa-solid fa-file-signature", path: "/contracts", enabled: true },
    { id: 3, name: "Wallet", icon: "fa-solid fa-wallet", path: "/wallet", enabled: true },
    { id: 4, name: "Ordens de Venda", icon: "fa-solid fa-arrow-trend-up", path: "/sell-orders", enabled: true },
    { id: 5, name: "Ordens de Compra", icon: "fa-solid fa-arrow-trend-down", path: "/buy-orders", enabled: true },
    { id: 6, name: "Ecommerce", icon: "fa-solid fa-store", path: "/store", enabled: false },
];

const GlobalStyles = () => (
    <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes scaleDown { from { transform: scale(1); opacity: 1; } to { transform: scale(0.95); opacity: 0; } }
    `}</style>
);

// --- Componente Reutilizável de Toggle ---
const ToggleSwitch = ({ label, enabled, setEnabled }) => {
    const sliderStyle = { ...styles.slider, ...{ '::before': styles.sliderBefore } };
    if (enabled) {
        sliderStyle.backgroundColor = '#3b82f6';
        sliderStyle['::before'] = { ...sliderStyle['::before'], transform: 'translateX(22px)' };
    }

    return (
        <div style={styles.toggleSwitchContainer}>
            <label style={styles.toggleSwitch}>
                <input type="checkbox" checked={enabled} onChange={() => setEnabled(!enabled)} style={styles.toggleSwitchInput} />
                <span style={sliderStyle}></span>
            </label>
            {label && <span style={styles.toggleSwitchContainerSpan}>{label}</span>}
        </div>
    );
};

// --- Componente do Modal de Regras (Criar/Editar) ---
const RuleModal = ({ rule, onClose, isClosing }) => {
    const isEditing = !!rule;
    const [gemOption, setGemOption] = useState(isEditing ? rule.gemOption : true);
    
    return ReactDOM.createPortal(
        <div style={{...styles.modalBackdrop, animation: isClosing ? 'fadeOut 0.3s ease forwards' : 'fadeIn 0.3s ease'}}>
            <GlobalStyles />
            <div style={{...styles.modalContent, animation: isClosing ? 'scaleDown 0.3s ease forwards' : 'scaleUp 0.3s ease'}} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeaderCtrl}><h3 style={styles.modalHeaderCtrlH3}>{isEditing ? 'Editar Regra' : 'Criar Nova Regra'}</h3></div>
                <div style={styles.createRuleForm}>
                    <div style={styles.formGroup}><label style={styles.formLabel}>Nome da Regra</label><input type="text" placeholder="Ex: Plano Ouro 24m" defaultValue={isEditing ? rule.name : ''} style={styles.formInput} /></div>
                    <div style={styles.formGroup}><label style={styles.formLabel}>Quantidade de Meses</label><input type="number" placeholder="Ex: 12" defaultValue={isEditing ? rule.months : ''} style={styles.formInput} /></div>
                    <div style={styles.formGroup}><label style={styles.formLabel}>Valorização Mensal (%)</label><input type="number" placeholder="Ex: 5.5" defaultValue={isEditing ? rule.valuation : ''} style={styles.formInput} /></div>
                    <div style={{...styles.formGroup, ...styles.formGroupCentered}}>
                        <ToggleSwitch label={gemOption ? "Com Gema para Casa" : "Sem Gema para Casa"} enabled={gemOption} setEnabled={setGemOption} />
                    </div>
                </div>
                <div style={styles.modalFooterCtrl}>
                    <button style={styles.cancelBtnCtrl} onClick={onClose}>Cancelar</button>
                    <button style={styles.saveCardButton}>Salvar Regra</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- Componente do Modal de Botão (Criar/Editar) ---
const PageModal = ({ page, onClose, isClosing }) => {
    const isEditing = !!page;
    return ReactDOM.createPortal(
        <div style={{...styles.modalBackdrop, animation: isClosing ? 'fadeOut 0.3s ease forwards' : 'fadeIn 0.3s ease'}}>
            <GlobalStyles />
            <div style={{...styles.modalContent, animation: isClosing ? 'scaleDown 0.3s ease forwards' : 'scaleUp 0.3s ease'}} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeaderCtrl}><h3 style={styles.modalHeaderCtrlH3}>{isEditing ? 'Editar Botão' : 'Criar Novo Botão'}</h3></div>
                <div style={styles.createRuleForm}>
                    <div style={styles.formGroup}><label style={styles.formLabel}>Nome do Botão</label><input type="text" placeholder="Ex: Minha Carteira" defaultValue={isEditing ? page.name : ''} style={styles.formInput} /></div>
                    <div style={styles.formGroup}><label style={styles.formLabel}>Ícone (Font Awesome)</label><input type="text" placeholder="Ex: fa-solid fa-wallet" defaultValue={isEditing ? page.icon : ''} style={styles.formInput} /></div>
                    <div style={styles.formGroup}><label style={styles.formLabel}>Caminho (URL)</label><input type="text" placeholder="Ex: /minha-carteira" defaultValue={isEditing ? page.path : ''} style={styles.formInput} /></div>
                </div>
                <div style={styles.modalFooterCtrl}>
                    <button style={styles.cancelBtnCtrl} onClick={onClose}>Cancelar</button>
                    <button style={styles.saveCardButton}>Salvar</button>
                </div>
            </div>
        </div>,
        document.body
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
        <div style={styles.controllerPageContainer}>
            <header style={styles.controllerPageHeader}>
                <h1 style={styles.headerH1}>Controlador</h1>
                <p style={styles.headerP}>Gerencie as regras de negócio e a visibilidade de páginas para seus clientes.</p>
            </header>

            <div style={styles.layoutFinal}>
                {/* Card de Saque */}
                <div style={styles.controllerCard}>
                    <div style={styles.cardHeader}><i className="fa-solid fa-money-bill-transfer" style={styles.cardHeaderIcon}></i><h3 style={styles.cardHeaderH3}>Saque</h3></div>
                    <div style={styles.cardBody}>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Valor Mínimo (R$)</label><input type="number" defaultValue="500" style={styles.formInput} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Taxa de Saque (%)</label><input type="number" defaultValue="5" style={styles.formInput} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Dia do Mês para Saque</label><input type="number" min="1" max="31" defaultValue="10" style={styles.formInput} /></div>
                        <div style={styles.formGroupRow}>
                            <div style={styles.formGroup}><label style={styles.formLabel}>Horário de Início</label><input type="time" defaultValue="06:00" style={styles.formInput} /></div>
                            <div style={styles.formGroup}><label style={styles.formLabel}>Horário de Fim</label><input type="time" defaultValue="18:00" style={styles.formInput} /></div>
                        </div>
                        <div style={styles.toggleWrapper}>
                            <ToggleSwitch label={withdrawalSettings.is_active ? 'Saques Ativados' : 'Saques Desativados'} enabled={withdrawalSettings.is_active} setEnabled={(val) => setWithdrawalSettings(p => ({...p, is_active: val}))} />
                        </div>
                    </div>
                    <div style={styles.cardFooter}><button style={styles.saveCardButton}><i className="fa-solid fa-save"></i> Salvar</button></div>
                </div>

                {/* Card de Contrato */}
                <div style={styles.controllerCard}>
                    <div style={styles.cardHeader}><i className="fa-solid fa-file-signature" style={styles.cardHeaderIcon}></i><h3 style={styles.cardHeaderH3}>Contrato</h3></div>
                    <div style={styles.cardBody}>
                        <div style={styles.formGroupRow}>
                            <div style={styles.formGroup}><label style={styles.formLabel}>Valor Mínimo (R$)</label><input type="number" defaultValue="5000" style={styles.formInput} /></div>
                            <div style={styles.formGroup}><label style={styles.formLabel}>Valor de Intervalo (R$)</label><input type="number" defaultValue="500" style={styles.formInput} /></div>
                        </div>
                        <div style={styles.toggleWrapperSeparated}>
                            <ToggleSwitch label="Valorização Ativada" enabled={valuationEnabled} setEnabled={setValuationEnabled} />
                            <ToggleSwitch label="Reinvestimento Ativado" enabled={reinvestmentEnabled} setEnabled={setReinvestmentEnabled} />
                        </div>
                        <div style={styles.rulesManagementSection}>
                            <button style={{...styles.rulesBtn, ...styles.rulesBtnView, ...(showRules && styles.rulesBtnViewActive)}} onClick={() => setShowRules(!showRules)}><i className="fa-solid fa-eye"></i> Ver Regras</button>
                            <button style={{...styles.rulesBtn, ...styles.rulesBtnCreate}} onClick={() => handleOpenModal('create_rule')}><i className="fa-solid fa-plus"></i> Criar Nova Regra</button>
                        </div>
                        <div style={{...styles.rulesListWrapper, ...(showRules && styles.rulesListWrapperOpen)}}>
                            <div style={styles.rulesList}>
                                <h4 style={styles.rulesListH4}>Regras Salvas</h4>
                                <input type="text" style={styles.rulesSearch} placeholder="Buscar regra por nome..." onChange={e => setRuleSearch(e.target.value)} />
                                <ul style={styles.rulesListUl}>
                                    {paginatedRules.map(rule => (
                                        <li key={rule.id} style={styles.rulesListItem}>
                                            <span style={styles.ruleName}>{rule.name}</span>
                                            <div style={styles.ruleDetails}><span>{rule.months}m</span><span>{rule.valuation}%</span><span>{rule.gemOption ? "C/ Gema" : "S/ Gema"}</span></div>
                                            <div style={styles.ruleActions}><button style={styles.ruleActionButton} onClick={() => handleOpenModal('edit_rule', rule)}><i className="fa-solid fa-pencil"></i></button><button style={{...styles.ruleActionButton, ...styles.ruleActionButtonDanger}}><i className="fa-solid fa-trash-can"></i></button></div>
                                        </li>
                                    ))}
                                </ul>
                                <div style={styles.paginationContainerRules}>
                                    <button onClick={() => setRulePage(p => Math.max(p - 1, 1))} disabled={rulePage === 1} style={styles.paginationRulesButton}>&lt;</button>
                                    <span style={styles.paginationRulesSpan}>{rulePage} de {totalRulePages}</span>
                                    <button onClick={() => setRulePage(p => Math.min(p + 1, totalRulePages))} disabled={rulePage === totalRulePages} style={styles.paginationRulesButton}>&gt;</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={styles.cardFooter}><button style={styles.saveCardButton}><i className="fa-solid fa-save"></i> Salvar</button></div>
                </div>

                {/* Card de Indicação */}
                <div style={styles.controllerCard}>
                    <div style={styles.cardHeader}><i className="fa-solid fa-share-nodes" style={styles.cardHeaderIcon}></i><h3 style={styles.cardHeaderH3}>Indicação</h3></div>
                    <div style={styles.cardBody}>
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Percentual de Comissão (%)</label>
                            <input type="number" defaultValue="10" style={styles.formInput} />
                        </div>
                        <div style={styles.toggleWrapper}>
                            <ToggleSwitch label="Indicações Ativadas" enabled={referralEnabled} setEnabled={setReferralEnabled} />
                        </div>
                    </div>
                    <div style={styles.cardFooter}><button style={styles.saveCardButton}><i className="fa-solid fa-save"></i> Salvar</button></div>
                </div>

                {/* Card de Páginas Visíveis */}
                <div style={styles.controllerCard}>
                    <div style={styles.cardHeader}>
                        <i className="fa-solid fa-eye" style={styles.cardHeaderIcon}></i>
                        <h3 style={styles.cardHeaderH3}>Páginas Visíveis</h3>
                        <button style={styles.createPageBtn} onClick={() => handleOpenModal('create_page')}><i className="fa-solid fa-plus"></i></button>
                    </div>
                    <div style={styles.cardBody}>
                        <ul style={styles.visiblePagesList}>
                            {visiblePages.map(page => (
                                <li key={page.id} style={styles.visiblePagesListItem}>
                                    <div style={styles.pageInfo}><i className={page.icon} style={styles.pageInfoIcon}></i><span style={styles.pageInfoSpan}>{page.name}</span></div>
                                    <div style={styles.pageActions}>
                                        <button style={styles.pageActionButton} onClick={() => handleOpenModal('edit_page', page)}><i className="fa-solid fa-pencil"></i></button>
                                        <ToggleSwitch enabled={page.enabled} setEnabled={() => handlePageToggle(page.id)} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div style={styles.cardFooter}><button style={styles.saveCardButton}><i className="fa-solid fa-save"></i> Salvar</button></div>
                </div>
            </div>

            {(modal.type === 'create_rule' || modal.type === 'edit_rule') && <RuleModal rule={modal.data} onClose={handleCloseModal} isClosing={isClosing} />}
            {(modal.type === 'create_page' || modal.type === 'edit_page') && <PageModal page={modal.data} onClose={handleCloseModal} isClosing={isClosing} />}
        </div>
    );
}

export default ControllerPage;