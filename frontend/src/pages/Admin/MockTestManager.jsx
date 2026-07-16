// frontend/src/pages/Admin/MockTestManager.jsx
// (FARJIYAT AKHI FILE REPLACE - Admin Import Localhost Sync Fix)

import React, { useState, useEffect } from "react";
import axios from "axios";

// ફિક્સ: લાઈવ રેન્ડરના બદલે લોકલ બેકએન્ડ સર્વરનો પાથ સેટ કર્યો
const API_BASE_URL = "http://localhost:5000";

export default function MockTestManager() {
  const [jsonInput, setJsonInput] = useState("");
  const [testList, setTestList] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchTests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/mock-tests/all`);
      if (res.data) setTestList(res.data);
    } catch (err) {
      console.error("Error loading tests locally:", err);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handlePublish = async () => {
    try {
      setStatusMsg("⚙️ પ્રોસેસિંગ ચાલુ છે...");
      const parsedData = JSON.parse(jsonInput);
      
      const res = await axios.post(`${API_BASE_URL}/api/mock-tests/bulk-import`, parsedData);
      if (res.data.success) {
        setStatusMsg("🚀 મોક ટેસ્ટ સફળતાપૂર્વક લોકલ પોર્ટલ પર લાઈવ થઈ ગઈ ભાઈ!");
        setJsonInput("");
        fetchTests();
      }
    } catch (err) {
      setStatusMsg("❌ ભયંકર ભૂલ: કાં તો JSON ફોર્મેટ ખોટું છે અથવા સર્વર બંધ છે!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("શું તમે સાચે જ આ મોક ટેસ્ટ ડીલીટ કરવા માંગો છો ભાઈ?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/mock-tests/${id}`);
      fetchTests();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={{ backgroundColor: "#09090b", color: "#f4f4f5", minHeight: "100vh", padding: "40px 24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ margin: 0, fontSize: "28px", color: "#fff" }}>🛠️ મોક ટેસ્ટ એડમિન કંટ્રોલ પેનલ (LOCAL MODE)</h1>
          <p style={{ color: "#FFE07D", margin: "6px 0 0 0" }}>👑 @missiontatgujrat સિક્રેટ લોકલ ડેશબોર્ડ</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          <div style={{ backgroundColor: "#1c1c1e", border: "1px solid #27272a", padding: "24px", borderRadius: "20px" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "#fff" }}>📥 બલ્ક મોક ટેસ્ટ ઇમ્પોર્ટર</h3>
            <p style={{ fontSize: "13px", color: "#a1a1aa", marginBottom: "12px" }}>તમારો આખો પ્રશ્નપત્રનો JSON ડેટા નીચેના બોક્સમાં પેસ્ટ કરો:</p>
            
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{ "title": "ગણિત મોક ટેસ્ટ - 01", "duration": 120, "questions": [...] }'
              style={{ width: "100%", height: "250px", backgroundColor: "#09090b", color: "#4ade80", border: "1px solid #27272a", borderRadius: "12px", padding: "12px", fontFamily: "monospace", fontSize: "13px", resize: "none", outline: "none" }}
            />

            <button onClick={handlePublish} style={{ width: "100%", background: "linear-gradient(135deg, #FFE07D 0%, #F5B041 100%)", color: "#000", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "bold", fontSize: "15px", cursor: "pointer", marginTop: "16px" }}>
              🚀 ટેસ્ટ લાઈવ પબ્લિશ કરો
            </button>
            {statusMsg && <p style={{ color: "#FFE07D", fontSize: "13px", marginTop: "12px", fontWeight: "bold" }}>{statusMsg}</p>}
          </div>

          <div style={{ backgroundColor: "#1c1c1e", border: "1px solid #27272a", padding: "24px", borderRadius: "20px" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "#fff" }}>📋 હાલની ચાલુ મોક ટેસ્ટ્સ ({testList.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {testList.length === 0 ? (
                <p style={{ color: "#71717a" }}>પોર્ટલ પર હજી સુધી એક પણ ટેસ્ટ અપલોડ નથી થઈ ભાઈ.</p>
              ) : (
                testList.map((test) => (
                  <div key={test.id} style={{ backgroundColor: "#09090b", border: "1px solid #27272a", padding: "16px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h5 style={{ margin: 0, color: "#fff", fontSize: "15px" }}>{test.title}</h5>
                      <span style={{ fontSize: "12px", color: "#71717a" }}>⏱️ {test.duration} મિનિટ | ❓ {test.questions?.length || 0} પ્રશ્નો</span>
                    </div>
                    <button onClick={() => handleDelete(test.id)} style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid #ef4444", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontWeight: "bold" }}>ડીલીટ</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}