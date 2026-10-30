import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { logout } from "../api/authApi";

const STORAGE_KEY = "aurum_user";
const AuthContext = createContext(null);

function readUser() {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);

  const signIn = useCallback((nextUser, remember = false) => {
    const keep = remember ? localStorage : sessionStorage;
    const drop = remember ? sessionStorage : localStorage;
    drop.removeItem(STORAGE_KEY);
    keep.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logout();
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), signIn, signOut }),
    [user, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
