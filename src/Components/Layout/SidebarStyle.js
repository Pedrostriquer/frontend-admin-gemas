const colors = {
    bg: '#ffffff',
    text: '#6b7280',
    textHover: '#111827',
    activeBg: '#f3f4f6',
    accent: '#3b82f6',
    border: '#e5e7eb',
    dangerBg: '#fee2e2',
    dangerText: '#b91c1c',
};

const styles = {
    sidebar: {
        width: '260px',
        height: '100vh',
        backgroundColor: colors.bg,
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${colors.border}`,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
        transition: 'width 0.3s ease',
    },
    sidebarCollapsed: {
        width: '88px',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: '24px',
        gap: '12px',
        overflow: 'hidden',
        flexShrink: 0,
    },
    logoIcon: {
        fontSize: '28px',
        color: colors.accent,
        flexShrink: 0,
    },
    headerH1: {
        color: colors.textHover,
        fontSize: '1.2rem',
        margin: 0,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        opacity: 1,
        transition: 'opacity 0.2s ease',
    },
    headerH1Collapsed: {
        opacity: 0,
        width: 0,
    },
    mainNav: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        // ✨ A propriedade de overflow foi REMOVIDA daqui.
        // O min-height é um truque de flexbox para garantir que o overflow funcione corretamente nos filhos.
        minHeight: 0,
    },
    contextSwitcher: {
        display: 'flex',
        flexDirection: 'column',
        padding: '0 24px 0px 24px',
        gap: '8px',
        flexShrink: 0, // Garante que esta seção não seja espremida
    },
    contextButton: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 12px',
        fontSize: '0.9rem',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: 'transparent',
        color: colors.text,
        cursor: 'pointer',
        transition: 'background-color 0.2s, color 0.2s',
    },
    contextButtonHover: {
        backgroundColor: colors.activeBg,
        color: colors.textHover,
    },
    contextButtonActive: {
        backgroundColor: colors.activeBg,
        color: colors.accent,
        fontWeight: 600,
    },
    contextButtonCollapsed: {
        justifyContent: 'center',
        gap: 0,
    },
    contextButtonSpan: {
        whiteSpace: 'nowrap',
        opacity: 1,
        transition: 'opacity 0.2s ease',
    },
    contextButtonSpanCollapsed: {
        opacity: 0,
        width: 0,
    },
    
    // ✨ Novo estilo para o container do menu
    menuContainer: {
        flexGrow: 1, // Faz este container ocupar todo o espaço restante em mainNav
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0, // Garante que o overflow funcione corretamente no filho (contextMenu)
    },

    menuDivider: {
        height: '1px',
        backgroundColor: colors.border,
        margin: '8px 24px',
        flexShrink: 0,
    },
    globalMenu: {
        listStyle: 'none',
        padding: '0 24px',
        margin: 0,
        flexShrink: 0, // Garante que esta seção não seja espremida
    },
    contextMenu: {
        listStyle: 'none',
        padding: '0 24px',
        margin: 0,
        // ✨ É AQUI que a mágica acontece!
        flexGrow: 1, // Faz esta lista ocupar todo o espaço restante no menuContainer
        overflowY: 'auto', // Adiciona a barra de rolagem SÓ AQUI se o conteúdo for maior
        overflowX: 'hidden',
        paddingBottom: '16px', // Espaço no final da lista para a rolagem ficar mais suave
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.2s, color 0.2s',
        gap: '16px',
    },
    navItemHover: {
        backgroundColor: colors.activeBg,
        color: colors.textHover,
    },
    navItemActive: {
        backgroundColor: colors.accent,
        color: '#ffffff',
        fontWeight: 500,
    },
    navItemLogoutHover: {
        backgroundColor: colors.dangerBg,
        color: colors.dangerText,
    },
    navItemCollapsed: {
        justifyContent: 'center',
        gap: 0,
    },
    navItemIcon: {
        width: '24px',
        fontSize: '1.1rem',
        textAlign: 'center',
        flexShrink: 0,
    },
    navItemSpan: {
        whiteSpace: 'nowrap',
        opacity: 1,
        transition: 'opacity 0.2s ease',
    },
    navItemSpanCollapsed: {
        opacity: 0,
        width: 0,
    },
    footer: {
        padding: '14px',
        borderTop: `1px solid ${colors.border}`,
        overflow: 'hidden',
        flexShrink: 0,
    },
    userProfile: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px',
        borderRadius: '8px',
        cursor: 'pointer',
        marginBottom: '16px',
        transition: 'background-color 0.2s',
    },
    userProfileHover: {
        backgroundColor: colors.activeBg,
    },
    userProfileCollapsed: {
       justifyContent: 'center',
    },
    userAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: colors.accent,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: '1rem',
        flexShrink: 0,
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
        transition: 'opacity 0.2s ease',
        opacity: 1,
        whiteSpace: 'nowrap',
    },
    userInfoCollapsed: {
        opacity: 0,
        width: 0,
    },
    userNameText: {
        fontWeight: 600,
        fontSize: '0.9rem',
        color: colors.textHover,
    },
    userRoleText: {
        fontSize: '0.8rem',
        color: colors.text,
    },
    floatingToggleButton: {
        position: 'fixed',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 101,
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: colors.text,
        transition: 'left 0.3s ease, background-color 0.2s, color 0.2s, transform 0.2s ease',
    },
    floatingToggleButtonHover: {
        backgroundColor: colors.accent,
        color: '#ffffff',
        transform: 'translate(-50%, -50%) scale(1.1)',
    },
    firebaseModalBackdrop: {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
    },
    firebaseModalContent: {
        position: 'relative', background: '#fff', padding: '30px', borderRadius: '12px',
        width: '90%', maxWidth: '350px', textAlign: 'center', boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
    },
    firebaseModalClose: {
        position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none',
        fontSize: '1.5rem', color: '#aaa', cursor: 'pointer',
    },
};

export default styles;