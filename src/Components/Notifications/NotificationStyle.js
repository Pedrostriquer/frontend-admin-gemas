const styles = {
  container: {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  toast: {
    // --- MUDANÇAS AQUI ---
    width: "350px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "16px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    borderLeft: "5px solid",
    animation: "slideIn 0.5s ease-out forwards",
    transition: "all 0.5s ease",
    color: "#fff",
    // Adicione essas propriedades para que ele pareça um botão, mas sem a cara de botão
    border: "none", // Remove a borda padrão do botão
    textAlign: "left", // Alinha o texto à esquerda
    cursor: "pointer", // Mantém a mãozinha para indicar que é clicável
    fontFamily: "inherit", // Usa a mesma fonte do resto da página
  },
  toastExiting: {
    transform: "translateX(120%)",
    opacity: 0,
  },
  clientToast: {
    backgroundColor: "#2563eb",
    borderColor: "#93c5fd",
  },
  contractToast: {
    backgroundColor: "#16a34a",
    borderColor: "#86efac",
  },
  withdrawalToast: {
    backgroundColor: "#f97316",
    borderColor: "#fdba74",
  },
  icon: {
    fontSize: "1.5rem",
  },
  content: {
    flexGrow: 1,
  },
  title: {
    margin: "0 0 4px 0",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  message: {
    margin: 0,
    fontSize: "0.9rem",
  },
  closeButton: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "1rem",
    cursor: "pointer",
    opacity: 0.7,
    padding: "5px", // Adiciona uma pequena área de clique
  },
};

export default styles;
