import axios from "axios";
const instance = axios.create({
  // baseURL: "https://tst.etherstaging.xyz/api",
  baseURL: "http://localhost:8000/api",
  // baseURL: "https://msb.etherstaging.xyz/api",

  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

// Attach token from localStorage to each request if present
instance.interceptors.request.use(
  (config) => {
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (e) {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
