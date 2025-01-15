import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const SettingsPage = () => {
    const [editingProfile, setEditingProfile] = useState(null); // За редакция
  const [user, setUser] = useState(null); // Потребителски данни
  const [error, setError] = useState(""); // Грешки
  const token = localStorage.getItem("token");

  // Извличане на потребителските данни
  const fetchUserData = async () => {
    try {
      if (token) {
        const response = await axios.get(
          "https://archive-management-project.onrender.com/api/auth/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
      }
    } catch (error) {
      setError("Failed to fetch user data");
      setUser(null);
      localStorage.removeItem("token");
      toast.error("Неуспешно зареждане на потребителските данни.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Запазване на редактираните данни
  const handleSave = async () => {
    try {
      const response = await axios.put(
        "https://archive-management-project.onrender.com/api/auth/me",
        editingProfile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(response.data.user); // Обнови потребителските данни
      setEditingProfile(null); // Излез от режима на редакция
      toast.success("Успешно редактира профила си!");
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
    return <p>Loading...</p>;
  }


      
  return (
    <div>
    <h1>Settings Page</h1>
    {error && <p style={{ color: "red" }}>{error}</p>}

    {editingProfile ? (
      <div>
        {/* Режим за редакция */}
        <form>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={editingProfile.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={editingProfile.email}
              onChange={handleChange}
            />
          </div>
          <button type="button" onClick={handleSave}>
            Save
          </button>
          <button type="button" onClick={() => setEditingProfile(null)}>
            Cancel
          </button>
        </form>
      </div>
    ) : (
      <div>
        {/* Показване на данните */}
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <button onClick={() => setEditingProfile(user)}>Edit</button>
      </div>
    )}
  </div>
  )
}

export default SettingsPage