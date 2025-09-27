// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoad } from "./LoadContext";
import api from "../dbServices/api/api"; // <-- IMPORTANTE: Importe sua instância 'api'

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("authTokenAdmin") ||
      sessionStorage.getItem("authTokenAdmin")
  );
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoad();

  // Função de logout centralizada
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authTokenAdmin");
    localStorage.removeItem("refreshTokenAdmin");
    sessionStorage.removeItem("authTokenAdmin");
    sessionStorage.removeItem("refreshTokenAdmin");
    navigate("/login");
  };

  // Efeito para buscar dados do usuário ao carregar
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          // Usa a instância 'api' que já tem o token configurado
          const response = await api.get("admin/me");
          setUser(response.data);
        } catch (error) {
          // O interceptor de resposta do api.js já vai tentar o refresh.
          // Se falhar mesmo assim, o evento 'forceLogout' será disparado.
          console.error("Falha na autenticação inicial", error);
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, [token]);

  // Efeito para escutar o evento de logout forçado do interceptor
  useEffect(() => {
    const handleForceLogout = () => {
      logout();
    };
    window.addEventListener("forceLogout", handleForceLogout);
    return () => {
      window.removeEventListener("forceLogout", handleForceLogout);
    };
  }, []);

  // Função de login simplificada
  const login = async (email, password, rememberMe = false) => {
    try {
      startLoading();
      // Usa a instância 'api' para a chamada de login
      const response = await api.post("auth/login/admin", {
        email,
        password,
        rememberMe,
      });
      const { token: newToken, refreshToken } = response.data;

      setToken(newToken);

      // Salva os tokens no local correto
      if (rememberMe) {
        localStorage.setItem("authTokenAdmin", newToken);
        localStorage.setItem("refreshTokenAdmin", refreshToken);
      } else {
        sessionStorage.setItem("authTokenAdmin", newToken);
        sessionStorage.setItem("refreshTokenAdmin", refreshToken);
      }

      // Busca os dados do usuário após o login bem-sucedido
      const userResponse = await api.get("admin/me");
      setUser(userResponse.data);
      navigate("/platform/dashboard");
    } catch (error) {
      throw error;
    } finally {
      stopLoading();
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
