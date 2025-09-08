import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { token } = useAuth();

  const removeNotification = useCallback((id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((n) => n.id !== id)
    );
  }, []);

  useEffect(() => {
    if (token) {
      // --- AJUSTE DE OURO NA URL ---
      // 1. Pega a URL base da API (ex: http://localhost:5097/api/)
      const baseApiUrl = process.env.REACT_APP_BASE_ROUTE;
      // 2. Transforma em um objeto URL para manipular com segurança
      const apiUrl = new URL(baseApiUrl);
      // 3. Cria a URL do Hub usando a base (protocolo + host), ignorando o /api
      const hubUrl = `${apiUrl.protocol}//${apiUrl.host}/notificationHub`;

      const connection = new HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .build();

      connection.on("ReceiveNotification", (notification) => {
        console.log("MIGA, CHEGOU NOTIFICAÇÃO! 🎉", notification); // Debug mais animado!

        const newNotification = {
          ...notification,
          id: Date.now() + Math.random(), // ID único para o React
        };
        // Adiciona a mais nova no topo!
        setNotifications((prev) => [newNotification, ...prev]);
      });

      connection
        .start()
        .then(() =>
          console.log("SignalR Conectado com sucesso na URL:", hubUrl)
        )
        .catch((err) => console.error("Falha na conexão com SignalR: ", err));

      return () => {
        connection.stop();
      };
    }
  }, [token]);

  return (
    <NotificationContext.Provider value={{ notifications, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
