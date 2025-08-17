import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import './EcommerceDashboard.css';

// --- Componente Customizado para Barras Arredondadas (Reutilizado) ---
const RoundedBar = (props) => {
  const { x, y, width, height, fill } = props;
  const radius = 8;
  return <path d={`M${x},${y + radius} A${radius},${radius} 0 0 1 ${x + radius},${y} L${x + width - radius},${y} A${radius},${radius} 0 0 1 ${x + width},${y + radius} L${x + width},${y + height} L${x},${y + height} Z`} fill={fill} />;
};

// --- DADOS ESTÁTICOS PARA O E-COMMERCE ---
const kpiData = [
    { title: "Produtos Ativos", value: "850", change: "+15 novos", data: [{v:10},{v:15},{v:12},{v:20},{v:25},{v:22},{v:30}] },
    { title: "Vendas (Mês)", value: "1.274", change: "+18.2%", data: [{v:20},{v:25},{v:22},{v:35},{v:40},{v:38},{v:50}] },
    { title: "Carrinhos Abandonados", value: "98", change: "-5%", data: [{v:15},{v:12},{v:18},{v:14},{v:20},{v:16},{v:13}] },
    { title: "Ticket Médio", value: "R$ 215,50", change: "+3.5%", data: [{v:20},{v:18},{v:25},{v:22},{v:30},{v:28},{v:35}] },
];

const barChartData = [
  { month: "Jan", Faturamento: 88 }, { month: "Fev", Faturamento: 95 }, { month: "Mar", Faturamento: 112 },
  { month: "Abr", Faturamento: 105 }, { month: "Mai", Faturamento: 121 }, { month: "Jun", Faturamento: 135 },
];

const topProductsData = [
    { name: "Anel de Diamante 'Solitário'", sales: 312, price: "R$ 4.500,00", image: 'https://placehold.co/40x40/a78bfa/ffffff?text=Anel' },
    { name: "Colar de Esmeralda 'Gota'", sales: 258, price: "R$ 3.200,00", image: 'https://placehold.co/40x40/4ade80/ffffff?text=Colar' },
    { name: "Brincos de Safira 'Azul Real'", sales: 215, price: "R$ 2.850,00", image: 'https://placehold.co/40x40/60a5fa/ffffff?text=Brinco' },
    { name: "Pulseira de Rubi 'Eterna'", sales: 189, price: "R$ 3.550,00", image: 'https://placehold.co/40x40/f87171/ffffff?text=Pulseira' },
    { name: "Pingente de Opala 'Galáxia'", sales: 155, price: "R$ 1.800,00", image: 'https://placehold.co/40x40/c084fc/ffffff?text=Pingente' },
];


function EcommerceDashboard() {
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
          <h3 className="card-title-neumorph">Produtos Mais Vendidos</h3>
          <ul className="sellers-list-neumorph">
            {topProductsData.map((product, index) => (
                <li key={index}>
                    <img src={product.image} alt={product.name} className="seller-avatar-neumorph product-image"/>
                    <div className="seller-info-neumorph">
                        <span>{product.name}</span>
                        <span className="product-price-neumorph">{product.price}</span>
                    </div>
                    <span className="seller-sales-neumorph">{product.sales} vendas</span>
                </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default EcommerceDashboard;