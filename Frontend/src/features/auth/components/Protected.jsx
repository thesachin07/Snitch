import React from "react";
import { Navigate } from "react-router";
import useAppStore from "../../../app/app.store";

const Protected = ({ children, role = "buyer" }) => {
  const user = useAppStore((state) => state.user);
  const loading = useAppStore((state) => state.loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default Protected;