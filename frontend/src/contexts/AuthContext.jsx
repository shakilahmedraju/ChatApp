import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  console.log("toekn", token)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_BASE}/users/me`);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // const login = async (username, password) => {
  //   try {
  //     const response = await axios.post(`${API_BASE}/login`, {
  //       username,
  //       password
  //     });
      
  //     const { access_token, user: userData } = response.data;
  //     localStorage.setItem('token', access_token);
  //     setToken(access_token);
  //     setUser(userData);
  //     axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
  //     return { success: true };
  //   } catch (error) {
  //     return { 
  //       success: false, 
  //       error: error.response?.data?.detail || 'Login failed' 
  //     };
  //   }
  // };



  // login with username or email
  // Updated login to accept { username?, email?, password }
  const login = async (payload) => {
    try {
      const response = await axios.post(`${API_BASE}/login`, payload);

      const { access_token, user: userData } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed'
      };
    }
  };



  const register = async (username, email, password) => {
    try {
      await axios.post(`${API_BASE}/register`, {
        username,
        email,
        password
      });
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}