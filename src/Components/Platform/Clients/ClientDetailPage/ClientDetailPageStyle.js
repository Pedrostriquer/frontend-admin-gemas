const styles = {
    pageContainer: {
        fontFamily: "'Poppins', sans-serif",
        width: "100%",
        padding: "24px 32px",
        backgroundColor: "#f8f9fa",
        boxSizing: 'border-box'
    },
    loadingContainer: {
        fontFamily: "'Poppins', sans-serif",
        fontSize: '1.2rem',
        color: '#6b7280',
        textAlign: 'center',
        padding: '40px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
    },
    headerInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    },
    backButton: {
        background: '#fff',
        border: '1px solid #e5e7eb',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#4b5563',
        fontSize: '1rem',
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: '#3b82f6',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
        overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    removePhotoButton: {
        position: 'absolute',
        bottom: '-5px',
        right: '-5px',
        background: '#ef4444',
        color: 'white',
        border: '2px solid white',
        borderRadius: '50%',
        width: '28px',
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '0.8rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    clientName: {
        fontSize: '2rem',
        fontWeight: 700,
        color: '#1a202c',
        margin: 0
    },
    clientEmail: {
        fontSize: '1rem',
        color: '#6b7280',
        margin: '4px 0 0 0'
    },
    headerActions: {
        display: 'flex',
        gap: '12px',
    },
    actionButton: {
        background: '#fff',
        border: '1px solid #d1d5db',
        color: '#374151',
        borderRadius: '12px',
        padding: '10px 16px',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s',
    },
    loginButton: {
        backgroundColor: '#f59e0b',
        color: '#fff',
        border: 'none'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
        marginBottom: '32px'
    },
    statCard: {
        background: "#ffffff",
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    statIcon: {
        fontSize: '1.25rem',
        color: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    statLabel: {
        margin: '0 0 4px 0',
        fontSize: '0.9rem',
        fontWeight: 500,
        color: '#6b7280'
    },
    statValue: {
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#111827',
        margin: 0
    },
    contentGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
    },
    card: {
        background: "#ffffff",
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        padding: '24px',
    },
    cardTitle: {
        fontSize: '1.1rem',
        fontWeight: 600,
        color: '#1f2937',
        margin: '0 0 20px 0',
        paddingBottom: '16px',
        borderBottom: '1px solid #f3f4f6'
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
    },
    infoLabel: {
        fontSize: '0.8rem',
        color: '#6b7280',
        marginBottom: '4px',
        textTransform: 'uppercase',
        fontWeight: 500,
    },
    infoValue: {
        fontSize: '0.95rem',
        color: '#1f2937',
        fontWeight: 500,
        margin: 0,
    },
    addressValue: {
        fontSize: '0.95rem',
        color: '#1f2937',
        fontWeight: 500,
        margin: 0,
        lineHeight: 1.6
    }
};

export default styles;