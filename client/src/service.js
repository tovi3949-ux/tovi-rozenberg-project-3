import axios from 'axios';

// הגדרת Config Defaults
// Production URL
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://todolist-srever.onrender.com';

// Interceptor להוספת JWT לכל בקשה
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ⭐ Interceptor לטיפול בשגיאת 401 ⭐
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // מחיקת Token ישן
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      
      // העברה לדף Login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default {
  // ⭐ Auth Services ⭐
  register: async (username, password) => {
    const result = await axios.post('/api/auth/register', {
      username,
      password
    });
    return result.data;
  },

  login: async (username, password) => {
    const result = await axios.post('/api/auth/login', {
      username,
      password
    });
    return result.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getUsername: () => {
    return localStorage.getItem('username');
  },

  // Todo Services
  getTasks: async () => {
    const result = await axios.get('/items');
    return result.data;
  },

  addTask: async (name) => {
    const result = await axios.post('/items', {
      name: name,
      isComplete: false
    });
    return result.data;
  },

  setCompleted: async (id, isComplete) => {
    const existingTask = await axios.get(`/items/${id}`);
    const result = await axios.put(`/items/${id}`, {
      name: existingTask.data.name,
      isComplete: isComplete
    });
    return result.data;
  },

  deleteTask: async (id) => {
    const result = await axios.delete(`/items/${id}`);
    return result.data;
  }
};