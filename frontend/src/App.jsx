import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Auth/Login";
import RegisterCompany from "./components/Auth/RegisterCompany";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import axios from "axios";
import MasterPage from "./pages/MasterPage";
import SlavePage from "./pages/SlavePage";
import Navbar from "./components/common/Navbar";

function App() {
  // const [count, setCount] = useState(0);
  const [user, setUser] = useState(null);

  // Възстановяване на сесията от Local Storage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));

    if (token && userData) {
      setUser(userData);
      axios
        .get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Token validation failed:", error);
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

  const handleLogin = (token, userData) => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } else {
      console.error("Token is undefined!");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterCompany />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user && user.role === "admin"}>
              <AdminPage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<HomePage />} />
        <Route
          path="/master-dashboard"
          element={
            <ProtectedRoute user={user && user.role === "master"}>
              <MasterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/slave-dashboard"
          element={
            // <ProtectedRoute user={user && user.role === "slave"}>
            <SlavePage />
            // {/* </ProtectedRoute> */}
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
