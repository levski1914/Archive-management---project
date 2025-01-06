import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ onLogout, user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-500 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">
          <Link to="/">Archive System</Link>
        </div>
        <ul className="flex space-x-6">
          {!user ? (
            <>
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
            </>
          ) : (
            <>
              {user.role === "admin" && (
                <li>
                  <Link to="/admin" className="hover:underline">
                    Admin
                  </Link>
                </li>
              )}
              {user.role === "master" && (
                <li>
                  <Link to="/master-dashboard" className="hover:underline">
                    Master Dashboard
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
