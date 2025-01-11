import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaFolderOpen,
  FaTrashAlt,
  FaEdit,
  FaTimesCircle,
  FaBell,
  FaCheck,
} from "react-icons/fa";
import { toast } from "react-toastify";
const DocumentsPage = () => {
  const [folders, setFolders] = useState([]);
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolder, setNewFolder] = useState({
    name: "",
    client: "",
    year: "",
    code: "",
    location: { shelf: 0, column: 0, row: 0 },
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFolders();
  });

  const handleAddFolder = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/folder",
        newFolder,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFolders((prev) => [...prev, response.data]);
      setFilteredFolders((prev) => [...prev, response.data]);
      setNewFolder({
        name: "",
        client: "",
        year: "",
        code: "",
        location: { shelf: 0, column: 0, row: 0 },
      });
      alert("Folder added successfully!");
    } catch (error) {
      console.error("Error adding folder: ", error);
    }
  };
  const handleDeleteFolder = async (id) => {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете този документ?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/api/folder/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFolders((prev) => prev.filter((folder) => folder._id !== id));
      toast.success("Архивът изтрит успешно!");
    } catch (error) {
      console.log(error);
      toast.error("Error delete archive", error);
    }
  };

  const handleEditFolder = (folder) => {
    setEditingFolder(folder);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/folder/${editingFolder._id}`,
        editingFolder,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFolders((prev) =>
        prev.map((folder) =>
          folder._id === editingFolder._id ? editingFolder : folder
        )
      );
      toast.success("Успешно редактира архива");
      setEditingFolder(null);
    } catch (error) {
      console.log(error);
      toast.error("Sorry some error with editing: ", error);
    }
  };
  const fetchFolders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/folder", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFolders(response.data);
    } catch (error) {
      console.log("Error fetching folders: ", error);
    }
  };
  const closeModal = () => {
    setEditingFolder(null);
  };
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Форма за добавяне на документ */}
      <section className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-600">
        <h2 className="text-2xl font-semibold text-gray-700 flex items-center mb-4">
          <FaFolderOpen className="text-blue-600 mr-2" />
          Добавяне на документ
        </h2>
        <form onSubmit={handleAddFolder} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Име на документа"
              value={newFolder.name}
              onChange={(e) =>
                setNewFolder({ ...newFolder, name: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Клиент"
              value={newFolder.client}
              onChange={(e) =>
                setNewFolder({ ...newFolder, client: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Година"
              value={newFolder.year}
              onChange={(e) =>
                setNewFolder({ ...newFolder, year: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Код"
              value={newFolder.code}
              onChange={(e) =>
                setNewFolder({ ...newFolder, code: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Рафт"
              value={newFolder.location.shelf}
              onChange={(e) =>
                setNewFolder({
                  ...newFolder,
                  location: { ...newFolder.location, shelf: e.target.value },
                })
              }
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              placeholder="Колона"
              value={newFolder.location.column}
              onChange={(e) =>
                setNewFolder({
                  ...newFolder,
                  location: { ...newFolder.location, column: e.target.value },
                })
              }
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              placeholder="Ред"
              value={newFolder.location.row}
              onChange={(e) =>
                setNewFolder({
                  ...newFolder,
                  location: { ...newFolder.location, row: e.target.value },
                })
              }
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Добави документ
          </button>
        </form>
      </section>

      {/* Таблица със списък на документи */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Списък с документи
        </h3>
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Име</th>
              <th className="px-4 py-2 border">Клиент</th>
              <th className="px-4 py-2 border">Година</th>
              <th className="px-4 py-2 border">Код</th>
              <th className="px-4 py-2 border">Локация</th>
              <th className="px-4 py-2 border">Действия</th>
            </tr>
          </thead>
          <tbody>
            {folders.map((folder, index) => (
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{folder.name}</td>
                <td className="px-4 py-2 border">{folder.client}</td>
                <td className="px-4 py-2 border">{folder.year}</td>
                <td className="px-4 py-2 border">{folder.code}</td>
                <td className="px-4 py-2 border">
                  шкаф-{folder.location.shelf} - /// колона -{" "}
                  {folder.location.column} - /// ред - {folder.location.row}
                </td>
                <td className="px-4 py-2 border flex space-x-2">
                  <button
                    className="text-red-500 hover:text-red-700"
                    title="Изтрий"
                    onClick={() => handleDeleteFolder(folder._id)}
                  >
                    <FaTrashAlt />
                  </button>
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    title="Редактирай"
                    onClick={() => handleEditFolder(folder)}
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {editingFolder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              Редактиране на документ
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Име на документа"
                value={editingFolder.name}
                onChange={(e) =>
                  setEditingFolder({ ...editingFolder, name: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Клиент"
                value={editingFolder.client}
                onChange={(e) =>
                  setEditingFolder({ ...editingFolder, client: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Година"
                value={editingFolder.year}
                onChange={(e) =>
                  setEditingFolder({ ...editingFolder, year: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Код"
                value={editingFolder.code}
                onChange={(e) =>
                  setEditingFolder({ ...editingFolder, code: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Шкаф"
                  value={editingFolder.location.shelf}
                  onChange={(e) =>
                    setEditingFolder({
                      ...editingFolder,
                      location: {
                        ...editingFolder.location,
                        shelf: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Колона"
                  value={editingFolder.location.column}
                  onChange={(e) =>
                    setEditingFolder({
                      ...editingFolder,
                      location: {
                        ...editingFolder.location,
                        column: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Ред"
                  value={editingFolder.location.row}
                  onChange={(e) =>
                    setEditingFolder({
                      ...editingFolder,
                      location: {
                        ...editingFolder.location,
                        row: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Откажи
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Запази
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
