const styles = {
    // Estilos da Página
    controllerPageContainer: { fontFamily: "'Poppins', sans-serif" },
    controllerPageHeader: { marginBottom: '32px' },
    headerH1: { fontSize: '2.25rem', fontWeight: 700, color: '#1a202c' },
    headerP: { color: '#718096', marginTop: '4px' },
    layoutFinal: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', alignItems: 'flex-start' },

    // Estilos dos Cards
    controllerCard: { background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.25)', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column', height: '100%' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px', borderBottom: '1px solid rgba(229, 231, 235, 0.8)' },
    cardHeaderIcon: { fontSize: '1.2rem', color: '#3b82f6' },
    cardHeaderH3: { margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#1a202c' },
    cardBody: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 1 },
    cardFooter: { padding: '16px 24px', borderTop: '1px solid rgba(229, 231, 235, 0.8)', display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' },
    
    // Estilos de Formulário
    formGroup: { display: 'flex', flexDirection: 'column' },
    formGroupCentered: { alignItems: 'center', justifyContent: 'center', minHeight: '70px' },
    formLabel: { fontSize: '0.85rem', fontWeight: 500, color: '#4a5568', marginBottom: '8px' },
    formInput: { fontFamily: "'Poppins', sans-serif", fontSize: '1rem', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#fff', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' },
    formInputFocus: { outline: 'none', borderColor: '#3b82f6', boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)' },
    formGroupRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    
    // Seção de Regras
    rulesManagementSection: { display: 'flex', gap: '16px', margin: '16px 0' },
    rulesBtn: { flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #d1d5db', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' },
    rulesBtnView: { backgroundColor: '#fff', color: '#374151' },
    rulesBtnViewActive: { backgroundColor: '#e5e7eb' },
    rulesBtnCreate: { backgroundColor: '#3b82f6', color: '#fff', borderColor: '#3b82f6' },
    rulesListWrapper: { maxHeight: 0, overflow: 'hidden', transition: 'max-height 0.4s ease-in-out' },
    rulesListWrapperOpen: { maxHeight: '500px' },
    rulesList: { marginTop: '16px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' },
    rulesListH4: { margin: '0 0 12px 0', fontSize: '1rem', color: '#4a5568' },
    rulesSearch: { width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', marginBottom: '12px' },
    rulesListUl: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' },
    rulesListItem: { display: 'flex', alignItems: 'center', background: '#f9fafb', padding: '10px', borderRadius: '8px', fontSize: '0.9rem' },
    ruleName: { fontWeight: 600, flexGrow: 1 },
    ruleDetails: { display: 'flex', gap: '16px', color: '#6b7280' },
    ruleActions: { display: 'flex', gap: '8px', marginLeft: '16px' },
    ruleActionButton: { background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' },
    ruleActionButtonHover: { color: '#3b82f6' },
    ruleActionButtonDangerHover: { color: '#ef4444' },
    paginationContainerRules: { display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '12px', gap: '12px' },
    paginationRulesSpan: { fontSize: '0.85rem', color: '#6b7280' },
    paginationRulesButton: { backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', color: '#374151', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer' },

    // Toggle
    toggleWrapper: { marginTop: 'auto', paddingTop: '16px' },
    toggleWrapperSeparated: { display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '16px 0', borderTop: '1px solid #e5e7eb' },
    toggleSwitchContainer: { display: 'flex', alignItems: 'center', gap: '12px' },
    toggleSwitchContainerSpan: { fontWeight: 500, color: '#374151' },
    toggleSwitch: { position: 'relative', display: 'inline-block', width: '50px', height: '28px' },
    toggleSwitchInput: { opacity: 0, width: 0, height: 0 },
    slider: { position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#ccc', transition: '.4s', borderRadius: '28px' },
    sliderBefore: { position: 'absolute', content: '""', height: '20px', width: '20px', left: '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    
    // Páginas Visíveis
    createPageBtn: { background: 'none', border: 'none', marginLeft: 'auto', color: '#3b82f6', cursor: 'pointer', fontSize: '1.2rem' },
    visiblePagesList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' },
    visiblePagesListItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb', padding: '12px', borderRadius: '8px' },
    pageInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
    pageInfoIcon: { color: '#6b7280', width: '20px', textAlign: 'center' },
    pageInfoSpan: { fontWeight: 500, color: '#374151' },
    pageActions: { display: 'flex', alignItems: 'center', gap: '12px' },
    pageActionButton: { background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' },
    pageActionButtonHover: { color: '#3b82f6' },

    // Botão Salvar
    saveCardButton: { backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 18px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' },
    saveCardButtonHover: { backgroundColor: '#059669', transform: 'translateY(-2px)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)' },

    // Modal
    modalHeaderCtrl: { textAlign: 'center', marginBottom: '24px' },
    modalHeaderCtrlH3: { fontSize: '1.5rem', color: '#1a202c', margin: 0 },
    createRuleForm: { display: 'flex', flexDirection: 'column', gap: '20px' },
    modalFooterCtrl: { marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '24px' },
    cancelBtnCtrl: { background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '12px', padding: '12px 20px', fontWeight: 500, cursor: 'pointer' },
};

export default styles;