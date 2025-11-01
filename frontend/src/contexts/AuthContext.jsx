// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';

// const API_BASE = import.meta.env.VITE_API_BASE_URL

// console.log("API_BASE", API_BASE)

// const AuthContext = createContext();

// export function useAuth() {
//   return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   console.log("toekn", token)

//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       fetchCurrentUser();
//     } else {
//       setLoading(false);
//     }
//   }, [token]);

//   const fetchCurrentUser = async () => {
//     try {
//       const response = await axios.get(`${API_BASE}/users/me`);
//       setUser(response.data);
//     } catch (error) {
//       console.error('Failed to fetch user:', error);
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const login = async (username, password) => {
//   //   try {
//   //     const response = await axios.post(`${API_BASE}/login`, {
//   //       username,
//   //       password
//   //     });
      
//   //     const { access_token, user: userData } = response.data;
//   //     localStorage.setItem('token', access_token);
//   //     setToken(access_token);
//   //     setUser(userData);
//   //     axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
//   //     return { success: true };
//   //   } catch (error) {
//   //     return { 
//   //       success: false, 
//   //       error: error.response?.data?.detail || 'Login failed' 
//   //     };
//   //   }
//   // };



//   // login with username or email
//   // Updated login to accept { username?, email?, password }
//   const login = async (payload) => {
//     try {
//       const response = await axios.post(`${API_BASE}/login`, payload);

//       const { access_token, user: userData } = response.data;
//       localStorage.setItem('token', access_token);
//       setToken(access_token);
//       setUser(userData);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

//       return { success: true };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.response?.data?.detail || 'Login failed'
//       };
//     }
//   };



//   const register = async (username, email, password) => {
//     try {
//       await axios.post(`${API_BASE}/register`, {
//         username,
//         email,
//         password
//       });
      
//       return { success: true };
//     } catch (error) {
//       return { 
//         success: false, 
//         error: error.response?.data?.detail || 'Registration failed' 
//       };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//     setUser(null);
//     delete axios.defaults.headers.common['Authorization'];
//   };

//   const value = {
//     user,
//     login,
//     register,
//     logout,
//     loading
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }





import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set axios header when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Fetch current user info
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

  // Login function: accepts { username?, email?, password }
  const login = async (payload) => {
    try {
      const response = await axios.post(`${API_BASE}/login`, payload);
      const { access_token, user: userData } = response.data;

      // Save token and user immediately
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      return { success: true, user: userData, token: access_token };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed'
      };
    }
  };

  // Register
  const register = async (username, email, password) => {
    try {
      await axios.post(`${API_BASE}/register`, { username, email, password });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Registration failed'
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = { user, token, login, register, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
