import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ThemeContext from "../../services/ThemeContext";

const RegisterCompany = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    password: "",
  });
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://archive-management-project.onrender.com/api/auth/register-company",
        formData
      );
      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (error) {
      alert("Registration failed.");
      console.error(error);
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
          Register Company
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
          />{" "}
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            onChange={handleChange}
            className={`w-full p-2 rounded-lg transition-all duration-300 ease-in-out ${
              darkMode ? "bg-gray-600 text-gray-300" : "bg-white text-black"
            } border`}
            required
          />{" "}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className={`w-full p-2 rounded-lg transition-all duration-300 ease-in-out ${
              darkMode ? "bg-gray-600 text-gray-300" : "bg-white text-black"
            } border`}
            required
          />{" "}
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className={`w-full p-2 rounded-lg transition-all duration-300 ease-in-out ${
              darkMode ? "bg-gray-600 text-gray-300" : "bg-white text-black"
            } border`}
            required
          />{" "}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterCompany;
