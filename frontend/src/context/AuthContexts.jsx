import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true); // initial loading on mount
  const [isLogin, setIsLogin] = useState(false);

  // Set Axios default header when token changes
  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  // Fetch user on token mount
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
      setIsLogin(false);
    }
  }, [token]);

  // Fetch student if user has scholarId
  useEffect(() => {
    if (user?.scholarId) {
      getStudent();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/users/current-user");
      if (response.data.success) {
        setUser(response.data.data);
        setIsLogin(true);
      } else {
        handleInvalidToken();
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      if (error.response?.status === 401) {
        handleInvalidToken();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInvalidToken = () => {
    setToken("");
    setUser(null);
    setIsLogin(false);
    localStorage.removeItem("token");
    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/login", credentials);
      const { user, accessToken } = response.data.data;

      setUser(user);
      setToken(accessToken);
      localStorage.setItem("token", accessToken);
      setIsLogin(true);
      toast.success("Logged in successfully");
      navigate("/");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return { success: false, error: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/register", userData);
      const { user, accessToken } = response.data.data;

      setUser(user);
      setToken(accessToken);
      localStorage.setItem("token", accessToken);
      setIsLogin(true);
      toast.success("Registered successfully");
      navigate("/");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return { success: false, error: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/users/logout");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      handleInvalidToken();
      setStudent(null);
      setLoading(false);
      navigate("/login");
    }
  };

  const resetPassword = async (email) => {
    setLoading(true);
    try {
      await axiosInstance.post("/users/reset-password", { email });
      toast.success("Reset link sent. Check your email.");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.post("/users/change-password", data);
      toast.success("Password changed successfully");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Password change failed");
      return { success: false, error: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const getStudent = async () => {
    setLoading(true);
    try {
      const scholarId = user.scholarId;
      const response = await axiosInstance.get(`/students/get/${scholarId}`);
      setStudent(response.data.data);
      toast.success("Student data loaded");
    } catch (error) {
      console.error("Failed to fetch student:", error);
      toast.error("Failed to load student data");
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    navigate,
    backendUrl,
    token,
    setToken,
    user,
    setUser,
    login,
    register,
    logout,
    fetchUserProfile,
    isloading: loading,
    setLoading,
    changePassword,
    resetPassword,
    student,
    setStudent,
    isLogin,
    setIsLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
