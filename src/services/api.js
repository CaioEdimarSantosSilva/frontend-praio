import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem('praio_user');
    if (raw) {
      try {
        const user = JSON.parse(raw);
        if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
      } catch {
        // invalid storage value — ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
