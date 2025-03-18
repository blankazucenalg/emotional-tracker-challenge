import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import axios from 'axios';
import { resetAlerts } from '../lib/alertNotifications';

// API URL
const API_URL = 'http://localhost:5050/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    const res = await axios.post(`${API_URL}/users/register`, userData);

    setUser(res.data);
    Cookie.set('token', res.data.token);

    router.push('/dashboard');
  };

  // Login user
  const login = async (userData) => {
    const res = await axios.post(`${API_URL}/users/login`, userData);

    setUser(res.data);
    Cookie.set('token', res.data.token);

    router.push('/dashboard');
  };

  // Logout user
  const logout = () => {
    Cookie.remove('token');
    setUser(null);
    resetAlerts();
    router.push('/');
  };

  // Check if user is logged in
  const checkUserLoggedIn = async () => {
    const token = Cookie.get('token');

    if (token) {
      try {
        const res = await axios.get(`${API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(res.data);
      } catch (error) {
        Cookie.remove('token');
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  };

  const updateProfile = async (userData) => {
    const token = Cookie.get('token');

    if (token) {
      const res = await axios.put(`${API_URL}/users/profile`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser(res.data);
      return res.data;
    }

    return null;
  };

  const updatePassword = async (userData) => {
    const token = Cookie.get('token');

    if (token) {
      const res = await axios.put(`${API_URL}/users/updatePassword`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser(res.data);
      return res.data;
    }

    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};