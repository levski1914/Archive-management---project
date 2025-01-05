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
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.log("error fetching users", error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/add",
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
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Admin Page</h1>

      {/* Add User Form */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold mb-3">Add New User</h2>
        <form onSubmit={handleAddUser} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newUser.name}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
          <select
            name="role"
            value={newUser.role}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          >
            <option value="master">Master</option>
            <option value="slave">Slave</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Add User
          </button>
        </form>
      </div>

      {/* User List */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id} className="p-2 border-b">
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
