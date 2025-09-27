// src/services/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_ROUTE,
});

// 1. INTERCEPTOR DE REQUISIÇÃO (Inteligente)
// Agora ele pega o token do lugar certo, seja qual for.
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("authTokenAdmin") ||
      sessionStorage.getItem("authTokenAdmin");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. INTERCEPTOR DE RESPOSTA (Para Refresh Token)
// Movido do AuthContext para cá, para centralizar a lógica.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken =
        localStorage.getItem("refreshTokenAdmin") ||
        sessionStorage.getItem("refreshTokenAdmin");

      if (!refreshToken) {
        // Se não há refresh token, desloga o usuário.
        // Usamos um evento customizado para evitar dependência circular com o AuthContext.
        window.dispatchEvent(new Event("forceLogout"));
        return Promise.reject(error);
      }

      try {
        // Usamos uma nova instância do axios aqui para evitar loop infinito no interceptor
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_ROUTE}auth/refresh`,
          {
            refreshToken,
          }
        );

        const { token: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        // Atualiza os tokens onde quer que eles estivessem
        if (localStorage.getItem("refreshTokenAdmin")) {
          localStorage.setItem("authTokenAdmin", newAccessToken);
          localStorage.setItem("refreshTokenAdmin", newRefreshToken);
        } else {
          sessionStorage.setItem("authTokenAdmin", newAccessToken);
          sessionStorage.setItem("refreshTokenAdmin", newRefreshToken);
        }

        // Tenta a requisição original novamente com o novo token
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        window.dispatchEvent(new Event("forceLogout"));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
