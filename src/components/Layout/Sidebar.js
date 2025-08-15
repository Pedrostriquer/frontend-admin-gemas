import React from 'react';
import './Sidebar.css';

function Sidebar({ activeContext, onContextChange, isCollapsed, onToggle, activeLink, onLinkClick }) {

  const contractsMenu = [
    { name: 'Dashboard', icon: 'fa-solid fa-chart-pie' },
    { name: 'Clientes', icon: 'fa-solid fa-users' },
    { name: 'Contratos', icon: 'fa-solid fa-file-signature' },
    { name: 'Saques', icon: 'fa-solid fa-money-bill-wave' },
    { name: 'Controlador', icon: 'fa-solid fa-sliders' },
    { name: 'Indicação', icon: 'fa-solid fa-share-nodes' },
    { name: 'Ofertas', icon: 'fa-solid fa-bullhorn' },  
    { name: 'Mensagens', icon: 'fa-solid fa-envelope' }, 
    { name: 'Relatórios', icon: 'fa-solid fa-chart-line' },
  ];
  const ecommerceMenu = [
    { name: 'Dashboard', icon: 'fa-solid fa-chart-pie' },
    { name: 'Produtos', icon: 'fa-solid fa-gem' },
    { name: 'Pedidos', icon: 'fa-solid fa-box-open' },
    { name: 'Promoções', icon: 'fa-solid fa-tags' },
    { name: 'Categorias', icon: 'fa-solid fa-sitemap' },
  ];

  const menuToShow = activeContext === 'contracts' ? contractsMenu : ecommerceMenu;

  return (
    <nav className={`sidebar-v3 ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header-v3">
        <i className="fa-solid fa-gem logo-icon-v3"></i>
        <h1>Gemas brilhantes</h1>
      </div>

      <div className="context-switcher-v3">
        <button className={activeContext === 'contracts' ? 'active' : ''} onClick={() => onContextChange('contracts')}><i className="fa-solid fa-briefcase"></i><span>Plataforma</span></button>
        <button className={activeContext === 'ecommerce' ? 'active' : ''} onClick={() => onContextChange('ecommerce')}><i className="fa-solid fa-store"></i><span>E-commerce</span></button>
      </div>
      
      {/* --- Seção Global com Divisores --- */}
      <div className="global-menu-section">
        <div className="menu-divider"></div>
        <ul className="nav-menu-v3 global-menu">
         <li className={`nav-item-v3 ${activeLink === 'Usuários' ? 'active' : ''}`} onClick={() => onLinkClick('Usuários')}>
            <i className="fa-solid fa-user-shield"></i>
            <span>Usuários</span>
        </li>
        </ul>
        <div className="menu-divider"></div>
      </div>

      {/* Menu de Contexto */}
      <ul className="nav-menu-v3 context-menu">
        {menuToShow.map(item => (
          <li key={item.name} className={`nav-item-v3 ${activeLink === item.name ? 'active' : ''}`} onClick={() => onLinkClick(item.name)}>
            <i className={item.icon}></i>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
      
      <div className="sidebar-footer-v3">
        <button className="toggle-button" onClick={onToggle}><i className={`fa-solid ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i><span>Recolher</span></button>
      </div>
    </nav>
  );
}

export default Sidebar;