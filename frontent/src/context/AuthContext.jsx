import { createContext, useState, useEffect, useContext } from "react";
import { registerUser, loginUser, fetchProfile } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);


  //------------------------Restore session on page refresh

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchProfile()
        .then(({data}) => {
          setUser(data.user);
        })
        .catch(() => {

          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // ── Login ──────────────────────────────────────────────────
  const login = async (email, password) => {
    const {data} = await loginUser({email, password});

    localStorage.setItem("token", data.token);
  

    setUser(data.user);

    return data.user;
  };

  // ── Register ───────────────────────────────────────────────
  const register = async (name, email, password) => {
    const { data } = await registerUser({name, email, password});

    localStorage.setItem("token", data.token);
    setUser(data.user);

    return data.user;
  };

  // ── Logout ─────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("token");

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


