import React from 'react';
import EcommerceDashboard from './Dashboard/EcommerceDashboard';
import PromotionsPage from './Promotions/PromotionsPage';
import ProductsPage from './Products/ProductsPage';
import CategoriesPage from './Categories/CategoriesPage';
import OrdersPage from './Orders/OrdersPage'; // 1. Importe a nova página

function Ecommerce({ activePage }) {
  switch (activePage) {
    case 'Promoções':
      return <PromotionsPage />;
    case 'Produtos':
      return <ProductsPage />;
    case 'Categorias':
      return <CategoriesPage />;
    // 2. Adicione o novo case para a página de pedidos
    case 'Pedidos':
      return <OrdersPage />;
    case 'Dashboard':
    default:
      return <EcommerceDashboard />;
  }
}

export default Ecommerce;