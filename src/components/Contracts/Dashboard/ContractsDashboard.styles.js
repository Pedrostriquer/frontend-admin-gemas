const styles = {
  // Estilos da Página
  dashboardContainer: {
      fontFamily: "'Poppins', sans-serif",
  },
  dashboardHeader: {
      marginBottom: '32px',
  },
  headerH1: {
      fontSize: '2.25rem',
      fontWeight: 700,
      color: '#1a202c',
      margin: 0,
  },
  headerP: {
      fontSize: '1rem',
      color: '#718096',
      marginTop: '4px',
  },

  // Grid dos Cards
  kpiGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
      marginBottom: '32px',
  },
  mainGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '24px',
  },

  // Estilos Base dos Cards
  cardBase: {
      background: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.04)',
      transition: 'all 0.25s ease-in-out',
  },
  cardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.06)',
  },
  
  // Card KPI
  kpiCard: {
      display: 'flex',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      padding: '16px',
  },
  kpiBorder: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '5px',
      backgroundColor: '#3b82f6',
  },
  kpiContent: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingLeft: '15px',
  },
  kpiTitle: {
      fontSize: '0.8rem',
      fontWeight: 500,
      color: '#4a5568',
      marginBottom: '4px',
  },
  kpiValue: {
      fontSize: '1.4rem',
      fontWeight: 600,
      color: '#1a202c',
      marginBottom: '6px',
  },
  kpiChange: {
      fontSize: '0.8rem',
      fontWeight: 500,
  },
  kpiChangePositive: {
      color: '#10b981',
  },
  kpiChangeNegative: {
      color: '#ef4444',
  },
  kpiChart: {
      width: '70px',
      height: '45px',
      alignSelf: 'center',
      opacity: 0.8,
  },

  // Card Principal (Gráfico e Vendedores)
  mainChartCard: {
      padding: '28px',
  },
  sellersCard: {
      padding: '28px',
  },
  cardTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#2d3748',
      margin: '0 0 24px 0',
  },
  sellersList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
  },
  sellerItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
  },
  sellerAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
  },
  sellerInfo: {
      flexGrow: 1,
  },
  sellerName: {
      fontSize: '0.9rem',
      fontWeight: 500,
      color: '#2d3748',
      marginBottom: '8px',
      display: 'block',
  },
  sellerSales: {
      fontSize: '0.9rem',
      fontWeight: 600,
      color: '#1a202c',
  },
  progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderRadius: '4px',
      overflow: 'hidden',
  },
  progress: {
      height: '100%',
      backgroundColor: '#3b82f6',
      borderRadius: '4px',
  },
};

export default styles;