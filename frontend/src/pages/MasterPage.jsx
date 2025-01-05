import React, { useEffect, useState } from "react";
import axios from "axios";
const MasterPage = () => {
  const [folders, setFolders] = useState([]);
  const [requests, setRequests] = useState([]);
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
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/folder", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFolders(response.data);
    } catch (error) {
      console.log("error fetching data: ", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
    } catch (err) {
      console.log("Error fetching requests: ", err);
    }
  };

  const handleAddFolder = async (req, res) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/folder",
        newFolder,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFolders((prev) => [...prev, response.data]);
      setNewFolder({
        name: "",
        client: "",
        year: "",
        code: "",
        location: { shelf: 0, column: 0, row: 0 },
      });
    } catch (error) {
      console.log("error creating folder: ", error);
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
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-blue-300 to-purple-200 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Master Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Manage Folders Section */}
        <section className="bg-white bg-opacity-80 shadow-lg rounded-lg p-6 backdrop-blur-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Manage Folders
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Folder Name"
              value={newFolder.name}
              onChange={(e) =>
                setNewFolder({ ...newFolder, name: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Client"
              value={newFolder.client}
              onChange={(e) =>
                setNewFolder({ ...newFolder, client: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Year"
              value={newFolder.year}
              onChange={(e) =>
                setNewFolder({ ...newFolder, year: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Code"
              value={newFolder.code}
              onChange={(e) =>
                setNewFolder({ ...newFolder, code: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Shelf"
                value={newFolder.location.shelf}
                onChange={(e) =>
                  setNewFolder({
                    ...newFolder,
                    location: { ...newFolder.location, shelf: e.target.value },
                  })
                }
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Column"
                value={newFolder.location.column}
                onChange={(e) =>
                  setNewFolder({
                    ...newFolder,
                    location: { ...newFolder.location, column: e.target.value },
                  })
                }
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Row"
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
              onClick={handleAddFolder}
              className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            >
              Add Folder
            </button>
          </div>

          <ul className="mt-6 space-y-4">
            {folders.map((folder) => (
              <li
                key={folder._id}
                className="p-4 bg-gray-50 border rounded-lg shadow"
              >
                <p className="font-bold text-gray-700">{folder.name}</p>
                <p className="text-sm text-gray-600">Client: {folder.client}</p>
                <p className="text-sm text-gray-600">Year: {folder.year}</p>
                <p className="text-sm text-gray-600">
                  Location: Shelf {folder.location.shelf}, Column{" "}
                  {folder.location.column}, Row {folder.location.row}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Requests Section */}
        <section className="bg-white bg-opacity-80 shadow-lg rounded-lg p-6 backdrop-blur-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Requests
          </h2>
          <ul className="space-y-4">
            {requests.map((request) => (
              <li
                key={request._id}
                className="p-4 bg-gray-50 border rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-gray-700">
                    {request.documentId?.name || "Folder not found"}
                  </p>
                  <p
                    className={`text-sm ${
                      request.status === "Approved"
                        ? "text-green-500"
                        : request.status === "Rejected"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {request.status}
                  </p>
                </div>
                {request.status === "Pending" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApproveRequest(request._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Request History Section */}
      <section className="bg-white bg-opacity-80 shadow-lg rounded-lg p-6 mt-8 backdrop-blur-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Request History
        </h2>
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request._id} className="p-4 bg-gray-50 border rounded-lg">
              <p className="font-bold text-gray-700">
                {request.documentId?.name || "Folder not found"}
              </p>
              <p className="text-sm text-gray-600">{request.status}</p>
              <ul className="mt-2 space-y-2">
                {request.history?.length > 0 ? (
                  request.history.map((entry, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-600 flex items-center gap-2"
                    >
                      <span
                        className={`${
                          entry.status === "Approved"
                            ? "bg-green-100 text-green-600"
                            : entry.status === "Rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                        } px-2 py-1 rounded-full text-xs font-medium`}
                      >
                        {entry.status}
                      </span>
                      <span>
                        {new Date(entry.updatedAt).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No history available</li>
                )}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default MasterPage;
