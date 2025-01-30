import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./components/Auth/Login";
import RegisterCompany from "./components/Auth/RegisterCompany";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import axios from "axios";
import MasterPage from "./pages/MasterPage";
import SlavePage from "./pages/SlavePage";
import Navbar from "./components/common/Navbar";
import DocumentsPage from "./pages/DocumentsPage";
import StatisticPage from "./pages/StatisticPage";
import SettingsPage from "./pages/SettingsPage";
import { BACKEND_URL } from "./services/ApiService";

axios.interceptors.response.use(
  (response) => response, // Ако отговорът е успешен, просто го връщаме.
  async (error) => {
    const originalRequest = error.config;

    // Ако Access Token е изтекъл (401) и няма вече Refresh Token -> Принудителен logout
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Маркираме заявката като повторена

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        toast.error("Сесията ви е изтекла. Моля, влезте отново.");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Опит за обновяване на Access Token
        const response = await axios.post(
          `${BACKEND_URL}/api/auth/refresh-token`,
          { refreshToken }
        );

        const newAccessToken = response.data.accessToken;

        // Запазване на новия Access Token
        localStorage.setItem("token", newAccessToken);

        // Презаписване на заглавието (Authorization) с новия Access Token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Повторна заявка със същите данни, но с новия токен
        return axios(originalRequest);
      } catch (refreshError) {
        // Ако Refresh Token-а също е невалиден -> Принудителен logout
        toast.error("Сесията ви е изтекла. Моля, влезте отново.");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

function App() {
  // const [count, setCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));

    if (token && userData) {
      setUser(userData);
      axios
        .get("https://archive-management-project.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            toast.error("Сесията ви е изтекла. Моля, влезте отново.");
          } else {
            console.error("Token validation failed:", error);
          }
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        });
    } else {
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, []);

  const handleLogin = (token, refreshToken, userData) => {
    if (token && refreshToken) {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } else {
      console.error("Login failed: Missing token or user data!");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Излязохте успешно от системата.");
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        {!user && (
          <>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterCompany />} />
            <Route path="/" element={<HomePage />} />
          </>
        )}

        {user && (
          <Route
            path="/"
            element={
              user.role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : user.role === "master" ? (
                <Navigate to="/master-dashboard" replace />
              ) : user.role === "slave" ? (
                <Navigate to="/slave-dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        )}

        {user && user?.role === "admin" && (
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user?.role === "admin"}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        )}

        {user && user?.role === "master" && (
          <>
            <Route
              path="/master-dashboard"
              element={
                <ProtectedRoute user={user?.role === "master"}>
                  <MasterPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute user={user?.role === "master"}>
                  <DocumentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/statistics"
              element={
                <ProtectedRoute user={user?.role === "master"}>
                  <StatisticPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute user={user?.role === "master"}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
          </>
        )}

        <Route
          path="/slave-dashboard"
          element={
            <ProtectedRoute user={user && user.role === "slave"}>
              <SlavePage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
