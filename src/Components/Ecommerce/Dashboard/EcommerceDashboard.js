import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./EcommerceDashboard.css";
import ecommerceServices from "../../../dbServices/ecommerceServices";
import { useAuth } from "../../../Context/AuthContext";
import { useLoad } from "../../../Context/LoadContext";
import { useNavigate } from "react-router-dom";

// --- Componente Customizado para Barras Arredondadas (Reutilizado) ---
const RoundedBar = (props) => {
  const { x, y, width, height, fill } = props;
  const radius = 8;
  return (
    <path
      d={`M${x},${y + radius} A${radius},${radius} 0 0 1 ${x + radius},${y} L${
        x + width - radius
      },${y} A${radius},${radius} 0 0 1 ${x + width},${y + radius} L${
        x + width
      },${y + height} L${x},${y + height} Z`}
      fill={fill}
    />
  );
};

// --- Funções de formatação (Reutilizadas) ---
const formatCurrency = (value) => {
  if (value === null || value === undefined) return "R$ 0,00";
  return `R$${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const monthNumberToName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString("pt-BR", { month: "short" });
};

function EcommerceDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  const { startLoading, stopLoading } = useLoad();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        startLoading();
        const dashboardData = await ecommerceServices.getDashboardData(token);
        setData(dashboardData);
      } catch (error) {
        console.error("Falha ao buscar dados do dashboard de e-commerce:", error);
      } finally {
        setIsLoading(false);
        stopLoading();
      }
    };
    fetchData();
  }, [token]);

  if (isLoading) {
    return <div>Carregando dados do dashboard...</div>;
  }

  if (!data) {
    return (
      <div>Não foi possível carregar os dados. Tente novamente mais tarde.</div>
    );
  }

  const kpiData = [
    { title: "Produtos Ativos", value: data.activeProductsCount || "0", data: [ { v: 10 }, { v: 15 }, { v: 12 }, { v: 20 } ] },
    { title: "Vendas (Mês)", value: data.totalSalesCount || "0", data: [ { v: 20 }, { v: 25 }, { v: 22 }, { v: 35 } ] },
    { title: "Carrinhos Abandonados", value: data.abandonedCarts?.length || "0", data: [ { v: 15 }, { v: 12 }, { v: 18 }, { v: 14 } ] },
    { title: "Ticket Médio", value: formatCurrency(data.averageTicket), data: [ { v: 20 }, { v: 18 }, { v: 25 }, { v: 22 } ] },
  ];

  const barChartData = data.revenue?.monthlyRevenue?.map((item) => ({
    month: monthNumberToName(item.month),
    Faturamento: item.revenue / 1000,
  }));

  const topProductsData = data.bestSellingProducts;
  
  const goToProduct = (productId) => {
    navigate(`/platform/products/${productId}`);
  }

  return (
    <div className="dashboard-neumorph-container">
      <header className="dashboard-header-neumorph">
        <h1>Dashboard E-commerce</h1>
        <p>Visão geral de desempenho da loja</p>
      </header>

      <section className="kpi-grid-neumorph">
        {kpiData.map((kpi, index) => (
          <div key={index} className="kpi-card-final-compact">
            <div className="kpi-border-neumorph"></div>
            <div className="kpi-content-neumorph">
              <span className="kpi-title-neumorph">{kpi.title}</span>
              <span className="kpi-value-neumorph">{kpi.value}</span>
            </div>
            <div className="kpi-chart-neumorph">
              {kpi.data && kpi.data.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={kpi.data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gradient-blue)"/>
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="main-grid-neumorph">
        <div className="main-chart-card-neumorph">
          <h3 className="card-title-neumorph">Visão Geral do Faturamento</h3>
          {barChartData && barChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={barChartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(val) => `R$${val}k`} tickLine={false} axisLine={false}/>
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    padding: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => `${formatCurrency(value * 1000)}`}
                />
                <Bar dataKey="Faturamento" shape={<RoundedBar />} fill="#3b82f6" barSize={30}/>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <p>Não há dados de faturamento para exibir.</p>
            </div>
          )}
        </div>

        <div className="sellers-card-neumorph">
          <h3 className="card-title-neumorph">Produtos Mais Vendidos</h3>
          <ul className="sellers-list-neumorph">
            {topProductsData?.map((product) => (
              <li key={product.productId} onClick={() => goToProduct(product.productId)} style={{cursor: 'pointer'}}>
                <img
                  src={`https://placehold.co/40x40/a78bfa/ffffff?text=${product.productName.substring(0,2).toUpperCase()}`}
                  alt={product.productName}
                  className="seller-avatar-neumorph product-image"
                />
                <div className="seller-info-neumorph">
                  <span>{product.productName}</span>
                </div>
                <span className="seller-sales-neumorph">
                  {product.totalSold} vendas
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default EcommerceDashboard;