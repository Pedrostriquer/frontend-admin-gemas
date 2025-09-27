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
import { useLoad } from "../../../Context/LoadContext";
import { useAuth } from "../../../Context/AuthContext";
import ecommerceDashboardService from "../../../dbServices/ecommerceDashboardService";
import formatServices from "../../../formatServices/formatServices";

// --- Componente Customizado para Barras Arredondadas ---
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

// --- Dados Falsos para o Gráfico de Área (apenas para visual) ---
const mockAreaData = [
  { v: 10 },
  { v: 15 },
  { v: 12 },
  { v: 20 },
  { v: 25 },
  { v: 22 },
  { v: 30 },
];

function EcommerceDashboard() {
  const { startLoading, stopLoading } = useLoad();
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      setIsLoading(true);
      startLoading();
      try {
        const dashboardData = await ecommerceDashboardService.getDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error(
          "Falha ao carregar dados do dashboard de e-commerce:",
          error
        );
      } finally {
        setIsLoading(false);
        stopLoading();
      }
    };
    fetchData();
  }, [token]); // <-- Array de dependências estável (só depende do token)

  if (isLoading || !data) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Carregando dashboard...
      </div>
    );
  }

  // --- Mapeamento dos dados da API para o formato que os componentes esperam ---
  const kpiData = [
    {
      title: "Produtos Ativos",
      value: data.activeProductsCount.toLocaleString("pt-BR"),
      change: "Total na plataforma",
      data: mockAreaData,
    },
    {
      title: "Vendas (Total)",
      value: data.totalSalesCount.toLocaleString("pt-BR"),
      change: "Vendas concluídas",
      data: mockAreaData,
    },
    {
      title: "Carrinhos Abandonados",
      value: data.abandonedCarts.length.toLocaleString("pt-BR"),
      change: "Criados há >10 dias",
      data: mockAreaData,
    },
    {
      title: "Ticket Médio",
      value: formatServices.formatCurrencyBR(data.averageTicket),
      change: "Valor médio por venda",
      data: mockAreaData,
    },
  ];

  const barChartData = data.revenue.monthlyRevenue.map((item) => ({
    month: item.monthName.substring(0, 3),
    Faturamento: parseFloat((item.revenue / 1000).toFixed(1)),
  }));

  const topProductsData = data.bestSellingProducts.map((product) => ({
    name: product.productName,
    sales: product.totalSold,
    image: `https://placehold.co/40x40/a78bfa/ffffff?text=${encodeURIComponent(
      product.productName.substring(0, 2)
    )}`,
  }));

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
              <span className="kpi-change-neumorph">{kpi.change}</span>
            </div>
            <div className="kpi-chart-neumorph">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={kpi.data}
                  margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="gradient-blue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#gradient-blue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </section>

      <section className="main-grid-neumorph">
        <div className="main-chart-card-neumorph">
          <h3 className="card-title-neumorph">
            Faturamento Mensal (Ano Atual)
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={barChartData}
              margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis
                tickFormatter={(val) => `R$${val}k`}
                tickLine={false}
                axisLine={false}
              />
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
                formatter={(value) => [
                  `R$ ${formatServices.formatCurrencyBR(value * 1000)}`,
                  "Faturamento",
                ]}
              />
              <Bar
                dataKey="Faturamento"
                shape={<RoundedBar />}
                fill="#3b82f6"
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="sellers-card-neumorph">
          <h3 className="card-title-neumorph">Produtos Mais Vendidos</h3>
          <ul className="sellers-list-neumorph">
            {topProductsData.length > 0 ? (
              topProductsData.map((product, index) => (
                <li key={index}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="seller-avatar-neumorph product-image"
                  />
                  <div className="seller-info-neumorph">
                    <span>{product.name}</span>
                  </div>
                  <span className="seller-sales-neumorph">
                    {product.sales} vendas
                  </span>
                </li>
              ))
            ) : (
              <p style={{ textAlign: "center", color: "#718096" }}>
                Nenhum produto vendido ainda.
              </p>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default EcommerceDashboard;