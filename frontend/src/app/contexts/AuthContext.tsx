import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { auth as authApi } from "../../lib/api";

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("auth_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("auth_token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (!storedToken || !storedUser) {
      setIsLoading(false);
      return;
    }

    // Optimistically restore the session from storage...
    setToken(storedToken);
    setUser(JSON.parse(storedUser));

    // ...then confirm the token is still valid with the backend. An expired or
    // stale token (e.g. after a JWT_SECRET change) returns 401, which the axios
    // interceptor handles by clearing storage and redirecting to /login — so the
    // user is sent to login at startup instead of being kicked out mid-action.
    authApi
      .verify()
      .then((data) => {
        if (data?.user) {
          localStorage.setItem("auth_user", JSON.stringify(data.user));
          setUser(data.user);
        }
      })
      .catch(() => {
        // Network/other transient errors: keep the optimistic session as-is.
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/login";
    }
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#004274] to-[#002847]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
}
