import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      JSON.parse(saved);
    } else {
      return null;
    }
    // return saved ? JSON.parse(saved) : null;
  });

  const login = (userData, token) => {
    setUser(userData); // Save in React state
    localStorage.setItem("user", JSON.stringify(userData)); // Save for reload
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
