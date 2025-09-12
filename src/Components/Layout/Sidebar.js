import React, { useState, useEffect } from 'react';
import styles from './SidebarStyle';
import { useAuth } from '../../Context/AuthContext';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';

// Componente FirebaseLoginModal (sem alterações)
const FirebaseLoginModal = ({ onClose, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onSuccess();
        } catch (err) {
            setError('Falha no login. Verifique suas credenciais.');
        }
    };

    return (
        <div style={styles.firebaseModalBackdrop}>
            <div style={styles.firebaseModalContent} onClick={e => e.stopPropagation()}>
                <h4>Acesso Restrito</h4>
                <p>Insira suas credenciais de administrador do site.</p>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {error && <p style={{color: 'red', fontSize: '0.8rem'}}>{error}</p>}
                    <button type="submit">Entrar</button>
                </form>
                <button style={styles.firebaseModalClose} onClick={onClose}>&times;</button>
            </div>
        </div>
    );
};

// Componente ContextButton (sem alterações)
const ContextButton = ({ isActive, isCollapsed, onClick, icon, children }) => {
    const [isHovered, setIsHovered] = useState(false);
    const style = {
        ...styles.contextButton,
        ...(isActive && styles.contextButtonActive),
        ...(isHovered && !isActive && styles.contextButtonHover),
        ...(isCollapsed && styles.contextButtonCollapsed),
    };
    return (
        <button style={style} onClick={onClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <i className={icon}></i>
            <span style={{...styles.contextButtonSpan, ...(isCollapsed && styles.contextButtonSpanCollapsed)}}>{children}</span>
        </button>
    );
};

// Componente NavItem (sem alterações)
const NavItem = ({ isActive, isCollapsed, onClick, icon, children, hoverStyle }) => {
    const [isHovered, setIsHovered] = useState(false);
    const style = {
        ...styles.navItem,
        ...(isActive && styles.navItemActive),
        ...(isHovered && !isActive && (hoverStyle || styles.navItemHover)),
        ...(isCollapsed && styles.navItemCollapsed),
    };
    return (
        <li style={style} onClick={onClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <i className={icon} style={styles.navItemIcon}></i>
            <span style={{...styles.navItemSpan, ...(isCollapsed && styles.navItemSpanCollapsed)}}>{children}</span>
        </li>
    );
};

function Sidebar({ activeContext, onContextChange, isSidebarCollapsed, onToggle, activePath, onLinkClick }) {
    const [isUserHovered, setIsUserHovered] = useState(false);
    const { logout } = useAuth();
    const [firebaseUser, setFirebaseUser] = useState(null);
    const [showFirebaseModal, setShowFirebaseModal] = useState(false);
    // ✨ Novo estado de hover para o botão flutuante
    const [isToggleHovered, setIsToggleHovered] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setFirebaseUser(user);
        });
        return () => unsubscribe();
    }, []);
    
    const handleContextClick = (context) => {
        if (context === 'site') {
            if (firebaseUser) {
                onContextChange('site');
            } else {
                setShowFirebaseModal(true);
            }
        } else {
            onContextChange(context);
        }
    };

    const handleFirebaseLoginSuccess = () => {
        setShowFirebaseModal(false);
        onContextChange('site');
    };

    const platformMenu = [
        { name: 'Dashboard', icon: 'fa-solid fa-chart-pie', path: '/platform/dashboard' },
        { name: 'Clientes', icon: 'fa-solid fa-users', path: '/platform/clients' },
        { name: 'Consultores', icon: 'fa-solid fa-user-tie', path: '/platform/consultants' },
        { name: 'Contratos', icon: 'fa-solid fa-file-signature', path: '/platform/contracts' },
        { name: 'Saques', icon: 'fa-solid fa-money-bill-wave', path: '/platform/withdraws' },
        { name: 'Controlador', icon: 'fa-solid fa-sliders', path: '/platform/controller' },
    ];
    const ecommerceMenu = [
        { name: 'Dashboard', icon: 'fa-solid fa-chart-pie', path: '/ecommerce/dashboard' },
        { name: 'Produtos', icon: 'fa-solid fa-gem', path: '/ecommerce/products' },
        { name: 'Categorias', icon: 'fa-solid fa-sitemap', path: '/ecommerce/categories' },
        { name: 'Formulários', icon: 'fa-solid fa-file-alt', path: '/ecommerce/forms' }, 
        { name: 'Promoções', icon: 'fa-solid fa-tags', path: '/ecommerce/promotions' },
        { name: 'Pedidos', icon: 'fa-solid fa-box-open', path: '/ecommerce/orders' },
    ];
    const siteMenu = [
        { name: 'Home', icon: 'fa-solid fa-house', path: '/site/home' },
        { name: 'GemCash', icon: 'fa-solid fa-coins', path: '/site/gemcash' },
        { name: 'Jóias', icon: 'fa-solid fa-ring', path: '/site/personalizadas' },
    ];

    const getMenu = () => {
        switch(activeContext) {
            case 'platform': return platformMenu;
            case 'ecommerce': return ecommerceMenu;
            case 'site': return siteMenu;
            default: return [];
        }
    };

    const navStyle = { ...styles.sidebar, ...(isSidebarCollapsed && styles.sidebarCollapsed) };
    const userProfileStyle = { ...styles.userProfile, ...(isUserHovered && styles.userProfileHover), ...(isSidebarCollapsed && styles.userProfileCollapsed) };
    
    // ✨ Estilo dinâmico para o novo botão flutuante
    const floatingToggleStyle = {
        ...styles.floatingToggleButton,
        left: isSidebarCollapsed ? styles.sidebarCollapsed.width : styles.sidebar.width,
        ...(isToggleHovered && styles.floatingToggleButtonHover)
    };

    return (
        <>
            {showFirebaseModal && <FirebaseLoginModal onClose={() => setShowFirebaseModal(false)} onSuccess={handleFirebaseLoginSuccess} />}
            
            {/* ✨ Botão de recolher agora é flutuante e renderizado aqui */}
            <button
                style={floatingToggleStyle}
                onClick={onToggle}
                onMouseEnter={() => setIsToggleHovered(true)}
                onMouseLeave={() => setIsToggleHovered(false)}
                aria-label={isSidebarCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
            >
                <i className={`fa-solid ${isSidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
            </button>
            
            <nav style={navStyle}>
                <header style={styles.header}>
                    <i className="fa-solid fa-gem" style={styles.logoIcon}></i>
                    <h1 style={{...styles.headerH1, ...(isSidebarCollapsed && styles.headerH1Collapsed)}}>Gemas brilhantes</h1>
                </header>

                <div style={styles.mainNav}>
                    <div style={styles.contextSwitcher}>
                        <ContextButton isActive={activeContext === 'platform'} isCollapsed={isSidebarCollapsed} onClick={() => handleContextClick('platform')} icon="fa-solid fa-briefcase">Plataforma</ContextButton>
                        <ContextButton isActive={activeContext === 'ecommerce'} isCollapsed={isSidebarCollapsed} onClick={() => handleContextClick('ecommerce')} icon="fa-solid fa-store">Gemas Preciosas</ContextButton>
                        <ContextButton isActive={activeContext === 'site'} isCollapsed={isSidebarCollapsed} onClick={() => handleContextClick('site')} icon="fa-solid fa-globe">Site</ContextButton>
                    </div>
                    
                    <div style={styles.menuContainer}>
                        {/* ✨ Botão de Sair foi removido daqui */}
                        <div style={styles.menuDivider}></div>
                        <ul style={styles.globalMenu}>
                            <NavItem isActive={activePath === '/users'} isCollapsed={isSidebarCollapsed} onClick={() => onLinkClick('/users')} icon="fa-solid fa-user-shield">Usuários</NavItem>
                            {/* ✨ Novo botão "Extrair dados" adicionado */}
                            <NavItem
                                isActive={activePath === '/extract-data'}
                                isCollapsed={isSidebarCollapsed}
                                onClick={() => onLinkClick('/extract-data')}
                                icon="fa-solid fa-file-export"
                            >
                                Extrair dados
                            </NavItem>
                        </ul>
                        <div style={styles.menuDivider}></div>
                        <ul style={styles.contextMenu}>
                            {getMenu().map(item => (
                                <NavItem key={item.path} isActive={activePath === item.path} isCollapsed={isSidebarCollapsed} onClick={() => onLinkClick(item.path)} icon={item.icon}>{item.name}</NavItem>
                            ))}
                        </ul>
                    </div>
                </div>
                
                <footer style={styles.footer}>
                    <div style={userProfileStyle} onClick={() => onLinkClick('/profile')} onMouseEnter={() => setIsUserHovered(true)} onMouseLeave={() => setIsUserHovered(false)}>
                        <div style={styles.userAvatar}>MU</div>
                        <div style={{...styles.userInfo, ...(isSidebarCollapsed && styles.userInfoCollapsed)}}>
                            <span style={styles.userNameText}>Manual</span>
                            <span style={styles.userRoleText}>Admin</span>
                        </div>
                    </div>
                    {/* ✨ Botão de Sair agora está aqui, no lugar do antigo botão de recolher */}
                    <ul style={styles.globalMenu}> {/* Usando ul para consistência */}
                        <NavItem 
                            isCollapsed={isSidebarCollapsed} 
                            onClick={logout} 
                            icon="fa-solid fa-right-from-bracket" 
                            hoverStyle={styles.navItemLogoutHover}
                        >
                            Sair
                        </NavItem>
                    </ul>
                </footer>
            </nav>
        </>
    );
}

export default Sidebar;