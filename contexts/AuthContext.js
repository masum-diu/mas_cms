// contexts/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on initial load (client-side only)
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      // You might want to verify the token with your backend here
      setUser({ token });
    }
    setInitializing(false);
  }, []);

  // Store token and set user state. Do NOT redirect here — let pages control navigation.
  const login = (token) => {
    if (typeof window !== "undefined") localStorage.setItem("token", token);
    setUser({ token });
  };

  const logout = () => {
    if (typeof window !== "undefined") localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, initializing, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
