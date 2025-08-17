import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login/Login";
import { LoadProvider } from "./Context/LoadContext";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import MainLayout from "./Components/Layout/MainLayout";
import UserProfile from "./Components/UserProfile/UserProfile";
import ContractsDashboard from "./Components/Platform/Dashboard/ContractsDashboard";
import ClientsPage from "./Components/Platform/Clients/ClientsPage";
import ContractsPage from "./Components/Platform/Contracts/ContractsPage";
import ContractDetailPage from "./Components/Platform/Contracts/ContractDetailPage/ContractDetailPage";
import WithdrawalsPage from "./Components/Platform/Withdraws/WithdrawalsPage";
import WithdrawDetailPage from "./Components/Platform/Withdraws/WithdrawDetailPage/WithdrawDetailPage";
import CreateWithdrawalPage from "./Components/Platform/Withdraws/CreateWithdrawalPage/CreateWithdrawalPage"; // Importe a nova página
import ControllerPage from "./Components/Platform/Controller/ControllerPage";
import ReferralsPage from "./Components/Platform/Indication/ReferralsPage";
import OffersPage from "./Components/Platform/Offers/OffersPage";
import Messages from "./Components/Platform/Messages/MessagesPage";
import CreateClientPage from "./Components/Platform/Clients/CreateClientPage/CreateClientPage";
import ClientDetailPage from "./Components/Platform/Clients/ClientDetailPage/ClientDetailPage";

function App() {
  return (
    <BrowserRouter>
      <LoadProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route index element={<Navigate to="/platform/dashboard" />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="platform/dashboard" element={<ContractsDashboard />} />
                <Route path="platform/clients" element={<ClientsPage />} />
                <Route path="platform/contracts" element={<ContractsPage />} />
                <Route path="platform/contracts/:contractId" element={<ContractDetailPage />} />
                <Route path="platform/withdraws" element={<WithdrawalsPage />} />
                <Route path="platform/withdraws/create" element={<CreateWithdrawalPage />} />
                <Route path="platform/withdraws/:withdrawalId" element={<WithdrawDetailPage />} />
                <Route path="platform/controller" element={<ControllerPage />} />
                <Route path="platform/indication" element={<ReferralsPage />} />
                <Route path="platform/offers" element={<OffersPage />} />
                <Route path="platform/messages" element={<Messages />} />
                <Route path="clients/create" element={<CreateClientPage />} />
                <Route path="clients/:clientId" element={<ClientDetailPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </LoadProvider>
    </BrowserRouter>
  );
}

export default App;