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
import styles from "./ContractsDashboardStyle.js";
import platformServices from "../../../dbServices/platformServices.js";
import { useAuth } from "../../../Context/AuthContext.js";
import ImageWithLoader from "../ImageWithLoader/ImageWithLoader.js";
import { useNavigate } from "react-router-dom";

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

const formatCurrency = (value) => {
  if (value === null || value === undefined) return "R$ 0,00";
  return `R$${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatCurrencyShort = (value) => {
  if (!value) return "R$ 0";
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
  return `R$ ${value.toFixed(0)}`;
};

const monthNumberToName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString("pt-BR", { month: "short" });
};

function ContractsDashboard() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        setIsLoading(true);
        const dashboardData = await platformServices.getDashboardData(token);
        setData(dashboardData);
      } catch (error) {
        console.error("Falha ao buscar dados do dashboard:", error);
      } finally {
        setIsLoading(false);
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
    {
      title: "Faturamento Mensal",
      value: formatCurrencyShort(data.actualMonthlyIncome?.value),
      data: data.lastMonthsIncomes?.map((item) => ({ v: item.value })) || [],
    },
    {
      title: "Contratos Ativos",
      value: data.activeContracts || 0,
      data: [
        { v: 10 },
        { v: 20 },
        { v: 15 },
        { v: 30 },
        { v: 25 },
        { v: 40 },
        { v: 35 },
      ],
    },
    {
      title: "Saques no Mês",
      value: formatCurrencyShort(data.monthlyWithdraw),
      data: [
        { v: 30 },
        { v: 20 },
        { v: 40 },
        { v: 35 },
        { v: 50 },
        { v: 40 },
        { v: 60 },
      ],
    },
    {
      title: "Ticket Médio",
      value: formatCurrencyShort(data.mediumTicket),
      data: [
        { v: 20 },
        { v: 18 },
        { v: 25 },
        { v: 22 },
        { v: 30 },
        { v: 28 },
        { v: 35 },
      ],
    },
  ];

  const barChartData = data.lastMonthsIncomes
    ?.map((item) => ({
      month: monthNumberToName(item.month),
      Faturamento: item.value / 1000,
    }))
    .reverse();

  const topClientGoal = data.bestClients?.[0]?.amount || 1;

  // http://localhost:3000/platform/clients/1

  const goToClient = (id) => {
    navigate(`/platform/clients/${id}`);
  }

  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.dashboardHeader}>
        <h1 style={styles.headerH1}>Dashboard</h1>
        <p style={styles.headerP}>Visão geral do desempenho dos contratos</p>
      </header>

      <section style={styles.kpiGrid}>
        {kpiData.map((kpi, index) => (
          <div
            key={index}
            style={{
              ...styles.cardBase,
              ...styles.kpiCard,
              ...(hoveredCard === `kpi-${index}` && styles.cardHover),
            }}
            onMouseEnter={() => setHoveredCard(`kpi-${index}`)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.kpiBorder}></div>
            <div style={styles.kpiContent}>
              <span style={styles.kpiTitle}>{kpi.title}</span>
              <span style={styles.kpiValue}>{kpi.value}</span>
            </div>
            <div style={styles.kpiChart}>
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

      <section style={styles.mainGrid}>
        <div
          style={{
            ...styles.cardBase,
            ...styles.mainChartCard,
            ...(hoveredCard === "chart" && styles.cardHover),
          }}
          onMouseEnter={() => setHoveredCard("chart")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <h3 style={styles.cardTitle}>Visão Geral do Faturamento</h3>
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
                formatter={(value) => `${formatCurrency(value * 1000)}`}
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

        <div
          style={{
            ...styles.cardBase,
            ...styles.sellersCard,
            ...(hoveredCard === "sellers" && styles.cardHover),
          }}
          onMouseEnter={() => setHoveredCard("sellers")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <h3 style={styles.cardTitle}>Melhores Clientes</h3>
          <ul style={styles.sellersList}>
            {data.bestClients?.map((client, index) => (
              <li onClick={() => goToClient(client.id)} key={index} style={styles.sellerItem}>
                <ImageWithLoader
                  src={
                    client.profilePictureUrl ||
                    process.env.REACT_APP_DEFAULT_PROFILE_PICTURE
                  }
                  alt={client.name}
                  style={styles.sellerAvatar}
                />{" "}
                <div style={styles.sellerInfo}>
                  <span style={styles.sellerName}>{client.name}</span>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progress,
                        width: `${(client.amount / topClientGoal) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <span style={styles.sellerSales}>
                  {formatCurrency(client.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default ContractsDashboard;
