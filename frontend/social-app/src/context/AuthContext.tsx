import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { apiRequest } from "../services/api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from "../types/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (request: LoginRequest) => Promise<void>;

  register: (request: RegisterRequest) => Promise<void>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  async function loadCurrentUser() {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await apiRequest<User>("/auth/me");

      setUser(currentUser);
    } catch {
      localStorage.removeItem("accessToken");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(request: LoginRequest) {
    const response = await apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(request),
    });

    localStorage.setItem("accessToken", response.accessToken);

    setUser({
      userId: response.userId,
      username: response.username,
      email: response.email,
    });
  }

  async function register(request: RegisterRequest) {
    await apiRequest<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  function logout() {
    localStorage.removeItem("accessToken");
    setUser(null);
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}
