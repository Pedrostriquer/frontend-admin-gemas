const styles = {
    // Estilos da Página
    referralsPageContainer: { fontFamily: "'Poppins', sans-serif" },
    referralsPageHeader: { marginBottom: '32px' },
    headerH1: { fontSize: '2.25rem', fontWeight: 700, color: '#1a202c' },
    headerP: { color: '#718096', marginTop: '4px' },

    // Card Principal
    referralCard: {
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.04)',
        maxWidth: '600px',
        margin: '0 auto',
        overflow: 'hidden',
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '20px 24px',
        borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
    },
    cardHeaderIcon: { fontSize: '1.2rem', color: '#3b82f6' },
    cardHeaderH3: { margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#1a202c' },
    cardBody: {
        padding: '24px',
    },
    cardFooter: {
        padding: '16px 24px',
        backgroundColor: '#f9fafb',
        borderTop: '1px solid rgba(229, 231, 235, 0.8)',
        display: 'flex',
        justifyContent: 'flex-end',
    },

    // Passo 1: Pesquisa
    searchBox: {
        position: 'relative',
    },
    searchBoxIcon: {
        position: 'absolute',
        left: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#9ca3af',
    },
    searchInput: {
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: "'Poppins', sans-serif",
        fontSize: '1rem',
        padding: '12px 16px 12px 40px',
        border: '1px solid #d1d5db',
        borderRadius: '12px',
        backgroundColor: '#fff',
    },
    clientResultsList: {
        listStyle: 'none',
        padding: 0,
        margin: '12px 0 0 0',
        maxHeight: '250px',
        overflowY: 'auto',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
    },
    clientResultItem: {
        padding: '12px 16px',
        cursor: 'pointer',
        borderBottom: '1px solid #f3f4f6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    clientResultItemHover: {
        backgroundColor: '#f3f4f6',
    },
    clientName: {
        fontWeight: 500,
        color: '#2d3748',
    },
    clientCpf: {
        fontSize: '0.85rem',
        color: '#6b7280',
        backgroundColor: '#e5e7eb',
        padding: '2px 8px',
        borderRadius: '12px',
    },
    noResults: {
        padding: '12px 16px',
        color: '#9ca3af',
        textAlign: 'center',
    },

    // Passo 2: Valor
    selectedClientInfo: {
        backgroundColor: '#f3f4f6',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    },
    clientInfoTextP: { margin: 0, color: '#6b7280' },
    clientInfoTextH4: { margin: 0, fontSize: '1.1rem', color: '#1a202c' },
    changeClientButton: {
        background: 'none',
        border: 'none',
        color: '#3b82f6',
        fontWeight: 500,
        cursor: 'pointer',
    },
    formGroup: { display: 'flex', flexDirection: 'column' },
    formLabel: { fontSize: '0.85rem', fontWeight: 500, color: '#4a5568', marginBottom: '8px' },
    formInput: {
        fontFamily: "'Poppins', sans-serif",
        fontSize: '1.5rem',
        textAlign: 'center',
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '12px',
        backgroundColor: '#fff',
    },
    confirmButton: {
        backgroundColor: '#10b981',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        padding: '12px 20px',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'all 0.2s',
    },
    confirmButtonHover: {
        backgroundColor: '#059669',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)',
    },
    confirmButtonDisabled: {
        backgroundColor: '#d1d5db',
        cursor: 'not-allowed',
    },
};

export default styles;