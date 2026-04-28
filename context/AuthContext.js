'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      api.get('/users/me')
        .then((res) => {
          setUser(res.data);
          // Redirect admin on app load if they're on wrong page
          if (res.data.role === 'admin' && typeof window !== 'undefined') {
            const path = window.location.pathname;
            if (path !== '/admin' && !path.startsWith('/admin/')) {
              router.replace('/admin');
            }
          }
        })
        .catch(() => {
          Cookies.remove('token');
          setLoading(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [router]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    Cookies.set('token', data.token, { expires: 30 });
    setUser(data);
    
    // Immediate redirect based on role
    if (data.role === 'admin') {
      router.replace('/admin');
    } else {
      router.replace('/');
    }
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    Cookies.set('token', data.token, { expires: 30 });
    setUser(data);
    
    // Regular users go home
    router.replace('/');
    return data;
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    router.replace('/login');
  };

  const setAuthUser = (updatedUser) => setUser(updatedUser);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);