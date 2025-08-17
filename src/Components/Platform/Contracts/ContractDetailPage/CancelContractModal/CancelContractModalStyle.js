const styles = {
    modalBackdrop: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      background: 'rgba(249, 250, 251, 0.9)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      padding: '28px',
      width: '90%',
      maxWidth: '500px',
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
    },
    headerIcon: {
      color: '#ef4444',
      fontSize: '1.5rem',
    },
    modalTitle: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1f2937',
      margin: 0,
    },
    modalBody: {
      color: '#4b5563',
      marginBottom: '24px',
    },
    strong: {
      fontWeight: 600,
      color: '#1f2937',
    },
    optionsContainer: {
      background: 'rgba(255, 255, 255, 0.7)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '24px',
      border: '1px solid #e5e7eb',
    },
    optionLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      fontSize: '0.95rem',
    },
    optionDescription: {
      fontSize: '0.85rem',
      color: '#6b7280',
      marginTop: '4px',
      marginLeft: '34px',
    },
    checkbox: {
      width: '20px',
      height: '20px',
      accentColor: '#3b82f6',
    },
    errorMessage: {
      color: '#ef4444',
      background: '#fee2e2',
      padding: '12px',
      borderRadius: '8px',
      textAlign: 'center',
      marginBottom: '16px',
      fontSize: '0.9rem',
    },
    modalFooter: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
    },
    button: {
      border: 'none',
      borderRadius: '10px',
      padding: '10px 20px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    cancelButton: {
      background: '#e5e7eb',
      color: '#374151',
    },
    confirmButton: {
      background: '#ef4444',
      color: '#ffffff',
    },
    confirmButtonDisabled: {
      background: '#fca5a5',
      cursor: 'not-allowed',
    },
  };
  
  export default styles;