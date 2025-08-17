import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const layoutStyles = {
  appContainer: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    backgroundColor: '#f8f9fa'
  },
  mainContent: {
    flex: 1,
    overflowY: 'auto',
    height: '100vh',
    paddingLeft: '280px', 
    paddingRight: '20px', 
    transition: 'padding-left 0.3s ease',
  },
  mainContentCollapsed: {
    paddingLeft: '88px', // Padding quando a sidebar está recolhida
  }
};

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentPath = location.pathname;
  const activeContext = currentPath.startsWith('/ecommerce') ? 'ecommerce' : 'platform';

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleContextChange = (context) => {
    const newPath = context === 'platform' ? '/platform/dashboard' : '/ecommerce/dashboard';
    handleNavigate(newPath);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const contentStyle = {
    ...layoutStyles.mainContent,
    ...(isSidebarCollapsed && layoutStyles.mainContentCollapsed)
  };

  return (
    <div style={layoutStyles.appContainer}>
      <Sidebar
        activeContext={activeContext}
        onContextChange={handleContextChange}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        activePath={currentPath}
        onLinkClick={handleNavigate}
      />
      <main style={contentStyle}>
        <Outlet />
      </main>
    </div>
  );
}