// frontend/src/pages/Admin/MockTestManager.jsx
// (Taddan navi file - Admin mate automatic 150 questions upload hub)

import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://mission-tat-backend.onrender.com";

export default function MockTestManager() {
  const [testDetails, setTestDetails] = useState({
    title: "",
    description: "",
    examType: "TET_1",
    testNumber: "1",
    duration: "120",
    isPaid: true
  });
  
  const [bulkText, setBulkText] = useState("");
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  const handlePublish = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    // Processing the text data into formatted array
    // Expected Format per question: QuestionText | Opt0 | Opt1 | Opt2 | Opt3 | CorrectIdx
    const lines = bulkText.split("\n").map(l => l.trim()).filter(Boolean);
    const parsedQuestions = lines.map(line => {
      const parts = line.split("|").map(p => p.trim());
      if (parts.length < 6) return null;
      return {
        questionText: parts[0],
        options: [parts[1], parts[2], parts[3], parts[4]],
        correctOption: parseInt(parts[5], 10)
      };
    }).filter(Boolean);

    if (parsedQuestions.length === 0) {
      setStatus({ loading: false, success: null, error: "🚨 કૃપા કરીને સાચા ફોર્મેટમાં પ્રશ્નો નાખો ભાઈ (Format: પ્રશ્ન | A | B | C | D | 0)" });
      return;
    }

    const finalPayload = {
      ...testDetails,
      questions: parsedQuestions,
      totalMarks: parsedQuestions.length
    };

    try {
      await axios.post(`${API_BASE_URL}/api/mock-tests/create`, finalPayload);
      setStatus({ loading: false, success: `🎉 મોક ટેસ્ટ નંબર ${testDetails.testNumber} (કુલ ગુણ: ${parsedQuestions.length}) સફળતાપૂર્વક લાઈવ થઈ ગઈ ભાઈ!`, error: null });
      setBulkText("");
    } catch (err) {
      setStatus({ loading: false, success: null, error: err.response?.data?.error || "ડેટા સેવ કરવામાં ભૂલ થઈ." });
    }
  };

  return (
    <div style={{ backgroundColor: "#09090b", color: "#f4f4f5", minHeight: "100vh", padding: "40px 24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        {/* Header Title */}
        <div style={{ borderBottom: "1px solid #27272a", paddingBottom: "20px", marginBottom: "30px" }}>
          <h1 style={{ margin: 0, background: "linear-gradient(135deg, #FFE07D 0%, #F5B041 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            👑 MOCK TEST BULK ARCHITECT
          </h1>
          <p style={{ color: "#a1a1aa", fontSize: "13px", margin: "6px 0 0 0" }}>MIDNIGHT CYBER GOLD AUTOLOAD SYSTEM</p>
        </div>

        {status.success && <div style={{ background: "rgba(22,163,74,0.15)", border: "1px solid #16a34a", color: "#22c55e", padding: "14px", borderRadius: "12px", marginBottom: "20px" }}>{status.success}</div>}
        {status.error && <div style={{ background: "rgba(220,38,38,0.15)", border: "1px solid #dc2626", color: "#ef4444", padding: "14px", borderRadius: "12px", marginBottom: "20px" }}>{status.error}</div>}

        <form onSubmit={handlePublish} style={{ backgroundColor: "#1c1c1e", padding: "30px", borderRadius: "24px", display: "flex", flexDirection: "column", gap: "20px", border: "1px solid #27272a" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div>
              <label style={{ fontSize: "13px", color: "#a1a1aa", display: "block", marginBottom: "6px" }}>🎯 પરીક્ષાનો પ્રકાર પસંદ કરો:</label>
              <select value={testDetails.examType} onChange={(e) => setTestDetails({...testDetails, examType: e.target.value})} style={{ width: "100%", background: "#09090b", border: "1px solid #27272a", padding: "12px", color: "#fff", borderRadius: "10px" }}>
                <option value="TET_1">TET 1 (ધોરણ 1 થી 5)</option>
                <option value="TET_2_MATHS">TET 2 - ગણિત / વિજ્ઞાન</option>
                <option value="TET_2_SS">TET 2 - સામાજિક વિજ્ઞાન</option>
                <option value="TET_2_LANG">TET 2 - ભાષાઓ</option>
              </select>
            </div>
            
            <div>
              <label style={{ fontSize: "13px", color: "#a1a1aa", display: "block", marginBottom: "6px" }}>🔢 ટેસ્ટ નંબર (1 થી 50):</label>
              <input type="number" required value={testDetails.testNumber} onChange={(e) => setTestDetails({...testDetails, testNumber: e.target.value})} style={{ width: "100%", background: "#09090b", border: "1px solid #27272a", padding: "12px", color: "#fff", borderRadius: "10px" }} />
            </div>
          </div>

          <input type="text" placeholder="ટેસ્ટ ટાઇટલ (દા.ત. ગણિત-વિજ્ઞાન સુપર મોક ટેસ્ટ - 01)" required value={testDetails.title} onChange={(e) => setTestDetails({...testDetails, title: e.target.value})} style={{ background: "#09090b", border: "1px solid #27272a", padding: "12px", color: "#fff", borderRadius: "10px" }} />
          <textarea placeholder="ટેસ્ટ વિશે ડિસ્ક્રિપ્શન (Description)" rows="2" value={testDetails.description} onChange={(e) => setTestDetails({...testDetails, description: e.target.value})} style={{ background: "#09090b", border: "1px solid #27272a", padding: "12px", color: "#fff", borderRadius: "10px" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div>
              <label style={{ fontSize: "13px", color: "#a1a1aa", display: "block", marginBottom: "6px" }}>⏱️ સમય અવધિ (મિનિટ):</label>
              <input type="number" value={testDetails.duration} onChange={(e) => setTestDetails({...testDetails, duration: e.target.value})} style={{ width: "100%", background: "#09090b", border: "1px solid #27272a", padding: "12px", color: "#fff", borderRadius: "10px" }} />
            </div>
            <div>
              <label style={{ fontSize: "13px", color: "#a1a1aa", display: "block", marginBottom: "6px" }}>🔓 એક્સેસ પ્રકાર:</label>
              <select value={testDetails.isPaid ? "true" : "false"} onChange={(e) => setTestDetails({...testDetails, isPaid: e.target.value === "true"})} style={{ width: "100%", background: "#09090b", border: "1px solid #27272a", padding: "12px", color: "#fff", borderRadius: "10px" }}>
                <option value="false">Free (ટ્રાયલ માટે)</option>
                <option value="true">Premium Plan (🔒 ₹49 Unlimited)</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", color: "#FFE07D", fontWeight: "bold" }}>🤖 AI / Excel બલ્ક ઇમ્પોર્ટર બોક્સ:</label>
            <p style={{ margin: "0 0 6px 0", color: "#71717a", fontSize: "11px" }}>ફોર્મેટ: પ્રશ્ન લખાણ | ઓપ્શન A | ઓપ્શન B | ઓપ્શન C | ઓપ્શન D | સાચો ઇન્ડેક્સ (0=A, 1=B, 2=C, 3=D)</p>
            <textarea 
              rows="12"
              placeholder="ભારતનું પાટનગર કયું છે? | મુંબઈ | દિલ્હી | ચેન્નાઈ | કોલકાતા | 1&#10;બીજો પ્રશ્ન અહીં... | A | B | C | D | 0"
              required 
              value={bulkText} 
              onChange={(e) => setBulkText(e.target.value)} 
              style={{ background: "#09090b", border: "1px solid #27272a", padding: "14px", color: "#a3e635", borderRadius: "12px", fontFamily: "monospace", fontSize: "12px", lineHeight: "1.6" }} 
            />
          </div>

          <button type="submit" disabled={status.loading} style={{ background: "linear-gradient(135deg, #FFE07D 0%, #F5B041 100%)", color: "#000", padding: "14px", borderRadius: "12px", border: "none", fontWeight: "bold", cursor: "pointer", fontSize: "15px", letterSpacing: "0.5px" }}>
            {status.loading ? "⚙️ પ્રોસેસિંગ અને ઓટો-સેવિંગ..." : "🚀 મોક ટેસ્ટ લાઈવ કરો"}
          </button>
        </form>
      </div>
    </div>
  );
}