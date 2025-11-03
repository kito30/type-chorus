import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../services/auth';
import { AuthContext } from './AuthContextType';
import { login as apiLogin, register as apiRegister, getMe } from '../services/auth';

const TOKEN_KEY = 'typechorus_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (savedToken) {
      // Verify token is still valid by fetching user
      getMe(savedToken)
        .then((data) => {
          setUser(data.user);
          setToken(savedToken);
        })
        .catch(() => {
          // Token invalid or expired, clear it
          localStorage.removeItem(TOKEN_KEY);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem(TOKEN_KEY, data.token);
  };

  const register = async (email: string, username: string, password: string) => {
    const data = await apiRegister(email, username, password);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem(TOKEN_KEY, data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

