import axios from "axios";
import { createContext, useContext, useState } from "react";

interface AuthProp {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (email: string, password: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "my-jwt";
export const API_URL = "https://api.developbetterapps.com";
const AuthContext = createContext<AuthProp>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ Children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  const register = async (email: string, password: string) => {
    try {
      return await axios.post(`${API_URL}/users`, { email, password });
    } catch (e) {
      return { error: true, msg: (e as any).response.data.msg };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/auth`, { email, password });

      console.log("Result: ", result);

      setAuthState({
        token: result.data.token,
        authenticated: true,
      });

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${result.data.token}`;
    } catch (e) {
      return { error: true, msg: (e as any).response.data.msg };
    }
  };

  const value = {
    onRegister: register,
  };

  return <AuthContext.Provider value={value}>{Children}</AuthContext.Provider>;
};
