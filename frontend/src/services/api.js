import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Interceptor para pegar el token automáticamente en cada pedido
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");
  const sectorToken = localStorage.getItem("token");

  if (config.url.startsWith("/admin")) {
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  } else {
    if (sectorToken) {
      config.headers.Authorization = `Bearer ${sectorToken}`;
    }
  }

  return config;
});


export default api;