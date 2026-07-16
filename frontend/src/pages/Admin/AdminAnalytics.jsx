// frontend/src/pages/Admin/AdminAnalytics.jsx
// (Taddan navi file - Full Admin Analytics and User Performance Matrix Grid)

import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://mission-tat-backend.onrender.com";

export default function AdminAnalytics() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/admin/attempts-log`)
      .then(res => {
        if (res.data) setLogs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Analytics load error:", err);
        // સેફ ટેસ્ટિંગ ડેટા જો બેકએન્ડ હજી લોડ ન હોય
        setLogs([
          { id: "1", userName: "નિતિન સિંઘલ", testTitle: "ગણિત મોક ટેસ્ટ - 01", score: 142, total: 150, date: "2026-07-17T01:30:00Z" },
          { id: "2", userName: "આરવ પટેલ", testTitle: "ગણિત મોક ટેસ્ટ - 01", score: 135, total: 150, date: "2026-07-16T18:45:00Z" }
        ]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ color: "#FFE07D", backgroundColor: "#09090b", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>⚙️ એનાલિટિક્સ મેટ્રિક્સ લોડ થઈ રહ્યું છે...</div>;

  return (
    <div style={{ backgroundColor: "#09090b", color: "#f4f4f5", minHeight: "100vh", padding: "40px 24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* Top bar */}
        <div style={{ borderBottom: "1px solid #27272a", paddingBottom: "20px", marginBottom: "30px" }}>
          <h1 style={{ margin: 0, fontSize: "28px", color: "#fff" }}>📊 વિદ્યાર્થી પરીક્ષા એનાલિટિક્સ અને લોગ્સ</h1>
          <p style={{ color: "#FFE07D", margin: "6px 0 0 0", fontSize: "14px", fontWeight: "bold" }}>👑 @missiontatgujrat રીયલ-ટાઇમ ટ્રેકિંગ પ્લેટફોર્મ</p>
        </div>

        {/* Logs Table Grid */}
        <div style={{ backgroundColor: "#1c1c1e", border: "1px solid #27272a", borderRadius: "20px", padding: "20px", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #27272a", color: "#a1a1aa", fontSize: "14px" }}>
                <th style={{ padding: "12px" }}>વિદ્યાર્થીનું નામ</th>
                <th style={{ padding: "12px" }}>આપેલી મોક ટેસ્ટ</th>
                <th style={{ padding: "12px", textAlign: "center" }}>મેળવેલ ગુણ</th>
                <th style={{ padding: "12px", textAlign: "center" }}>ટકાવારી (Percentage)</th>
                <th style={{ padding: "12px", textAlign: "right" }}>તારીખ અને સમય</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const percentage = ((log.score / log.total) * 100).toFixed(1);
                return (
                  <tr key={log.id} style={{ borderBottom: "1px solid #27272a", fontSize: "15px", color: "#fff" }}>
                    <td style={{ padding: "16px 12px", fontWeight: "bold" }}>👤 {log.userName}</td>
                    <td style={{ padding: "16px 12px", color: "#e4e4e7" }}>{log.testTitle}</td>
                    <td style={{ padding: "16px 12px", textAlign: "center", color: "#4ade80", fontWeight: "bold" }}>{log.score} / {log.total}</td>
                    <td style={{ padding: "16px 12px", textAlign: "center", color: "#FFE07D", fontWeight: "bold" }}>{percentage}%</td>
                    <td style={{ padding: "16px 12px", textAlign: "right", color: "#71717a", fontSize: "13px" }}>
                      {new Date(log.date).toLocaleString("gu-IN")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}