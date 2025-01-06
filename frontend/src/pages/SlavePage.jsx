import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
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
        const response = await axios.get("http://localhost:5000/api/folder", {
          headers: {
            Authorization: token,
          },
        });
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
        const response = await axios.get("http://localhost:5000/api/requests", {
          headers: {
            Authorization: token,
          },
        });
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchDocuments();
    fetchRequests();
  }, []);

  const handleChange = (e) => {
    setRequestData({ ...requestData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/requests",
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Slave Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submit Request Form */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Submit Request
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                name="documentId"
                value={requestData.documentId}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
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
                className="p-3 border rounded-lg w-full"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Submit Request
              </button>
            </form>
          </div>

          {/* Request List */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              My Requests
            </h2>
            <div className="space-y-4">
              {requests.length > 0 ? (
                requests.map((req) => (
                  <div
                    key={req._id}
                    className="p-4 border rounded-lg bg-gray-50 shadow-sm"
                  >
                    <p className="text-lg font-semibold text-gray-800">
                      Document: {req.documentId.name || "Not Found"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Reason: {req.reason}
                    </p>
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
    </div>
  );
};

export default SlavePage;
