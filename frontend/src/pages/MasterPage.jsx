import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  FaFolderOpen,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaBell,
  FaCheck,
} from "react-icons/fa";

import { toast } from "react-toastify";
const MasterPage = () => {
  const [folders, setFolders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [searchQuery, setSearchQuery] = useState([]);
  const socket = useRef(null);
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
    fetchRequests();

    socket.current = io("http://localhost:5000");

    socket.current.on("connect", () => {
      console.log("Connected to server");
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.current.on("new_request", (newRequest) => {
      console.log("Received new request:", newRequest);
      setRequests((prevRequests) => [newRequest, ...prevRequests]);
      toast.success("New request received!");
    });

    socket.current.on("reminder", (data) => {
      toast.info(data);
    });

    socket.current.on("document_returned", (data) => {
      console.log("Document returned:", data);
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== data.requestId)
      );
      toast.success("A document was returned!");
    });
    return () => {
      socket.current.disconnect();
    };
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/folder", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFolders(response.data);
      setFilteredFolders(response.data);
    } catch (error) {
      console.log("Error fetching folders: ", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests: ", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = folders.filter(
      (folder) =>
        folder.name.toLowerCase().includes(query) ||
        folder.client.toLowerCase().includes(query) ||
        folder.year.toString().includes(query)
    );
    setFilteredFolders(filtered);
  };

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

  const handleApproveRequest = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/requests/${id}`,
        { status: "Approved" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchRequests();
      toast.success("Request approved!");
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/requests/${id}`,
        { status: "Rejected" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchRequests();
      toast.error("Request rejected!");
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const sendReminder = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/requests/${id}/reminder`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Reminder sent successfully");
    } catch (error) {
      console.log("error sending reminder: ", error);
      toast.error("error sending reminder");
    }
  };

  const markAsReturned = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/requests/${id}/return`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Document marked as returned");
      fetchRequests();
    } catch (error) {
      console.log("error marking document: ", error);
      toast.error("error marking document as returned");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-8">
      <h1 className="text-4xl font-extrabold text-white text-center mb-8">
        Master Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add Document Section */}
        <section className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            <FaFolderOpen className="inline-block mr-2 text-blue-500" />
            Добавяне на документ
          </h2>
          <form className="space-y-4" onSubmit={handleAddFolder}>
            <input
              type="text"
              placeholder="Име на документа"
              value={newFolder.name}
              onChange={(e) =>
                setNewFolder({ ...newFolder, name: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Клиент"
              value={newFolder.client}
              onChange={(e) =>
                setNewFolder({ ...newFolder, client: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Година"
              value={newFolder.year}
              onChange={(e) =>
                setNewFolder({ ...newFolder, year: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Код"
              value={newFolder.code}
              onChange={(e) =>
                setNewFolder({ ...newFolder, code: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
            <div className="flex space-x-2">
              <label htmlFor="shelf">Рафт</label>
              <input
                type="number"
                placeholder="Рафтове"
                value={newFolder.location.shelf}
                onChange={(e) =>
                  setNewFolder({
                    ...newFolder,
                    location: { ...newFolder.location, shelf: e.target.value },
                  })
                }
                className="w-full p-2 border rounded-lg"
              />
              <label htmlFor="column">Колона</label>
              <input
                id="column"
                type="number"
                placeholder="Колони"
                value={newFolder.location.column}
                onChange={(e) =>
                  setNewFolder({
                    ...newFolder,
                    location: { ...newFolder.location, column: e.target.value },
                  })
                }
                className="w-full p-2 border rounded-lg"
              />
              <label htmlFor="row">Редове</label>
              <input
                id="row"
                type="number"
                placeholder="Редове"
                value={newFolder.location.row}
                onChange={(e) =>
                  setNewFolder({
                    ...newFolder,
                    location: { ...newFolder.location, row: e.target.value },
                  })
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Добави документ
            </button>
          </form>
        </section>

        {/* Search Section */}
        <section className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-green-500">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            <FaSearch className="inline-block mr-2 text-green-500" />
            Търсене на документи
          </h2>
          <input
            type="text"
            placeholder="Търси документи..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-2 border rounded-lg"
          />
          <div className="mt-4 space-y-2 overflow-y-auto h-60">
            {filteredFolders.map((folder) => (
              <div
                key={folder._id}
                className="p-4 bg-gray-50 rounded-lg shadow-md"
              >
                <p className="font-semibold text-gray-800">{folder.name}</p>
                <p className="text-sm text-gray-600">Клиент: {folder.client}</p>
                <p className="text-sm text-gray-600">Година: {folder.year}</p>
                <p className="text-sm font-bold text-gray-950">
                  Локация: Рафт: {folder.location.shelf}, Колона:{" "}
                  {folder.location.column}, Редове: {folder.location.row}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Requests Section */}
        <section className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-yellow-500">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            <FaBell className="inline-block mr-2 text-yellow-500" /> Заявки
          </h2>
          <div className="space-y-4 overflow-y-auto h-80">
            {requests.map((request) => (
              <div
                key={request._id}
                className="p-4 bg-gray-50 rounded-lg shadow-md"
              >
                <p className="font-semibold text-gray-800">
                  {request.documentId?.name || "Неизвестен документ"}
                </p>
                <p
                  className={`text-sm font-medium ${
                    request.status === "Approved"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                >
                  {request.status}
                </p>
                {request.status === "Pending" && (
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleApproveRequest(request._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Approved
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      Rejected
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
        <section className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-indigo-500">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Върнати документи
          </h2>
          <div className="space-y-4 overflow-y-auto h-80">
            {requests.map((request) => (
              <div
                key={request._id}
                className="p-4 bg-gray-50 rounded-lg shadow-md"
              >
                <p className="font-semibold text-gray-800">
                  Document: {request.documentId?.name || "Not Found"}
                </p>
                <p className="text-sm text-gray-600">
                  Reason: {request.reason}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    request.isReturned ? "text-green-500" : "text-red-500"
                  }`}
                >
                  Status: {request.isReturned ? "Returned" : "Not Returned"}
                </p>
                <div className="flex space-x-2 mt-2">
                  {!request.isReturned && (
                    <>
                      <button
                        onClick={() => sendReminder(request._id)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                      >
                        Изпрати напомняне
                      </button>
                      <button
                        onClick={() => markAsReturned(request._id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                      >
                        Успешно върнат
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Request History Section */}
        <section className="bg-white shadow-lg rounded-lg p-6 col-span-1 md:col-span-2 border-t-4 border-purple-500">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            История на заявките
          </h2>
          <div className="space-y-4 overflow-y-auto h-40">
            {requests
              .filter((req) => req.history?.length > 0)
              .map((request) => (
                <div
                  key={request._id}
                  className="p-4 bg-gray-50 rounded-lg shadow-md"
                >
                  <p className="font-semibold text-gray-800">
                    {request.documentId?.name || "Неизвестен документ"}
                  </p>
                  <ul className="text-sm text-gray-600">
                    {request.history.map((entry, index) => (
                      <li key={index}>
                        {entry.status} -{" "}
                        {new Date(entry.updatedAt).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MasterPage;
