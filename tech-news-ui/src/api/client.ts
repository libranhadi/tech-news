import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.BACKEND_API_URL || 'http://localhost:8000/api',
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    }
    return Promise.reject(error);
  }
);

export default apiClient;