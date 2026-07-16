// frontend/src/pages/Admin/MockTestManager.jsx
// (FARJIYAT AKHI FILE REPLACE - Full Admin Control Console)

import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://mission-tat-backend.onrender.com";

export default function MockTestManager() {
  const [tests, setTests] = useState([]);
  const [bulkJson, setBulkJson] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  // Fetch Existing Tests
  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = () => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/api/mock-tests/all`)
      .then(res => {
        setTests(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  // Bulk JSON Import Action
  const handleImportJson = async () => {
    if (!bulkJson.trim()) {
      setStatusMsg({ type: "error", text: "ભોગા ભાઈ! પેલા JSON ડેટા તો નાખો!" });
      return;
    }

    try {
      const parsedData = JSON.parse(bulkJson);
      const res = await axios.post(`${API_BASE_URL}/api/mock-tests/bulk-import`, parsedData);
      
      setStatusMsg({ type: "success", text: `સક્સેસફુલ! ૧૫૦ પ્રશ્નો વાળી ટેસ્ટ ધડાધડ અપલોડ થઈ ગઈ ભાઈ!` });
      setBulkJson("");
      fetchTests(); // Refresh the grid
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: "error", text: "JSON ફોર્મેટમાં કંઈક લોચો છે, બરાબર ચેક કરો ભાઈ!" });
    }
  };

  // Delete Test Action
  const handleDeleteTest = async (id) => {
    if (!window.confirm("ખરેખર આ મોક ટેસ્ટ ડીલીટ કરવી છે ભાઈ?")) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/api/mock-tests/${id}`);
      setStatusMsg({ type: "success", text: "ટેસ્ટ સક્સેસફુલ ડીલીટ થઈ ગઈ!" });
      fetchTests();
    } catch (err) {
      setStatusMsg({ type: "error", text: "ડીલીટ કરવામાં ભૂલ થઈ!" });
    }
  };

  return (
    <div style={{ backgroundColor: "#09090b", color: "#f4f4f5", minHeight: "100vh", padding: "40px 24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* Title Header */}
        <div style={{ borderBottom: "1px solid #27272a", paddingBottom: "20px", marginBottom: "30px" }}>
          <h1 style={{ margin: 0, fontSize: "28px", color: "#fff" }}>🛠️ મોક ટેસ્ટ એડમિન કંટ્રોલ પેનલ</h1>
          <p style={{ color: "#FFE07D", margin: "6px 0 0 0", fontSize: "14px", fontWeight: "bold" }}>👑 @missiontatgujrat સિક્રેટ ડેશબોર્ડ</p>
        </div>

        {/* Alerts Box */}
        {statusMsg.text && (
          <div style={{ padding: "16px", borderRadius: "12px", marginBottom: "24px", backgroundColor: statusMsg.type === "success" ? "rgba(74,222,128,0.1)" : "rgba(239,68,68,0.1)", border: statusMsg.type === "success" ? "1px solid #4ade80" : "1px solid #ef4444", color: statusMsg.type === "success" ? "#4ade80" : "#ef4444", fontWeight: "bold" }}>
            {statusMsg.text}
          </div>
        )}

        {/* Main Split Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
          
          {/* Left Column: Bulk JSON Box */}
          <div style={{ backgroundColor: "#1c1c1e", border: "1px solid #27272a", padding: "24px", borderRadius: "20px" }}>
            <h3 style={{ margin: "0 0 12px 0", color: "#fff" }}>📥 બલ્ક મોક ટેસ્ટ ઇમ્પોર્ટર</h3>
            <p style={{ color: "#a1a1aa", fontSize: "13px", marginBottom: "16px" }}>તમારો આખો પ્રશ્નપત્રનો JSON ડેટા નીચેના બોક્સમાં પેસ્ટ કરો:</p>
            
            <textarea
              rows="12"
              value={bulkJson}
              onChange={(e) => setBulkJson(e.target.value)}
              placeholder='{ "title": "ગણિત મોક ટેસ્ટ - 01", "duration": 120, "questions": [...] }'
              style={{ width: "100%", backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "12px", padding: "14px", color: "#FFE07D", fontFamily: "monospace", fontSize: "13px", resize: "vertical" }}
            />
            
            <button
              onClick={handleImportJson}
              style={{ width: "100%", marginTop: "16px", background: "linear-gradient(135deg, #FFE07D 0%, #F5B041 100%)", color: "#000", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", fontSize: "15px" }}
            >
              🚀 ટેસ્ટ લાઈવ પબ્લિશ કરો
            </button>
          </div>

          {/* Right Column: Active Tests List Management */}
          <div style={{ backgroundColor: "#1c1c1e", border: "1px solid #27272a", padding: "24px", borderRadius: "20px" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "#fff" }}>📋 હાલની ચાલુ મોક ટેસ્ટ્સ ({tests.length})</h3>
            
            {loading ? (
              <div style={{ color: "#FFE07D" }}>ટેસ્ટ લિસ્ટ લોડ થઈ રહ્યું છે...</div>
            ) : tests.length === 0 ? (
              <div style={{ color: "#71717a" }}>પોર્ટલ પર હજી સુધી એક પણ ટેસ્ટ અપલોડ નથી થઈ ભાઈ.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "420px", overflowY: "auto", paddingRight: "4px" }}>
                {tests.map((test) => (
                  <div key={test.id} style={{ backgroundColor: "#09090b", border: "1px solid #27272a", padding: "16px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h4 style={{ margin: 0, color: "#fff", fontSize: "16px" }}>{test.title}</h4>
                      <div style={{ display: "flex", gap: "12px", marginTop: "6px", fontSize: "12px", color: "#a1a1aa" }}>
                        <span>⏱️ {test.duration} મિ.</span>
                        <span>❓ Qs: {test.questions?.length || 0}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteTest(test.id)}
                      style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid #ef4444", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontWeight: "bold" }}
                    >
                      🗑️ ડીલીટ
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}