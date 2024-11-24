/*"use client";

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  const login = (token) => {
    localStorage.setItem("authToken", token);
    setAuthUser({ token });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthUser(null);
  };

  const register = (token) => {
    localStorage.setItem("authToken", token);
    setAuthUser({ token });
  };

  return (
    <AuthContext.Provider value={{ authUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);*/
