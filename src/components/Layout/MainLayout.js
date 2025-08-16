// MainLayout.js
import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const layoutStyles = {
  mainContent: {
    padding: '24px',
    transition: 'margin-left 0.3s ease',
    marginLeft: '260px', 
  },
  mainContentCollapsed: {
    marginLeft: '88px',
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
    <div> 
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