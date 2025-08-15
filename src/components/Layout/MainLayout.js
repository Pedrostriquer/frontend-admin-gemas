import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Contracts from '../Contracts/Contracts';
import Ecommerce from '../Ecommerce/Ecommerce';
import UsersPage from '../Users/UsersPage'; // 1. Importe a nova página
import './MainLayout.css';

function MainLayout() {
  const [activeContext, setActiveContext] = useState('contracts');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('Dashboard');

  const handleContextChange = (context) => {
    if (activeContext !== context) {
        setActiveContext(context);
        setActivePage('Dashboard'); 
    }
  };

  const handleLinkClick = (page) => {
    // Se a página clicada não for a de usuários, ela pertence a um contexto
    if (page !== 'Usuários') {
        // Se o contexto atual não for o correto para a página, troque-o
        // (Esta lógica pode ser expandida no futuro se houver páginas com mesmo nome em contextos diferentes)
    }
    setActivePage(page);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const renderContent = () => {
    if (activePage === 'Usuários') {
        return <UsersPage />;
    }
    if (activeContext === 'contracts') {
        return <Contracts activePage={activePage} />;
    }
    if (activeContext === 'ecommerce') {
        return <Ecommerce activePage={activePage} />;
    }
    return null;
  };

  return (
    <div className={`main-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        activeContext={activeContext}
        onContextChange={handleContextChange}
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        activeLink={activePage}
        onLinkClick={handleLinkClick}
      />
      <main className="content-area">
        {renderContent()}
      </main>
    </div>
  );
}

export default MainLayout;