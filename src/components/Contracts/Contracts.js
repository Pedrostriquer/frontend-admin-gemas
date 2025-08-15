import React from 'react';
import ContractsDashboard from './Dashboard/ContractsDashboard';
import ClientsPage from './Clients/ClientsPage';
import ContractsPage from './ContractsList/ContractsPage';
import WithdrawalsPage from './Withdrawals/WithdrawalsPage';
import ControllerPage from './Controller/ControllerPage';
import ReferralsPage from './Referrals/ReferralsPage';
import OffersPage from './Offers/OffersPage';
import MessagesPage from './Messages/MessagesPage'; // 1. Importe a nova página

function Contracts({ activePage }) {
  switch (activePage) {
    case 'Clientes':
      return <ClientsPage />;
    case 'Contratos':
      return <ContractsPage />;
    case 'Saques':
      return <WithdrawalsPage />;
    case 'Controlador':
      return <ControllerPage />;
    case 'Indicação':
      return <ReferralsPage />;
    case 'Ofertas':
      return <OffersPage />;
    // 2. Adicione o novo case para a página de mensagens
    case 'Mensagens':
      return <MessagesPage />;
    case 'Dashboard':
    default:
      return <ContractsDashboard />;
  }
}

export default Contracts;