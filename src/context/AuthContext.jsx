import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/api";

export const AuthContext = createContext(null);

// 🔥 CUSTOM HOOK
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // API.get("/users/me")
    //   .then(res => {
    //     setUser(res.data);
    //     setLoading(false);
    //   })
    //   .catch(() => {
    //     setUser(null);
    //     setToken(null);
    //     // localStorage.removeItem("token");
    //     // alert("please connect Internet...")
    //     setLoading(false);
    //   });
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
