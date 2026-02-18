/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  AUTH_LOGOUT_EVENT,
  getMe,
  login as apiLogin,
  setStoredToken,
  getStoredToken,
  type AuthUser,
  type LoginPayload,
} from "../services/api";

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  checked: boolean;
}

interface AuthContextValue extends AuthState {
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    checked: false,
  });
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setState({ user: null, loading: false, checked: true });
      return;
    }
    try {
      const user = await getMe();
      setState({ user, loading: false, checked: true });
    } catch {
      setStoredToken(null);
      setState({ user: null, loading: false, checked: true });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const onLogout = () => {
      setState({ user: null, loading: false, checked: true });
      navigate("/login", { replace: true });
    };
    window.addEventListener(AUTH_LOGOUT_EVENT, onLogout);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, onLogout);
  }, [navigate]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      setState((s) => ({ ...s, loading: true }));
      try {
        const res = await apiLogin(payload);
        setStoredToken(res.token);
        setState({ user: res.user, loading: false, checked: true });
        navigate("/admin", { replace: true });
      } finally {
        setState((s) => ({ ...s, loading: false }));
      }
    },
    [navigate]
  );

  const logout = useCallback(() => {
    setStoredToken(null);
    setState({ user: null, loading: false, checked: true });
    navigate("/login", { replace: true });
  }, [navigate]);

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
