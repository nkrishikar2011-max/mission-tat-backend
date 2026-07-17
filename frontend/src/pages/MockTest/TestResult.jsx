// frontend/src/pages/MockTest/TestResult.jsx
// (FARJIYAT AKHI FILE REPLACE - Secure Mock Test Result Score Analytics Matrix)

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function TestResult() {
  const { attemptId } = useParams();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // લોકલ ડેટાબેઝ સેન્ડબોક્સમાંથી કરન્ટ એટેમ્પ્ટનું રિઝલ્ટ ખેંચો
    const localData = localStorage.getItem(`mission_tat_result_${attemptId}`);
    
    if (localData) {
      setResultData(JSON.parse(localData));
    } else {
      // સેન્ડબોક્સ બેકઅપ ડમી રિઝલ્ટ મેટ્રિક્સ (૧૫૦ પ્રશ્નોના સ્કેલ પર)
      setResultData({
        attemptId,
        testId: "tat_live_mock_test",
        totalQuestions: 150,
        score: 112,
        correctCount: 112,
        wrongCount: 28,
        skippedCount: 10,
        submittedAt: new Date().toISOString()
      });
    }
    setLoading(false);
  }, [attemptId]);

  if (loading) return <div style={{ color: "#2c3e50", backgroundColor: "#f4f6f8", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif" }}>⚙️ પરિણામ વિશ્લેષણ લોડ થઈ રહ્યું છે...</div>;

  // પાસિંગ પર્સેન્ટેજ કેલ્ક્યુલેશન
  const accuracyRate = Math.round((resultData.correctCount / (resultData.totalQuestions - resultData.skippedCount || 1)) * 100);

  return (
    <div style={{ backgroundColor: "#f4f6f8", color: "#2c3e50", minHeight: "100vh", padding: "40px 24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", backgroundColor: "#ffffff", border: "1px solid #dcdde1", borderRadius: "24px", padding: "40px", boxShadow: "0 8px 24px rgba(0,0,0,0.03)", textAlign: "center" }}>
        
        <span style={{ fontSize: "50px" }}>🏆</span>
        <h2 style={{ margin: "15px 0 4px 0", color: "#2f3640", fontSize: "24px", fontWeight: "bold" }}>મોક ટેસ્ટ પરિણામ વિશ્લેષણ</h2>
        <p style={{ color: "#7f8c8d", fontSize: "13px", margin: "0 0 35px 0" }}>મિશન TAT ગુજરાત ઓટોમેટેડ ઈવેલ્યુએશન રીપોર્ટ</p>

        {/* SCORE BADGE DISPLAY */}
        <div style={{ display: "inline-block", backgroundColor: "#e8f4fd", border: "1px solid #d4e6f1", borderRadius: "20px", padding: "20px 40px", marginBottom: "35px" }}>
          <span style={{ fontSize: "12px", color: "#2980b9", fontWeight: "bold", display: "block", textTransform: "uppercase" }}>તમારો કુલ સ્કોર</span>
          <h1 style={{ margin: "5px 0 0 0", fontSize: "48px", color: "#2c3e50", fontWeight: "900" }}>
            {resultData.score} <span style={{ fontSize: "20px", color: "#7f8c8d", fontWeight: "normal" }}>/ {resultData.totalQuestions}</span>
          </h1>
        </div>

        {/* DETAILED STATS COUNTERS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
          <div style={{ backgroundColor: "#e8f8f5", border: "1px solid #d1f2eb", padding: "18px", borderRadius: "16px" }}>
            <span style={{ fontSize: "22px" }}>🟢</span>
            <h4 style={{ margin: "8px 0 2px 0", fontSize: "18px", color: "#27ae60" }}>{resultData.correctCount}</h4>
            <p style={{ margin: 0, fontSize: "12px", color: "#7f8c8d" }}>સાચા જવાબો</p>
          </div>
          <div style={{ backgroundColor: "#fadbd8", border: "1px solid #f9ebd2", padding: "18px", borderRadius: "16px" }}>
            <span style={{ fontSize: "22px" }}>🔴</span>
            <h4 style={{ margin: "8px 0 2px 0", fontSize: "18px", color: "#c0392b" }}>{resultData.wrongCount}</h4>
            <p style={{ margin: 0, fontSize: "12px", color: "#7f8c8d" }}>ખોટા જવાબો</p>
          </div>
          <div style={{ backgroundColor: "#f5f6fa", border: "1px solid #dcdde1", padding: "18px", borderRadius: "16px" }}>
            <span style={{ fontSize: "22px" }}>⚪</span>
            <h4 style={{ margin: "8px 0 2px 0", fontSize: "18px", color: "#7f8c8d" }}>{resultData.skippedCount}</h4>
            <p style={{ margin: 0, fontSize: "12px", color: "#7f8c8d" }}>બાકી મુકેલા</p>
          </div>
        </div>

        {/* ADDITIONAL PERFORMANCE ANALYTICS */}
        <div style={{ borderTop: "1px solid #f1f2f6", paddingTop: "25px", marginBottom: "35px", textAlign: "left", fontSize: "14px", color: "#2c3e50" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span>🎯 તમારી સચોટતા (Accuracy Rate):</span>
            <strong>{accuracyRate}%</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>📅 સબમિશન સમય:</span>
            <strong style={{ color: "#7f8c8d" }}>{new Date(resultData.submittedAt).toLocaleString("gu-IN")}</strong>
          </div>
        </div>

        {/* ACTION ACTION BUTTONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button 
            onClick={() => window.location.href = `/mock-test/answer-key/${attemptId}`}
            style={{ width: "100%", background: "linear-gradient(135deg, #2980b9 0%, #3498db 100%)", color: "#ffffff", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "bold", fontSize: "15px", cursor: "pointer", boxShadow: "0 4px 12px rgba(41,128,185,0.2)" }}
          >
            📖 સંપૂર્ણ સોલ્યુશન અને આન્સર કી જુઓ
          </button>
          
          <button 
            onClick={() => window.location.href = "/mock-test/dashboard"}
            style={{ width: "100%", backgroundColor: "#f5f6fa", color: "#2c3e50", border: "1px solid #dcdde1", padding: "14px", borderRadius: "12px", fontWeight: "bold", fontSize: "15px", cursor: "pointer" }}
          >
            🏫 મુખ્ય ડેશબોર્ડ પર પાછા ફરો
          </button>
        </div>

      </div>
    </div>
  );
}