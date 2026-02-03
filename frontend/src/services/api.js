import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

/*
|--------------------------------------------------------------------------
| Global response error handling
|--------------------------------------------------------------------------
*/
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      return Promise.reject({
        message: error.response.data?.message || "Request failed",
        errors: error.response.data?.errors || []
      });
    }

    return Promise.reject({
      message: "Network error. Please try again."
    });
  }
);

export default api;
