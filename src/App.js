import React, { useState, useEffect } from 'react';
import './App.css';

// Importe a Sidebar e TODAS as páginas diretamente
import Sidebar from './components/Layout/Sidebar';
import Login from './components/Login/Login'; 
import UsersPage from './components/Users/UsersPage';
import ContractsDashboard from './components/Contracts/Dashboard/ContractsDashboard';
import ClientsPage from './components/Contracts/Clients/ClientsPage';
import ContractsPage from './components/Contracts/ContractsList/ContractsPage';
import WithdrawalsPage from './components/Contracts/Withdrawals/WithdrawalsPage';
import ControllerPage from './components/Contracts/Controller/ControllerPage';
import ReferralsPage from './components/Contracts/Referrals/ReferralsPage';
import OffersPage from './components/Contracts/Offers/OffersPage';
import MessagesPage from './components/Contracts/Messages/MessagesPage';
import EcommerceDashboard from './components/Ecommerce/Dashboard/EcommerceDashboard';
import ProductsPage from './components/Ecommerce/Products/ProductsPage';
import OrdersPage from './components/Ecommerce/Orders/OrdersPage';
import PromotionsPage from './components/Ecommerce/Promotions/PromotionsPage';
import CategoriesPage from './components/Ecommerce/Categories/CategoriesPage';

function App() {
  // Simulando o estado de login. Mude para 'false' para ver a tela de login.
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  
  // O estado agora é baseado na URL do navegador
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Determina o contexto ('contracts' ou 'ecommerce') com base na URL
  const activeContext = currentPath.startsWith('/ecommerce') ? 'ecommerce' : 'contracts';

  // Efeito para "ouvir" os botões de voltar/avançar do navegador
  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  // Função de navegação que muda a URL
  const handleNavigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };
  
  const handleContextChange = (context) => {
    const newPath = context === 'contracts' ? '/contracts/dashboard' : '/ecommerce/dashboard';
    handleNavigate(newPath);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  // O "Roteador" principal da aplicação
  const renderContent = () => {
    switch (currentPath) {
      // Rotas de Contratos
      case '/':
      case '/contracts/dashboard':
        return <ContractsDashboard />;
      case '/contracts/clients':
        return <ClientsPage />;
      case '/contracts/list':
        return <ContractsPage />;
      case '/contracts/withdrawals':
        return <WithdrawalsPage />;
      case '/contracts/controller':
        return <ControllerPage />;
      case '/contracts/referrals':
        return <ReferralsPage />;
      case '/contracts/offers':
        return <OffersPage />;
      case '/contracts/messages':
        return <MessagesPage />;
      
      // Rotas de E-commerce
      case '/ecommerce/dashboard':
        return <EcommerceDashboard />;
      case '/ecommerce/products':
        return <ProductsPage />;
      case '/ecommerce/orders':
        return <OrdersPage />;
      case '/ecommerce/promotions':
        return <PromotionsPage />;
      case '/ecommerce/categories':
        return <CategoriesPage />;

      // Rota Global
      case '/users':
        return <UsersPage />;

      default:
        // Página não encontrada (pode ser uma página 404 no futuro)
        return <h1>Página não encontrada</h1>;
    }
  };

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <div className={`app-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        activeContext={activeContext}
        onContextChange={handleContextChange}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        activePath={currentPath}
        onLinkClick={handleNavigate}
      />
      <main className="content-area">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;