import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;