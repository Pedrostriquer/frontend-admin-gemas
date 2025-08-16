// MainLayout.js
import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";


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

  return (
    <div className={`app-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        // --- PROPS QUE FALTAVAM ---
        activeContext={activeContext}
        onContextChange={handleContextChange}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        activePath={currentPath}
        onLinkClick={handleNavigate} // A estrela do show!
      />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}