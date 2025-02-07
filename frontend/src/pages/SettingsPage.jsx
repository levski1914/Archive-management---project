import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { BACKEND_URL } from "../services/ApiService";
const SettingsPage = () => {
    const [editingProfile, setEditingProfile] = useState(null); // За редакция
  const [user, setUser] = useState(null); // Потребителски данни
  const [error, setError] = useState(""); // Грешки
  const token = localStorage.getItem("token");

  // Извличане на потребителските данни
  const fetchUserData = async () => {
    try {
      if (token) {
        const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      }
    } catch (error) {
      setError("Failed to fetch user data");
      setUser(null);
      localStorage.removeItem("token");
      toast.error("Неуспешно зареждане на потребителските данни.");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Запазване на редактираните данни
  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/auth/me/${editingProfile._id}`,
        editingProfile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEditingProfile(null); // Излизаме от режим редакция
      toast.success("Успешно редактира профила си!");

      // Обнови потребителските данни
      fetchUserData(); // Ново извикване за зареждане на актуализираните данни
    } catch (error) {
      console.error(error);
      toast.error("Възникна грешка при запазването на данните!");
    }
  };

  // Актуализация на данни във формата
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingProfile((prevData) => ({ ...prevData, [name]: value }));
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }
      
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Settings Page
        </h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {editingProfile ? (
          <div>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={editingProfile.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={editingProfile.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 font-medium rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <p className="text-gray-700 mb-4">
              <strong className="font-medium">Name:</strong> {user.name}
            </p>
            <p className="text-gray-700 mb-6">
              <strong className="font-medium">Email:</strong> {user.email}
            </p>
            <button
              onClick={() => setEditingProfile(user)}
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SettingsPage