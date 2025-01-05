import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 flex items-center justify-center">
      <div className="text-center max-w-3xl bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to the Archive Management System
        </h1>
        <p className="text-gray-600 mb-6">
          Manage your company documents and requests efficiently with our
          powerful archive management solution. Whether you're an admin, master,
          or slave, you’ll find everything you need to stay organized.
        </p>
        <div className="space-x-4">
          <a
            href="/register"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg shadow hover:bg-gray-300"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
