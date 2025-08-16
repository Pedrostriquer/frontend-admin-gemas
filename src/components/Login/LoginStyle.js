const styles = {
    // Cores
    colors: {
        primaryBg: '#1a1d24',
        secondaryBg: '#ffffff',
        formBg: '#ffffff',
        primaryText: '#ffffff',
        secondaryText: '#555',
        accentColor: '#007bff',
        accentHover: '#0056b3',
        inputBorder: '#ccc',
        inputFocusBorder: '#007bff',
    },

    // Estilos da Página
    loginContainer: {
        display: 'flex',
        width: '100vw',
        height: '100vh',
        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
    },
    loginBranding: {
        flex: 1,
        background: 'linear-gradient(135deg, #2c3e50, #1a1d24)',
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        textAlign: 'center',
    },
    brandingContent: {
        maxWidth: '400px',
    },
    brandingIcon: {
        fontSize: '80px',
        marginBottom: '24px',
        opacity: 0.8,
    },
    brandingH1: {
        fontSize: '3rem',
        margin: '0 0 16px 0',
        fontWeight: 700,
        letterSpacing: '2px',
    },
    brandingP: {
        fontSize: '1.1rem',
        lineHeight: 1.6,
        opacity: 0.9,
    },
    loginFormArea: {
        flex: 1,
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
    },
    loginForm: {
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    },
    loginFormH2: {
        color: '#333',
        fontSize: '2rem',
        fontWeight: 600,
        marginBottom: '8px',
        textAlign: 'center',
    },
    formSubtitle: {
        color: '#555',
        marginBottom: '32px',
        textAlign: 'center',
    },
    inputGroup: {
        position: 'relative',
        marginBottom: '24px',
    },
    inputIcon: {
        position: 'absolute',
        left: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#ccc',
        transition: 'color 0.3s ease',
    },
    inputField: {
        width: '100%',
        padding: '14px 45px 14px 45px',
        boxSizing: 'border-box',
        border: '1px solid #ccc',
        borderRadius: '8px',
        fontSize: '1rem',
        transition: 'border-color 0.3s ease',
    },
    inputFieldFocus: {
        outline: 'none',
        borderColor: '#007bff',
    },
    inputIconFocus: {
        color: '#007bff',
    },
    passwordToggleIcon: {
        position: 'absolute',
        right: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#ccc',
        cursor: 'pointer',
        transition: 'color 0.3s ease',
    },
    passwordToggleIconHover: {
        color: '#007bff',
    },
    loginButton: {
        width: '100%',
        padding: '15px',
        backgroundColor: '#007bff',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.1rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.1s ease',
        marginTop: '24px',
    },
    loginButtonHover: {
        backgroundColor: '#0056b3',
    },
    loginButtonActive: {
        transform: 'scale(0.98)',
    },
};

export default styles;