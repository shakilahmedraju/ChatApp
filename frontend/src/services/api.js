import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API methods
export const authAPI = {
  login: (username, password) => api.post('/login', { username, password }),
  register: (username, email, password) => api.post('/register', { username, email, password }),
  getCurrentUser: () => api.get('/users/me'),
};

export const usersAPI = {
  getUsers: () => api.get('/users'),
};

export const conversationsAPI = {
  getConversations: () => api.get('/conversations'),
  getConversation: (id) => api.get(`/conversations/${id}`),
  createConversation: (data) => api.post('/conversations', data),
  // getMessages: (conversationId) => api.get(`/conversations/${conversationId}/messages`),

  /**
   * Fetch messages for a conversation with pagination.
   * @param {number} conversationId - ID of the conversation
   * @param {number} limit - number of messages to fetch (default 50)
   * @param {number} skip - number of messages to skip (for pagination)
   */
  getMessages: (conversationId, limit = 50, skip = 0) =>
    api.get(`/conversations/${conversationId}/messages`, {
      params: { limit, skip },
    }),
  
};



export default api;