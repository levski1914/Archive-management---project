import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ThemeContext from "../../services/ThemeContext";
import { BACKEND_URL } from "../../services/ApiService";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    companyName: "",
  });
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", formData); // Debugging

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        formData
      );

      console.log("Login response data:", response.data); // Log the full response here

      const { accessToken, refreshToken, user } = response.data; // Ако отговорът има тези стойности
      if (accessToken && refreshToken && user) {
        onLogin(accessToken, refreshToken, user); // Ако всичко е налично
      } else {
        console.error("Missing data in login response!");
        alert("Login failed. Please check your credentials.");
      }

      // Navigate based on user role
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "master") {
        navigate("/master-dashboard");
      } else if (user.role === "slave") {
        navigate("/slave-dashboard");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center  p-8 transition-all duration-300 ease-in-out ${
        darkMode
          ? "bg-gray-800 text-white"
          : "bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-black"
      }`}
    >
      {/* <h1 className="text-3xl font-bold underline">Hello world!</h1> */}
      <div
        className={`p-6 w-full max-w-sm rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
          darkMode ? "bg-gray-700" : "bg-white"
        } border-t-4 ${darkMode ? "border-gray-600" : "border-green-500"}`}
      >
        <h1
          className={`text-2xl flex font-semibold mb-4 transition-all duration-300 ease-in-out ${
            darkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            onChange={handleChange}
            className={`w-full p-2 rounded-lg transition-all duration-300 ease-in-out ${
              darkMode ? "bg-gray-600 text-gray-300" : "bg-white text-black"
            } border`}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className={`w-full p-2 rounded-lg transition-all duration-300 ease-in-out ${
              darkMode ? "bg-gray-600 text-gray-300" : "bg-white text-black"
            } border`}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className={`w-full p-2 rounded-lg transition-all duration-300 ease-in-out ${
              darkMode ? "bg-gray-600 text-gray-300" : "bg-white text-black"
            } border`}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
