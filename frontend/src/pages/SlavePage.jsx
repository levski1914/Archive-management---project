import React, { useEffect, useState } from "react";
import axios from "axios";
const SlavePage = () => {
  const [requestData, setRequestData] = useState({
    documentId: "",
    reason: "",
  });
  const [requests, setRequests] = useState([]);
  const [documents, setDocuments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/folder", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDocuments(response.data);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchDocuments();
    fetchRequests();
  }, [token]);

  const handleChange = (e) => {
    setRequestData({ ...requestData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/requests", requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Request submitted successfully");
      setRequestData({ documentId: "", reason: "" });
    } catch (error) {
      console.log("error submitting ", error);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Slave Dashboard</h1>

      {/* Форма за подаване на заявка */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold mb-3">Submit Request</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            name="documentId"
            value={requestData.documentId}
            onChange={handleChange}
            className="p-2 border rounded w-full"
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
            className="p-2 border rounded w-full"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Submit Request
          </button>
        </form>
      </div>

      {/* Списък със заявки */}
      <div>
        <h2 className="text-xl font-semibold mb-3">My Requests</h2>
        <ul>
          {requests.map((req) => (
            <li key={req._id} className="p-2 border-b">
              <p>Document: {req.documentId.name}</p>
              <p>Reason: {req.reason}</p>
              <p>Status: {req.status}</p>
              <p>Submitted on: {new Date(req.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SlavePage;
