// ProtectedRoute.js (corrigido)
// import React from 'react';
// import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { useAuth } from "../../Context/AuthContext"

// export default function ProtectedRoute() {
//     const { isAuthenticated, isLoading } = useAuth();
//     const location = useLocation();

//     if (isLoading) {
//         return <div>Carregando...</div>;
//     }

//     if (!isAuthenticated) {
//         return <Navigate to="/login" state={{ from: location }} replace />;
//     }

//     return <Outlet />;
// }

import React from 'react';
import { Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
    // A lógica de autenticação foi removida temporariamente.
    // Isso permite o acesso direto às telas internas para trabalhar no estilo.
    return <Outlet />;
}