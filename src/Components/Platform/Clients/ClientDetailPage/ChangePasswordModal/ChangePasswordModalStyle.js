const styles = {
    modalBackdrop: {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(8px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
        animation: 'fadeIn 0.3s ease',
    },
    modalContent: {
        width: '90%', maxWidth: '500px', background: '#fff', borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '28px',
        animation: 'scaleUp 0.3s ease', fontFamily: "'Poppins', sans-serif",
    },
    modalHeader: { marginBottom: '24px' },
    modalHeaderH2: { fontSize: '1.5rem', color: '#1a202c', margin: 0, lineHeight: 1.4 },
    formGroup: { display: 'flex', flexDirection: 'column', marginBottom: '20px' },
    formLabel: { display: 'block', fontSize: '0.9rem', color: '#6b7280', marginBottom: '8px', fontWeight: 500 },
    passwordWrapper: { position: 'relative', width: '100%' },
    formInput: {
        fontSize: '1rem', color: '#2d3748', background: '#f9fafb',
        padding: '12px 40px 12px 14px', borderRadius: '8px', border: '1px solid #e5e7eb',
        width: '100%', boxSizing: 'border-box',
    },
    eyeIcon: { position: 'absolute', top: '50%', right: '15px', transform: 'translateY(-50%)', color: '#9ca3af', cursor: 'pointer' },
    modalFooter: {
        marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'flex-end',
    },
    actionButton: {
        border: 'none', borderRadius: '12px', padding: '12px 20px', fontWeight: 500,
        cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s ease',
    },
    buttonSave: { backgroundColor: '#3b82f6', color: '#fff' },
    buttonCancel: { backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db' },
    globalStyles: `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }`
};

export default styles;