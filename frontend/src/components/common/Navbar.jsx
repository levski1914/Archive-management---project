import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoSunnyOutline } from "react-icons/io5";
import { FaRegMoon } from "react-icons/fa";
// import { ThemeContext } from "../../services/ThemeContext";
import ThemeContext from "../../services/ThemeContext";
const Navbar = ({ onLogout, user }) => {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav
      className={`p-4 transition-all duration-300 ease-in-out ${
        darkMode ? "bg-gray-700 text-white" : "bg-blue-500 text-white"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {!user ? (
          <>
            <div className="text-lg font-bold">
              <Link to="/">Archive System</Link>
            </div>
            <ul className="flex justify-between items-center align-middle space-x-6">
              <li>
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:underline">
                  Register
                </Link>
              </li>

              <li className="">
                <button
                  onClick={toggleTheme}
                  className={`ml-4 p-2 rounded ${
                    darkMode
                      ? "bg-gray-600 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {darkMode ? <IoSunnyOutline /> : <FaRegMoon />}
                </button>
              </li>
            </ul>
          </>
        ) : (
          <>
            <ul className="flex justify-between space-x-6">
              {user.role === "admin" && (
                <li>
                  <Link to="/admin" className="hover:underline">
                    Admin
                  </Link>
                </li>
              )}
              {user.role === "master" && (
                <>
                  <li className="px-4 py-2 hover:bg-blue-700">
                    <Link to="/master-dashboard">Начало</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-blue-700">
                    <Link to="/documents">Управление на документи</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-blue-700">
                    <Link to="/statistics">Статистика</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-blue-700">
                    <Link to="/settings">Настройки</Link>
                  </li>
                </>
              )}
            </ul>
            <ul className="flex align-middle justify-between ">
              <li className="px-4 py-2">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </li>
              <li className="px-4 py-2">
                <button
                  onClick={toggleTheme}
                  className={`ml-4 p-2 rounded ${
                    darkMode
                      ? "bg-gray-600 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {darkMode ? <IoSunnyOutline /> : <FaRegMoon />}
                </button>
              </li>
            </ul>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
