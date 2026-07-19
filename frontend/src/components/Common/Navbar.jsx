import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeStyle = {
    padding: "8px 16px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "13px"
  };

  const inactiveStyle = {
    padding: "8px 16px",
    background: "transparent",
    color: "#a1a1aa",
    border: "1px solid #27272a",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px"
  };

  return (
    <div style={{
      background: "#18181b", 
      borderBottom: "1px solid #27272a", 
      padding: "16px 24px", 
      display: "flex", 
      justify: "space-between", 
      alignItems: "center",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => navigate("/store")}>
        <span style={{ color: "#dc2626", fontWeight: "900", fontSize: "18px", letterSpacing: "1px" }}>MISSION TAT GUJARAT</span>
      </div>
      
      <div style={{ display: "flex", gap: "12px" }}>
        <button 
          onClick={() => navigate("/store")} 
          style={location.pathname === "/store" ? activeStyle : inactiveStyle}
        >
          📚 મટીરિયલ સ્ટોર
        </button>
        <button 
          onClick={() => navigate("/admin")} 
          style={location.pathname === "/admin" ? activeStyle : inactiveStyle}
        >
          🔧 એડમિન પેનલ
        </button>
      </div>
    </div>
  );
}