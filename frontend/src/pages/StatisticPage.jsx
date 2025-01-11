import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
const StatisticPage = () => {
  const [statistics, setStatistics] = useState({
    totalDocuments: 0,
    documentsByClient: [],
    documentsByYear: [],
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStatistics();
  }, []);
  const fetchStatistics = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/folder", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const documents = response.data;

      // Изчисляване на статистиката
      const totalDocuments = documents.length;

      const clientStats = {};
      const yearStats = {};

      documents.forEach((doc) => {
        // Групиране по клиент
        if (clientStats[doc.client]) {
          clientStats[doc.client]++;
        } else {
          clientStats[doc.client] = 1;
        }

        // Групиране по година
        if (yearStats[doc.year]) {
          yearStats[doc.year]++;
        } else {
          yearStats[doc.year] = 1;
        }
      });

      setStatistics({
        totalDocuments,
        documentsByClient: Object.entries(clientStats),
        documentsByYear: Object.entries(yearStats),
      });
    } catch (error) {
      console.log("Error fetching statistics: ", error);
    }
  };
  const yearData = {
    labels: statistics.documentsByYear.map(([year]) => year),
    datasets: [
      {
        label: "Брой документи по години",
        data: statistics.documentsByYear.map(([, count]) => count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // Графика по клиенти
  const clientData = {
    labels: statistics.documentsByClient.map(([client]) => client),
    datasets: [
      {
        label: "Брой документи по клиенти",
        data: statistics.documentsByClient.map(([, count]) => count),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Статистика</h2>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Обща статистика</h3>
        <p>Общ брой документи: {statistics.totalDocuments}</p>
      </div>

      {/* Статистика по клиенти */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Брой документи по клиенти
        </h3>
        <Bar data={clientData} />
      </div>

      {/* Статистика по години */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Брой документи по години
        </h3>
        <Bar data={yearData} />
      </div>
    </div>
  );
};

export default StatisticPage;
