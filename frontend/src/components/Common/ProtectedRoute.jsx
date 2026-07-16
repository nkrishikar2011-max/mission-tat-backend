import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const savedUser = localStorage.getItem("tat_active_user");
  
  if (!savedUser) {
    // જો યુઝર લોગિન ન હોય તો સીધો સ્ટોર પેજ પર રીડાયરેક્ટ થશે
    alert("🔒 આ પેજ એક્સેસ કરવા માટે ગુગલ લોગીન કરવું ફરજિયાત છે!");
    return <Navigate to="/store" replace />;
  }

  return children;
}