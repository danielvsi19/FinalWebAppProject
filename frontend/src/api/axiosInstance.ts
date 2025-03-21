import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("token")!);

    if (token) {
      config.headers.Authorization = `authorization ${token}`;
    };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;