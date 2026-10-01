import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Apunta a tu servidor Express
});

// Adjunta el token JWT en cada petición si el usuario ya inició sesión
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;