import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Error from "../UI/Error";

const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user, userData } = useSelector((state) => state.auth);

  // Check if the user exists and has the role of 'admin'
  const isAdmin = user && userData.role === "admin";

  // If the user is an admin, render the children components
  if (isAdmin) {
    return <>{children}</>;
  } else if (user && !isAdmin) {
    return (
      <Error msg="Access Denied: You do not have permission to view this page." />
    );
  } else {
    // Redirect to login page if not logged in
    return <Navigate to="/login" />;
  }
};

export default AdminRoute;
