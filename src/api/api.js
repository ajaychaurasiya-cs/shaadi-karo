import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// ✅ REQUEST — token attach
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE — auto logout on 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 🔥 clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("theme");

      // optional: clear everything
      // localStorage.clear();

      // 🔁 redirect to login
      //  (window.location.href = "/login");
    }
    return Promise.reject(error);
  }
);

export default API;
