import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // use NEXT_PUBLIC_* for frontend env access
  // withCredentials: true,
  timeout: 240000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized - clear auth state and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        
        // Get current URL for redirect parameter
        const currentUrl = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";
        const redirectUrl = encodeURIComponent(currentUrl);
        
        // Import auth store and clear it
        import("@/lib/store/auth").then(({ useAuth }) => {
          useAuth.setState({ user: null, accessToken: null });
        });
        
        // Redirect to login with current URL as redirect parameter
        window.location.href = `/login?redirect=${redirectUrl}`;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
