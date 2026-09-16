import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {

  const userRole =
    sessionStorage.getItem("UserRole");

  // User login केलेला नाही
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // User ला या page ची permission नाही
  if (
    allowedRoles &&
    !allowedRoles.includes(userRole)
  ) {
    return <Navigate to="/commonpage" replace />;
  }

  // Permission आहे
  return children;
};

export default ProtectedRoute;