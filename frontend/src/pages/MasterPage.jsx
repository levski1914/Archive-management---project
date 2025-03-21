import React, { useContext, useEffect, useRef, useState } from "react";
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
import ThemeContext from "../services/ThemeContext";
const MasterPage = () => {
  const [folders, setFolders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [searchQuery, setSearchQuery] = useState([]);
  const socket = useRef(null);
  // const [darkMode, setDarkMode] = useState(false);
  const token = localStorage.getItem("token");
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    fetchFolders();
    fetchRequests();

    socket.current = io("https://archive-management-project.onrender.com");

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
      const response = await axios.get(
        "https://archive-management-project.onrender.com/api/folder",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFolders(response.data);
      setFilteredFolders(response.data);
    } catch (error) {
      console.log("Error fetching folders: ", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "https://archive-management-project.onrender.com/api/requests",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  const handleApproveRequest = async (id) => {
    try {
      await axios.put(
        `https://archive-management-project.onrender.com/api/requests/${id}`,
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
        `https://archive-management-project.onrender.com/api/requests/${id}`,
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
        `https://archive-management-project.onrender.com/api/requests/${id}/reminder`,
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
        `https://archive-management-project.onrender.com/api/requests/${id}/return`,
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

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };
  return (
    <div
      className={`min-h-screen p-8 transition-all duration-300 ease-in-out ${
        darkMode
          ? "bg-gray-800 text-white"
          : "bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-black"
      }`}
    >
      <h1
        className={`text-4xl font-extrabold text-center mb-8 transition-all duration-300 ease-in-out ${
          darkMode ? "text-gray-100" : "text-white"
        }`}
      >
        Master Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Search Section */}
        <section
          className={`p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
            darkMode ? "bg-gray-700" : "bg-white"
          } border-t-4 ${darkMode ? "border-gray-600" : "border-green-500"}`}
        >
          <h2
            className={`text-2xl font-semibold mb-4 transition-all duration-300 ease-in-out ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            <FaSearch className="inline-block mr-2 text-green-500" />
            Търсене на документи
          </h2>
          <input
            type="text"
            placeholder="Търси документи..."
            value={searchQuery}
            onChange={handleSearch}
            className={`w-full p-2 rounded-lg transition-all duration-300 ease-in-out ${
              darkMode ? "bg-gray-600 text-gray-300" : "bg-white text-black"
            } border`}
          />
          <div className="mt-4 space-y-2 overflow-y-auto h-60">
            {filteredFolders.map((folder) => (
              <div
                key={folder._id}
                className={`p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out ${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-800"
                  } font-semibold`}
                >
                  {folder.name}
                </p>
                <p
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } text-sm`}
                >
                  Клиент: {folder.client}
                </p>
                <p
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } text-sm`}
                >
                  Година: {folder.year}
                </p>
                <p
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-950"
                  } text-sm font-bold`}
                >
                  Локация: Рафт: {folder.location.shelf}, Колона:{" "}
                  {folder.location.column}, Редове: {folder.location.row}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Requests Section */}
        <section
          className={`p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
            darkMode ? "bg-gray-700" : "bg-white"
          } border-t-4 ${darkMode ? "border-gray-600" : "border-yellow-500"}`}
        >
          <h2
            className={`text-2xl font-semibold mb-4 transition-all duration-300 ease-in-out ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            <FaBell className="inline-block mr-2 text-yellow-500" /> Заявки
          </h2>
          <div className="space-y-4 overflow-y-auto h-80">
            {requests.map((request) => (
              <div
                key={request._id}
                className={`p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out ${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <p
                  className={`${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  } font-semibold`}
                >
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
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 ease-in-out"
                    >
                      Approved
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 ease-in-out"
                    >
                      Rejected
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Returned Documents Section */}
        <section
          className={`p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
            darkMode ? "bg-gray-700" : "bg-white"
          } border-t-4 ${darkMode ? "border-gray-600" : "border-indigo-500"}`}
        >
          <h2
            className={`text-xl font-bold mb-4 transition-all duration-300 ease-in-out ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Върнати документи
          </h2>
          <div className="space-y-4 overflow-y-auto h-80">
            {requests.map((request) => (
              <div
                key={request._id}
                className={`p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out ${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <p
                  className={`${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  } font-semibold`}
                >
                  Document: {request.documentId?.name || "Not Found"}
                </p>
                <p
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } text-sm`}
                >
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
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-300 ease-in-out"
                      >
                        Изпрати напомняне
                      </button>
                      <button
                        onClick={() => markAsReturned(request._id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 ease-in-out"
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
        <section
          className={`p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
            darkMode ? "bg-gray-700" : "bg-white"
          } border-t-4 ${darkMode ? "border-gray-600" : "border-indigo-500"}`}
        >
          <h2
            className={`text-xl font-bold mb-4 transition-all duration-300 ease-in-out ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
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
