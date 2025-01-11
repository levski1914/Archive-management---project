import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import {
  FaClipboardList,
  FaPaperPlane,
  FaBook,
  FaBell,
  FaArrowRight,
} from "react-icons/fa";
const SlavePage = () => {
  const [requestData, setRequestData] = useState({
    documentId: "",
    reason: "",
  });
  const [requests, setRequests] = useState([]);
  const [documents, setDocuments] = useState([]);
  const token = localStorage.getItem("token");
  const socket = useRef(null);
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await axios.get(
          "https://archive-management-project.onrender.com/api/folder",
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setDocuments(response.data);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };

    const fetchRequests = async () => {
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await axios.get(
          "https://archive-management-project.onrender.com/api/requests",
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setRequests(response.data.filter((req) => !req.isReturned));
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchDocuments();
    fetchRequests();

    socket.current = io("https://archive-management-project.onrender.com");

    socket.current.on("connect", () => {
      console.log("Socket connected");
    });

    socket.current.on("reminder", (data) => {
      console.log("Received reminder:", token);

      toast.info(data.message);
    });

    socket.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.current.on("document_returned", (data) => {
      console.log("Document returned:", data);
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== data.requestId)
      );
      toast.success("You returned a document!");
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const handleChange = (e) => {
    setRequestData({ ...requestData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://archive-management-project.onrender.com/api/requests",
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Request submitted successfully");
      setRequestData({ documentId: "", reason: "" });
      setRequests((prevRequests) => [response.data, ...prevRequests]);
    } catch (error) {
      console.log("error submitting ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white text-center mb-8">
          Slave Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submit Request Form */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
              <FaPaperPlane className="text-blue-500 mr-2" />
              Submit Request
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                name="documentId"
                value={requestData.documentId}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full focus:ring focus:ring-blue-300"
              >
                <option value="">Select Document</option>
                {documents.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name} - {doc.client} ({doc.year})
                  </option>
                ))}
              </select>
              <textarea
                name="reason"
                placeholder="Reason for request"
                value={requestData.reason}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full focus:ring focus:ring-blue-300"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 w-full"
              >
                Submit Request
              </button>
            </form>
          </div>

          {/* Documents to Return */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
              <FaClipboardList className="text-yellow-500 mr-2" />
              Documents to Return
            </h2>
            <div className="space-y-4 overflow-y-auto h-60">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <div
                    key={request._id}
                    className="p-4 border rounded-lg bg-gray-50 shadow-md"
                  >
                    <p className="font-semibold text-gray-800">
                      Document: {request.documentId?.name || "Not Found"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Reason: {request.reason}
                    </p>
                    <p className="text-sm font-semibold text-red-500">
                      Status: Not Returned
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No documents to return.</p>
              )}
            </div>
          </div>
        </div>

        {/* My Requests Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
            <FaBook className="text-green-500 mr-2" />
            My Requests
          </h2>
          <div className="space-y-4 overflow-y-auto h-60">
            {requests.length > 0 ? (
              requests.map((req) => (
                <div
                  key={req._id}
                  className="p-4 border rounded-lg bg-gray-50 shadow-sm"
                >
                  <p className="text-lg font-semibold text-gray-800">
                    Document: {req.documentId?.name || "Not Found"}
                  </p>
                  <p className="text-sm text-gray-600">Reason: {req.reason}</p>
                  <p
                    className={`text-sm font-semibold ${
                      req.status === "Approved"
                        ? "text-green-600"
                        : req.status === "Rejected"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    Status: {req.status}
                  </p>
                  <p className="text-xs text-gray-500">
                    Submitted on: {new Date(req.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No requests found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlavePage;
