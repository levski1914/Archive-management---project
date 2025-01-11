import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "slave",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "https://archive-management-project.onrender.com/api/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.log("error fetching users", error);
      }
    };

    fetchUsers();
  }, []);
  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(
        `https://archive-management-project.onrender.com/api/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data.message); // Потребителят е изтрит успешно
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "https://archive-management-project.onrender.com/api/users/add",
        newUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers((prev) => [...prev, response.data.user]);
      setNewUser({ name: "", email: "", password: "", role: "slave" });
    } catch (error) {
      console.log("error adding user: ", error);
    }
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Admin Dashboard
        </h1>

        {/* Add User Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Add New User
          </h2>
          <form onSubmit={handleAddUser} className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newUser.name}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={newUser.password}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
            />
            <select
              name="role"
              value={newUser.role}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
            >
              <option value="master">Master</option>
              <option value="slave">Slave</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Add User
            </button>
          </form>
        </div>

        {/* User List */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Users List
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user._id}
                className="p-4 bg-gray-50 border rounded-lg shadow-sm"
              >
                <p className="text-lg font-semibold text-gray-800">
                  {user.name}
                </p>
                <p className="text-sm text-gray-600">Email: {user.email}</p>
                <p className="text-sm text-gray-600">Role: {user.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
