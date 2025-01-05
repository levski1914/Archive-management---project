import React from "react";
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ user, children }) => {
  // Ако user е null, изчакай зареждането
  if (user === null) {
    return <div>Loading...</div>;
  }

  // Ако няма user, пренасочи към /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Покажи съдържанието, ако user е валиден
  return children;
};

export default ProtectedRoute;
