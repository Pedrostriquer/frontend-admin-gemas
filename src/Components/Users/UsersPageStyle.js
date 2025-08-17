const styles = {
    // Estilos da Página
    usersPageContainer: { fontFamily: "'Poppins', sans-serif" },
    usersPageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    headerH1: { fontSize: '2.25rem', fontWeight: 700, color: '#1a202c' },
    addUserButton: { backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 20px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' },
    addUserButtonHover: { backgroundColor: '#2563eb', transform: 'translateY(-2px)', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)' },
    searchBox: { marginBottom: '24px' },
    searchInput: { width: '100%', boxSizing: 'border-box', background: '#fff', borderRadius: '12px', padding: '14px 20px', border: '1px solid #e5e7eb', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.04)', fontFamily: "'Poppins', sans-serif", fontSize: '1rem' },
    
    // Tabela
    usersTableCard: { background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.25)', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.04)', padding: '16px', overflowX: 'auto' },
    usersTable: { width: '100%', borderCollapse: 'collapse' },
    tableHeaderCell: { padding: '16px 20px', textAlign: 'left', borderBottom: '1px solid #f3f4f6', fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 },
    tableCell: { padding: '16px 20px', textAlign: 'left', borderBottom: '1px solid #f3f4f6', fontSize: '0.9rem', color: '#2d3748', fontWeight: 500 },
    tableRow: { transition: 'background-color 0.2s' },
    tableRowHover: { backgroundColor: 'rgba(249, 250, 251, 0.7)' },
    optionsBtn: { backgroundColor: '#f3f4f6', color: '#4b5563', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', transition: 'all 0.2s' },
    optionsBtnHover: { backgroundColor: '#e5e7eb' },

    // Modais
    modalBackdrop: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, animation: 'fadeIn 0.3s' },
    modalBackdropClosing: { animation: 'fadeOut 0.3s forwards' },
    modalContent: { background: 'rgba(249, 250, 251, 0.9)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '28px', position: 'relative', animation: 'scaleUp 0.3s', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' },
    modalContentLarge: { maxWidth: '1200px' },
    modalContentClosing: { animation: 'scaleDown 0.3s forwards' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    modalHeaderH3: { fontSize: '1.5rem', color: '#1a202c', margin: 0 },
    modalHeaderButton: { background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#9ca3af' },
    
    // Modal de Detalhes
    userDetailsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
    userDetailsP: { margin: 0 },
    userDetailsPSpan: { display: 'block', fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 },
    permissionsDisplay: { borderTop: '1px solid #e5e7eb', paddingTop: '24px' },
    permissionGroup: { marginBottom: '16px' },
    permissionGroupH4: { fontSize: '1.1rem', color: '#374151', margin: '0 0 12px 0' },
    tags: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    tagSpan: { backgroundColor: '#e5e7eb', color: '#374151', padding: '6px 12px', borderRadius: '16px', fontSize: '0.85rem' },

    // Modal de Criação
    createUserGrid: { display: 'grid', gridTemplateColumns: '300px 1fr 1fr', gap: '24px' },
    formColumn: { display: 'flex', flexDirection: 'column', gap: '16px' },
    permissionsColumn: { backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' },
    permissionsColumnSelected: { backgroundColor: 'rgba(229, 240, 255, 0.5)' },
    permissionsColumnH4: { fontSize: '1.1rem', color: '#374151', margin: '0 0 12px 0', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' },
    formGroup: { display: 'flex', flexDirection: 'column' },
    formLabel: { fontSize: '0.8rem', fontWeight: 500, color: '#4a5568', marginBottom: '6px' },
    formInput: { width: '100%', boxSizing: 'border-box', fontSize: '0.9rem', background: '#fff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db' },
    permissionGroupH5: { fontSize: '0.9rem', margin: '0 0 12px 0', color: '#374151', fontWeight: 600 },
    permissionButtons: { display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '50px' },
    permissionButton: { backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s ease-out' },
    permissionButtonSelected: { backgroundColor: '#3b82f6', color: '#fff', borderColor: '#3b82f6' },
    emptyState: { fontSize: '0.9rem', color: '#9ca3af', width: '100%', textAlign: 'center', padding: '20px' },
    modalFooter: { marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '24px' },
    cancelBtn: { background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '12px', padding: '12px 20px', fontWeight: 500 },
    createBtn: { backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 20px', fontWeight: 500 },
};

export default styles;