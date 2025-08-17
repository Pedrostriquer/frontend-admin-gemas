const styles = {
    // Estilos da Página
    offersPageContainer: { fontFamily: "'Poppins', sans-serif" },
    offersPageHeader: { marginBottom: '32px' },
    headerH1: { fontSize: '2.25rem', fontWeight: 700, color: '#1a202c' },
    headerP: { color: '#718096', marginTop: '4px' },

    // Card de Criação
    offerCreationCard: { background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.25)', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.04)', marginBottom: '32px', overflow: 'hidden' },
    creationCardGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'stretch' },
    offerFormSection: { display: 'flex', flexDirection: 'column' },
    offerPreviewSection: { backgroundColor: '#f9fafb', borderLeft: '1px solid rgba(229, 231, 235, 0.8)', display: 'flex', flexDirection: 'column' },
    
    // Card Principal
    existingOffersCard: { background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.25)', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.04)', marginBottom: '32px' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px', borderBottom: '1px solid rgba(229, 231, 235, 0.8)' },
    cardHeaderNoBorder: { borderBottom: 'none' },
    cardHeaderIcon: { fontSize: '1.2rem', color: '#3b82f6' },
    cardHeaderH3: { margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#1a202c' },
    cardBody: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 1 },
    formGroup: { display: 'flex', flexDirection: 'column' },
    formLabel: { fontSize: '0.85rem', fontWeight: 500, color: '#4a5568', marginBottom: '8px' },
    formInput: { fontFamily: "'Poppins', sans-serif", fontSize: '1rem', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#fff' },
    cardFooter: { padding: '16px 24px', borderTop: '1px solid rgba(229, 231, 235, 0.8)', display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' },
    saveOfferButton: { backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 20px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s' },
    saveOfferButtonHover: { backgroundColor: '#059669', transform: 'translateY(-2px)' },
    saveOfferButtonDanger: { backgroundColor: '#ef4444' },
    saveOfferButtonDangerHover: { backgroundColor: '#dc2626' },
    
    // Preview
    previewArea: { padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1, minHeight: '200px' },
    previewImage: { maxWidth: '100%', maxHeight: '100%', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
    placeholderPreview: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', textAlign: 'center', border: '2px dashed #d1d5db', borderRadius: '12px', width: '100%', height: '100%' },
    placeholderPreviewIcon: { fontSize: '3rem', marginBottom: '16px' },

    // Tabela
    searchBox: { display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '12px', padding: '0 12px', border: '1px solid #e5e7eb', marginLeft: 'auto' },
    searchInput: { border: 'none', outline: 'none', padding: '8px', background: 'transparent', fontFamily: "'Poppins', sans-serif", fontSize: '0.9rem' },
    offersTable: { width: '100%', borderCollapse: 'collapse' },
    tableHeaderCell: { padding: '16px 24px', textAlign: 'left', borderBottom: '1px solid #f3f4f6', fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 },
    tableCell: { padding: '16px 24px', textAlign: 'left', borderBottom: '1px solid #f3f4f6' },
    tableCellLink: { color: '#3b82f6', textDecoration: 'none', wordBreak: 'break-all' },
    offerNameCell: { fontWeight: 600, color: '#1a202c' },
    tableImgPreview: { width: '120px', borderRadius: '8px' },
    actionButtons: { display: 'flex', gap: '12px' },
    actionButton: { border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '0.9rem', color: '#fff', transition: 'all 0.2s' },
    sendBtn: { backgroundColor: '#10b981' },
    editBtn: { backgroundColor: '#3b82f6' },
    deleteBtn: { backgroundColor: '#ef4444' },
    
    // Paginação
    paginationContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px 0 8px 0', gap: '16px' },
    paginationSpan: { fontSize: '0.9rem', color: '#6b7280' },
    paginationButton: { backgroundColor: '#fff', border: '1px solid #e5e7eb', color: '#374151', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' },
    paginationButtonHover: { backgroundColor: '#f3f4f6', borderColor: '#d1d5db' },
    paginationButtonDisabled: { opacity: 0.5, cursor: 'not-allowed' },

    // Modais
    modalBackdrop: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, animation: 'fadeIn 0.3s' },
    modalBackdropClosing: { animation: 'fadeOut 0.3s forwards' },
    modalContent: { background: 'rgba(249, 250, 251, 0.9)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '28px', position: 'relative', animation: 'scaleUp 0.3s', width: '90%' },
    modalContentSmall: { maxWidth: '500px' },
    modalContentLargeV2: { maxWidth: '900px' },
    modalContentClosing: { animation: 'scaleDown 0.3s forwards' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    modalHeaderH3: { fontSize: '1.5rem', color: '#1a202c', margin: 0 },
    confirmationText: { padding: '20px 0', fontSize: '1.1rem', textAlign: 'center', color: '#4a5568' },
    modalFooter: { marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '24px' },
    modalFooterConfirmation: { justifyContent: 'center' },
    closeBtn: { background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '12px', padding: '10px 18px', fontWeight: 500 },
    
    // Modal de Envio/Edição
    editOfferGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
    formColumn: { display: 'flex', flexDirection: 'column', gap: '16px' },
    clientColumn: { display: 'flex', flexDirection: 'column', gap: '16px' },
    clientColumnLabel: { fontSize: '1rem', fontWeight: 600, color: '#4a5568' },
    sendPreviewImg: { width: '100%', borderRadius: '12px' },
    clientSelectorContainer: { border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff', padding: '12px' },
    clientSelectorControls: { display: 'flex', gap: '12px', marginBottom: '12px' },
    clientSelectorControlsInput: { flexGrow: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db' },
    clientSelectorControlsButton: { backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' },
    clientSelectorList: { listStyle: 'none', padding: 0, margin: 0, maxHeight: '180px', overflowY: 'auto' },
    clientSelectorListItemLabel: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '6px', cursor: 'pointer' },
    paginationContainerModal: { display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '12px', gap: '12px' },
    paginationModalSpan: { fontSize: '0.85rem', color: '#6b7280' },
    paginationModalButton: { backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', color: '#374151', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer' },
    stackedCardsInfoFooter: { display: 'flex', alignItems: 'center', gap: '12px' },
    stackedCardsFooter: { position: 'relative', width: '60px', height: '40px' },
    stackedCardsFooterImg: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', position: 'absolute', border: '2px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    stackedCardsInfoFooterSpan: { fontWeight: 500, color: '#4a5568' },
};

export default styles;