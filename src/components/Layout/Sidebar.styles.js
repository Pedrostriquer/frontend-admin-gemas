const colors = {
    bg: '#ffffff',
    text: '#6b7280',
    textHover: '#111827',
    activeBg: '#f3f4f6',
    accent: '#3b82f6',
    border: '#e5e7eb',
};

const styles = {
    sidebar: {
        width: '260px',
        height: '100vh',
        backgroundColor: colors.bg,
        color: colors.text,
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${colors.border}`,
        position: 'fixed',
        top: 0,
        left: 0,
        transition: 'width 0.3s ease',
        zIndex: 100,
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
    contextSwitcher: {
        display: 'flex',
        flexDirection: 'column',
        padding: '0 24px',
        gap: '8px',
        overflow: 'hidden',
    },
    contextButton: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 12px',
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
    globalMenuSection: {
        paddingTop: '16px',
    },
    menuDivider: {
        height: '1px',
        backgroundColor: colors.border,
        margin: '0 24px',
    },
    globalMenu: {
        listStyle: 'none',
        padding: '8px 24px 0 24px',
        margin: 0,
    },
    contextMenu: {
        listStyle: 'none',
        padding: '16px 24px 0 24px',
        margin: 0,
        flexGrow: 1,
        overflowY: 'auto',
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
        padding: '24px',
        borderTop: `1px solid ${colors.border}`,
        overflow: 'hidden',
    },
    toggleButton: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: 'none',
        border: 'none',
        color: colors.text,
        padding: '12px',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    toggleButtonHover: {
        backgroundColor: colors.activeBg,
    },
    toggleButtonCollapsed: {
        justifyContent: 'center',
        gap: 0,
    },
    toggleButtonSpan: {
        whiteSpace: 'nowrap',
        opacity: 1,
        transition: 'opacity 0.2s ease',
    },
    toggleButtonSpanCollapsed: {
        opacity: 0,
        width: 0,
    },
};

export default styles;