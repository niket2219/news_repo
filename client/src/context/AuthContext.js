import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("newsAdmin");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        // Check if the stored token has expired
        if (data.expiresAt && new Date() < new Date(data.expiresAt)) {
          setUser(data);
        } else {
          // Token expired, remove it
          localStorage.removeItem("newsAdmin");
        }
      } catch (e) {
        localStorage.removeItem("newsAdmin");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Set expiration to 7 days from now
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const dataWithExpiry = { ...userData, expiresAt: expiresAt.toISOString() };
    setUser(dataWithExpiry);
    localStorage.setItem("newsAdmin", JSON.stringify(dataWithExpiry));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("newsAdmin");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
