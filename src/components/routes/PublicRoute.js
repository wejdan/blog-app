import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PublicRoute({ children }) {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <>{children}</>;
  } else {
    return <Navigate to="/" replace />;
  }

  // If user is logged in, render the child components
}

export default PublicRoute;
