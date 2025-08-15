import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import './ContractsDashboard.css';

// --- Componente Customizado para Barras Arredondadas ---
const RoundedBar = (props) => {
  const { x, y, width, height, fill } = props;
  const radius = 8;
  return <path d={`M${x},${y + radius} A${radius},${radius} 0 0 1 ${x + radius},${y} L${x + width - radius},${y} A${radius},${radius} 0 0 1 ${x + width},${y + radius} L${x + width},${y + height} L${x},${y + height} Z`} fill={fill} />;
};

// --- Dados para Simulação ---
const kpiData = [
  { title: "Faturamento Mensal", value: "R$ 152.3k", change: "+8.1%", data: [{v:30},{v:40},{v:20},{v:50},{v:45},{v:60},{v:70}] },
  { title: "Contratos Ativos", value: "1.250", change: "+12%", data: [{v:10},{v:20},{v:15},{v:30},{v:25},{v:40},{v:35}] },
  { title: "Saques no Mês", value: "R$ 45.8k", change: "-3.2%", data: [{v:30},{v:20},{v:40},{v:35},{v:50},{v:40},{v:60}] },
  { title: "Ticket Médio", value: "R$ 1.8k", change: "+1.5%", data: [{v:20},{v:18},{v:25},{v:22},{v:30},{v:28},{v:35}] },
];

const barChartData = [
  { month: "Jan", Faturamento: 95 }, { month: "Fev", Faturamento: 110 }, { month: "Mar", Faturamento: 130 },
  { month: "Abr", Faturamento: 125 }, { month: "Mai", Faturamento: 140 }, { month: "Jun", Faturamento: 152 },
];

const sellersData = [
    { name: "Ana Silva", sales: 120000, goal: 150000, avatar: 'https://i.pravatar.cc/40?u=ana' },
    { name: "Carlos Souza", sales: 98000, goal: 150000, avatar: 'https://i.pravatar.cc/40?u=carlos' },
    { name: "Beatriz Lima", sales: 85000, goal: 150000, avatar: 'https://i.pravatar.cc/40?u=beatriz' },
    { name: "Lucas Costa", sales: 76000, goal: 150000, avatar: 'https://i.pravatar.cc/40?u=lucas' },
    { name: "Mariana Dias", sales: 62000, goal: 150000, avatar: 'https://i.pravatar.cc/40?u=mariana' },
];

const formatCurrency = (value) => `R$${value.toLocaleString('pt-BR')}`;

function ContractsDashboard() {
  return (
    <div className="dashboard-neumorph-container">
      <header className="dashboard-header-neumorph">
        <h1>Dashboard</h1>
        <p>Visão geral do desempenho dos contratos</p>
      </header>

      <section className="kpi-grid-neumorph">
        {kpiData.map((kpi, index) => (
          <div key={index} className="kpi-card-final-compact">
            <div className="kpi-border-neumorph"></div>
            <div className="kpi-content-neumorph">
              <span className="kpi-title-neumorph">{kpi.title}</span>
              <span className="kpi-value-neumorph">{kpi.value}</span>
              <span className={`kpi-change-neumorph ${kpi.change.startsWith('+') ? 'positive' : 'negative'}`}>{kpi.change}</span>
            </div>
            <div className="kpi-chart-neumorph">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpi.data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gradient-blue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </section>

      <section className="main-grid-neumorph">
        <div className="main-chart-card-neumorph">
          <h3 className="card-title-neumorph">Visão Geral do Faturamento</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barChartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(val) => `R$${val}k`} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="Faturamento" shape={<RoundedBar />} fill="#3b82f6" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="sellers-card-neumorph">
          <h3 className="card-title-neumorph">Melhores Vendedores</h3>
          <ul className="sellers-list-neumorph">
            {sellersData.map((seller, index) => (
                <li key={index}>
                    <img src={seller.avatar} alt={seller.name} className="seller-avatar-neumorph"/>
                    <div className="seller-info-neumorph">
                        <span>{seller.name}</span>
                        <div className="progress-bar-neumorph"><div className="progress-neumorph" style={{ width: `${(seller.sales / seller.goal) * 100}%` }}></div></div>
                    </div>
                    <span className="seller-sales-neumorph">{formatCurrency(seller.sales)}</span>
                </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default ContractsDashboard;