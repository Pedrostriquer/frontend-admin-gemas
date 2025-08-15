import React, { useState } from 'react';
import styles from './Sidebar.styles.js';

// --- Componentes de Item de Menu Reutilizáveis ---
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

const NavItem = ({ isActive, isCollapsed, onClick, icon, children }) => {
    const [isHovered, setIsHovered] = useState(false);
    const style = {
        ...styles.navItem,
        ...(isActive && styles.navItemActive),
        ...(isHovered && !isActive && styles.navItemHover),
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

// --- Componente Principal da Sidebar ---
function Sidebar({ activeContext, onContextChange, isSidebarCollapsed, onToggle, activePath, onLinkClick }) {
    const [isToggleHovered, setIsToggleHovered] = useState(false);

    const contractsMenu = [
        { name: 'Dashboard', icon: 'fa-solid fa-chart-pie', path: '/contracts/dashboard' },
        { name: 'Clientes', icon: 'fa-solid fa-users', path: '/contracts/clients' },
        { name: 'Contratos', icon: 'fa-solid fa-file-signature', path: '/contracts/list' },
        { name: 'Saques', icon: 'fa-solid fa-money-bill-wave', path: '/contracts/withdrawals' },
        { name: 'Controlador', icon: 'fa-solid fa-sliders', path: '/contracts/controller' },
        { name: 'Indicação', icon: 'fa-solid fa-share-nodes', path: '/contracts/referrals' },
        { name: 'Ofertas', icon: 'fa-solid fa-bullhorn', path: '/contracts/offers' },
        { name: 'Mensagens', icon: 'fa-solid fa-envelope', path: '/contracts/messages' },
        { name: 'Relatórios', icon: 'fa-solid fa-chart-line', path: '/contracts/reports' },
    ];
    const ecommerceMenu = [
        { name: 'Dashboard', icon: 'fa-solid fa-chart-pie', path: '/ecommerce/dashboard' },
        { name: 'Produtos', icon: 'fa-solid fa-gem', path: '/ecommerce/products' },
        { name: 'Pedidos', icon: 'fa-solid fa-box-open', path: '/ecommerce/orders' },
        { name: 'Promoções', icon: 'fa-solid fa-tags', path: '/ecommerce/promotions' },
        { name: 'Categorias', icon: 'fa-solid fa-sitemap', path: '/ecommerce/categories' },
    ];

    const menuToShow = activeContext === 'contracts' ? contractsMenu : ecommerceMenu;

    const navStyle = {
        ...styles.sidebar,
        ...(isSidebarCollapsed && styles.sidebarCollapsed),
    };

    const toggleButtonStyle = {
        ...styles.toggleButton,
        ...(isToggleHovered && styles.toggleButtonHover),
        ...(isSidebarCollapsed && styles.toggleButtonCollapsed),
    };

    return (
        <nav style={navStyle}>
            <div style={styles.header}>
                <i className="fa-solid fa-gem" style={styles.logoIcon}></i>
                <h1 style={{...styles.headerH1, ...(isSidebarCollapsed && styles.headerH1Collapsed)}}>Gemas brilhantes</h1>
            </div>

            <div style={styles.contextSwitcher}>
                <ContextButton
                    isActive={activeContext === 'contracts'}
                    isCollapsed={isSidebarCollapsed}
                    onClick={() => onContextChange('contracts')}
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
            
            <div style={styles.globalMenuSection}>
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
            </div>

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
            
            <div style={styles.footer}>
                <button 
                    style={toggleButtonStyle} 
                    onClick={onToggle}
                    onMouseEnter={() => setIsToggleHovered(true)}
                    onMouseLeave={() => setIsToggleHovered(false)}
                >
                    <i className={`fa-solid ${isSidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
                    <span style={{...styles.toggleButtonSpan, ...(isSidebarCollapsed && styles.toggleButtonSpanCollapsed)}}>Recolher</span>
                </button>
            </div>
        </nav>
    );
}

export default Sidebar;