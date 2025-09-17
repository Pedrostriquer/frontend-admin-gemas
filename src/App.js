// src/App.js

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// CONTEXTOS
import { LoadProvider, useLoad } from "./Context/LoadContext";
import { AuthProvider } from "./Context/AuthContext";
import { NotificationProvider } from "./Context/NotificationContext";

// ✨ NOSSO LOADING DOS DEUSES ✨
import LoadingGemas from "./Components/LoadingGemas/LoadingGemas";

// LAYOUTS E ROTAS PROTEGIDAS
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import MainLayout from "./Components/Layout/MainLayout";

// PÁGINAS (todos os seus imports originais)
import Login from "./Components/Login/Login";
import UserProfile from "./Components/UserProfile/UserProfile";
import UsersPage from "./Components/Users/UsersPage";
import ExtractData from "./Components/ExtractData/ExtractData";
import ContractsDashboard from "./Components/Platform/Dashboard/ContractsDashboard";
import ClientsPage from "./Components/Platform/Clients/ClientsPage";
import ClientDetailPage from "./Components/Platform/Clients/ClientDetailPage/ClientDetailPage";
import CreateClientPage from "./Components/Platform/Clients/CreateClientPage/CreateClientPage";
import ConsultantsPage from "./Components/Platform/Consultants/ConsultantsPage";
import ConsultantDetailPage from "./Components/Platform/Consultants/ConsultantDetailPage/ConsultantDetailPage";
import CreateConsultantPage from "./Components/Platform/Consultants/CreateConsultantPage/CreateConsultantPage";
import ContractsPage from "./Components/Platform/Contracts/ContractsPage";
import ContractDetailPage from "./Components/Platform/Contracts/ContractDetailPage/ContractDetailPage";
import WithdrawalsPage from "./Components/Platform/Withdraws/WithdrawalsPage";
import WithdrawDetailPage from "./Components/Platform/Withdraws/WithdrawDetailPage/WithdrawDetailPage";
import CreateWithdrawalPage from "./Components/Platform/Withdraws/CreateWithdrawalPage/CreateWithdrawalPage";
import ControllerPage from "./Components/Platform/Controller/ControllerPage";
import ReferralsPage from "./Components/Platform/Indication/ReferralsPage";
import OffersPage from "./Components/Platform/Offers/OffersPage";
import MessagesPage from "./Components/Messages/MessagesPage";
import EcommerceDashboard from "./Components/Ecommerce/Dashboard/EcommerceDashboard";
import ProductsPage from "./Components/Ecommerce/Products/ProductsPage";
import OrdersPage from "./Components/Ecommerce/Orders/OrdersPage";
import PromotionsPage from "./Components/Ecommerce/Promotions/PromotionsPage";
import CategoriesPage from "./Components/Ecommerce/Categories/CategoriesPage";
import FormsPage from "./Components/Ecommerce/Forms/FormsPage";
import PersonalizadasManager from "./Components/SiteConfig/Personalizadas/PersonalizadasManager";
import HomeManager from "./Components/SiteConfig/Home/HomeManager";
import GemCashManager from "./Components/SiteConfig/GemCash/GemCashManager";

// ✨ MUDANÇA PRINCIPAL: CRIAMOS ESTE COMPONENTE INTERNO ✨
// Ele vive DENTRO dos providers, então pode usar os hooks de contexto sem erro.
const AppContent = () => {
  const { loadState } = useLoad();

  return (
    <>
      {/* O loading agora é controlado pelo estado global do seu LoadContext! */}
      <LoadingGemas isLoading={loadState} text="Forjando as Gemas..." />

      <Routes>
        {/* Rota de Login da Plataforma */}
        <Route path="/login" element={<Login />} />

        {/* Rotas Protegidas do Painel de Administração */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<Navigate to="/platform/dashboard" />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="extract-data" element={<ExtractData />} />

            {/* Rotas da Plataforma */}
            <Route path="platform/dashboard" element={<ContractsDashboard />} />
            <Route path="platform/clients" element={<ClientsPage />} />
            <Route path="platform/clients/:clientId" element={<ClientDetailPage />} />
            <Route path="platform/consultants" element={<ConsultantsPage />} />
            <Route path="platform/consultants/create" element={<CreateConsultantPage />} />
            <Route path="platform/consultants/:consultantId" element={<ConsultantDetailPage />} />
            <Route path="platform/contracts" element={<ContractsPage />} />
            <Route path="platform/contracts/:contractId" element={<ContractDetailPage />} />
            <Route path="platform/withdraws" element={<WithdrawalsPage />} />
            <Route path="platform/withdraws/create" element={<CreateWithdrawalPage />} />
            <Route path="platform/withdraws/:withdrawalId" element={<WithdrawDetailPage />} />
            <Route path="platform/controller" element={<ControllerPage />} />
            <Route path="platform/indication" element={<ReferralsPage />} />
            <Route path="platform/offers" element={<OffersPage />} />
            <Route path="platform/messages" element={<MessagesPage />} />
            <Route path="clients/create" element={<CreateClientPage />} />

            {/* Rotas do E-commerce Admin */}
            <Route path="ecommerce/dashboard" element={<EcommerceDashboard />} />
            <Route path="ecommerce/products" element={<ProductsPage />} />
            <Route path="ecommerce/orders" element={<OrdersPage />} />
            <Route path="ecommerce/promotions" element={<PromotionsPage />} />
            <Route path="ecommerce/categories" element={<CategoriesPage />} />
            <Route path="ecommerce/forms" element={<FormsPage />} />

            {/* Rotas de Configuração do Site Admin */}
            <Route path="site/home" element={<HomeManager />} />
            <Route path="site/gemcash" element={<GemCashManager />} />
            <Route path="site/personalizadas" element={<PersonalizadasManager />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

function App() {
  // A função App agora só organiza os providers. Chique e limpo.
  return (
    <BrowserRouter>
      <LoadProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </AuthProvider>
      </LoadProvider>
    </BrowserRouter>
  );
}

export default App;