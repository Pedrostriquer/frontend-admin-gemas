import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoadContext = createContext(null);

const API_URL = process.env.REACT_APP_BASE_ROUTE;

export const LoadProvider = ({ children }) => {
  const [loadState, setLoadState] = useState(false);

  const startLoading = () => {
    setLoadState(true);
  };
  const stopLoading = () => {
    setTimeout(() => {
      setLoadState(false);
    }, 400);
  };

  const value = {
    loadState,
    startLoading,
    stopLoading,
  };

  return <LoadContext.Provider value={value}>{children}</LoadContext.Provider>;
};

export const useLoad = () => {
  return useContext(LoadContext);
};
