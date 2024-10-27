import { createContext, useContext, useState, useEffect } from "react";
import { fetcher } from "../fetcher/fetcher";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(user);
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetchUserData();
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetcher.get("/auth/me");
      setUser(response.data);
      return response.data;
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetcher.post("/auth/login", credentials);
      const { access_token, refresh_token } = response.data;

      localStorage.setItem("token", JSON.stringify(access_token));
      localStorage.setItem("refresh_token", JSON.stringify(refresh_token));

      const userData = await fetchUserData();
      return userData;
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  const hasRole = (requiredRoles) => {
    if (!user) return false;
    if (!requiredRoles) return true;
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        hasRole,
        refreshUser: fetchUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
