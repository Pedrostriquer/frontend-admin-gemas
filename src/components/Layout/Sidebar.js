import React, { useState } from 'react';
import styles from './SidebarStyle';

const ContextButton = ({ isActive, isCollapsed, onClick, icon, children }) => {
    const [isHovered, setIsHovered] = useState(false);
    const style = {
        ...styles.contextButton,
        ...(isActive && styles.contextButtonActive),
        ...(isHovered && !isActive && styles.contextButtonHover),
        ...(isCollapsed && styles.contextButtonCollapsed),
    };
    return (
        <button
            style={style}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <i className={icon}></i>
            <span style={{...styles.contextButtonSpan, ...(isCollapsed && styles.contextButtonSpanCollapsed)}}>{children}</span>
        </button>
    );
};

const NavItem = ({ isActive, isCollapsed, onClick, icon, children, hoverStyle }) => {
    const [isHovered, setIsHovered] = useState(false);
    const style = {
        ...styles.navItem,
        ...(isActive && styles.navItemActive),
        ...(isHovered && !isActive && (hoverStyle || styles.navItemHover)),
        ...(isCollapsed && styles.navItemCollapsed),
    };
    return (
        <li
            style={style}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <i className={icon} style={styles.navItemIcon}></i>
            <span style={{...styles.navItemSpan, ...(isCollapsed && styles.navItemSpanCollapsed)}}>{children}</span>
        </li>
    );
};

function Sidebar({ activeContext, onContextChange, isSidebarCollapsed, onToggle, activePath, onLinkClick }) {
    const [isToggleHovered, setIsToggleHovered] = useState(false);
    const [isUserHovered, setIsUserHovered] = useState(false);

    const contractsMenu = [
        { name: 'Dashboard', icon: 'fa-solid fa-chart-pie', path: '/platform/dashboard' },
        { name: 'Clientes', icon: 'fa-solid fa-users', path: '/platform/clients' },
        { name: 'Contratos', icon: 'fa-solid fa-file-signature', path: '/platform/contracts' },
        { name: 'Saques', icon: 'fa-solid fa-money-bill-wave', path: '/platform/withdraws' },
        { name: 'Controlador', icon: 'fa-solid fa-sliders', path: '/platform/controller' },
        { name: 'Indicação', icon: 'fa-solid fa-share-nodes', path: '/platform/indication' },
        { name: 'Ofertas', icon: 'fa-solid fa-bullhorn', path: '/platform/offers' },
        { name: 'Mensagens', icon: 'fa-solid fa-envelope', path: '/platform/messages' },
    ];
    const ecommerceMenu = [
        { name: 'Dashboard', icon: 'fa-solid fa-chart-pie', path: '/ecommerce/dashboard' },
        { name: 'Produtos', icon: 'fa-solid fa-gem', path: '/ecommerce/products' },
        { name: 'Pedidos', icon: 'fa-solid fa-box-open', path: '/ecommerce/orders' },
        { name: 'Promoções', icon: 'fa-solid fa-tags', path: '/ecommerce/promotions' },
        { name: 'Categorias', icon: 'fa-solid fa-sitemap', path: '/ecommerce/categories' },
    ];

    const menuToShow = activeContext === 'platform' ? contractsMenu : ecommerceMenu;

    const handleLogout = () => {
        console.log("Logout acionado!");
        alert("Usuário deslogado com sucesso! (Simulação)");
        // onLinkClick('/login'); 
    };

    const navStyle = {
        ...styles.sidebar,
        ...(isSidebarCollapsed && styles.sidebarCollapsed),
    };

    const toggleButtonStyle = {
        ...styles.toggleButton,
        ...(isToggleHovered && styles.toggleButtonHover),
        ...(isSidebarCollapsed && styles.toggleButtonCollapsed),
    };
    
    const userProfileStyle = {
        ...styles.userProfile,
        ...(isUserHovered && styles.userProfileHover),
        ...(isSidebarCollapsed && styles.userProfileCollapsed),
    };

    return (
        <nav style={navStyle}>
            <header style={styles.header}>
                <i className="fa-solid fa-gem" style={styles.logoIcon}></i>
                <h1 style={{...styles.headerH1, ...(isSidebarCollapsed && styles.headerH1Collapsed)}}>Gemas brilhantes</h1>
            </header>

            <div style={styles.mainNav}>
                <div style={styles.contextSwitcher}>
                    <ContextButton
                        isActive={activeContext === 'platform'}
                        isCollapsed={isSidebarCollapsed}
                        onClick={() => onContextChange('platform')}
                        icon="fa-solid fa-briefcase"
                    >
                        Plataforma
                    </ContextButton>
                    <ContextButton
                        isActive={activeContext === 'ecommerce'}
                        isCollapsed={isSidebarCollapsed}
                        onClick={() => onContextChange('ecommerce')}
                        icon="fa-solid fa-store"
                    >
                        E-commerce
                    </ContextButton>
                </div>
                
                <div style={styles.menuContainer}>
                    <ul style={styles.globalMenu}> {/* O botão de logout vai aqui */}
                        <NavItem
                            isCollapsed={isSidebarCollapsed}
                            onClick={handleLogout}
                            icon="fa-solid fa-right-from-bracket"
                            hoverStyle={styles.navItemLogoutHover}
                        >
                            Sair
                        </NavItem>
                    </ul>

                    <div style={styles.menuDivider}></div>
                    
                    <ul style={styles.globalMenu}>
                        <NavItem
                            isActive={activePath === '/users'}
                            isCollapsed={isSidebarCollapsed}
                            onClick={() => onLinkClick('/users')}
                            icon="fa-solid fa-user-shield"
                        >
                            Usuários
                        </NavItem>
                    </ul>
                    
                    <div style={styles.menuDivider}></div>

                    <ul style={styles.contextMenu}>
                        {menuToShow.map(item => (
                            <NavItem
                                key={item.path}
                                isActive={activePath === item.path}
                                isCollapsed={isSidebarCollapsed}
                                onClick={() => onLinkClick(item.path)}
                                icon={item.icon}
                            >
                                {item.name}
                            </NavItem>
                        ))}
                    </ul>
                </div>
            </div>
            
            <footer style={styles.footer}>
                <div 
                    style={userProfileStyle}
                    onClick={() => onLinkClick('/profile')}
                    onMouseEnter={() => setIsUserHovered(true)}
                    onMouseLeave={() => setIsUserHovered(false)}
                >
                    <div style={styles.userAvatar}>MU</div>
                    <div style={{...styles.userInfo, ...(isSidebarCollapsed && styles.userInfoCollapsed)}}>
                        <span style={styles.userNameText}>Manual</span>
                        <span style={styles.userRoleText}>Admin</span>
                    </div>
                </div>

                <button 
                    style={toggleButtonStyle} 
                    onClick={onToggle}
                    onMouseEnter={() => setIsToggleHovered(true)}
                    onMouseLeave={() => setIsToggleHovered(false)}
                >
                    <i className={`fa-solid ${isSidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
                    <span style={{...styles.toggleButtonSpan, ...(isSidebarCollapsed && styles.toggleButtonSpanCollapsed)}}>Recolher</span>
                </button>
            </footer>
        </nav>
    );
}

export default Sidebar;