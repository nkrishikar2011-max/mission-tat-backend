// frontend/src/pages/MockTest/TestResult.jsx
// (Taddan navi file - Scorecard ane client-side PDF Generator report hub)

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://mission-tat-backend.onrender.com";

export default function TestResult() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/mock-tests/user-history/USER_FIREBASE_ID_TEMPORARY`)
      .then(res => {
        const currentAttempt = res.data.find(a => a.id === attemptId);
        if (currentAttempt) {
          setAttempt(currentAttempt);
          // Fetch main test structure for review mode
          return axios.get(`${API_BASE_URL}/api/mock-tests/${currentAttempt.testId}`);
        }
      })
      .then(res => {
        if (res) setTestData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [attemptId]);

  const handlePrintPDF = () => {
    window.print(); // Direct browser-level optimized layout print
  };

  if (loading) return <div style={{ color: "#FFE07D", backgroundColor: "#09090b", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>📊 રિઝલ્ટ પ્રોસેસ થઈ રહ્યું છે...</div>;
  if (!attempt || !testData) return <div style={{ color: "#ef4444", backgroundColor: "#09090b", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>🚨 રિઝલ્ટ ડેટા મળ્યો નથી ભાઈ!</div>;

  return (
    <div className="print-container" style={{ backgroundColor: "#09090b", color: "#f4f4f5", minHeight: "100vh", padding: "40px 24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Glassmorphic Score Box */}
        <div style={{ background: "linear-gradient(135deg, rgba(255,224,77,0.05) 0%, rgba(245,176,65,0.05) 100%)", backdropFilter: "blur(16px)", border: "1px solid #FFE07D", padding: "40px", borderRadius: "24px", textAlign: "center", marginBottom: "30px", boxShadow: "0 0 20px rgba(255,224,77,0.1)" }}>
          <h1 style={{ margin: 0, color: "#FFE07D", letterSpacing: "1px" }}>🎯 પરીક્ષાનું પરિણામ</h1>
          <div style={{ fontSize: "64px", fontWeight: "bold", margin: "20px 0", color: "#fff" }}>
            {attempt.score} <span style={{ fontSize: "24px", color: "#a1a1aa" }}>/ {attempt.totalQuestions}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginTop: "10px" }}>
            <span style={{ color: "#4ade80" }}>✔️ સાચા: {attempt.correctCount}</span>
            <span style={{ color: "#ef4444" }}>❌ ખોટા: {attempt.wrongCount}</span>
          </div>
          
          <button onClick={handlePrintPDF} className="no-print" style={{ marginTop: "24px", background: "linear-gradient(135deg, #FFE07D 0%, #F5B041 100%)", color: "#000", border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
            📥 PDF રિપોર્ટ ડાઉનલોડ કરો
          </button>
        </div>

        {/* Detailed Question Review Mode */}
        <h2 style={{ color: "#fff", marginBottom: "20px" }}>💡 પેપર સોલ્યુશન રિવ્યૂ</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {testData.questions.map((q, idx) => {
            const userAns = attempt.userAnswers[q.questionId];
            const isCorrect = userAns !== undefined && Number(userAns) === q.correctOption;

            return (
              <div key={idx} style={{ backgroundColor: "#1c1c1e", border: "1px solid #27272a", padding: "20px", borderRadius: "16px" }}>
                <h4 style={{ margin: "0 0 12px 0", color: "#fff", lineHeight: "1.4" }}>{idx + 1}. {q.questionText}</h4>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {q.options.map((opt, oIdx) => {
                    let optBg = "#09090b";
                    let optBorder = "1px solid #27272a";
                    let labelColor = "#a1a1aa";

                    if (oIdx === q.correctOption) {
                      optBg = "rgba(34,197,94,0.15)";
                      optBorder = "1px solid #22c55e";
                      labelColor = "#22c55e";
                    } else if (userAns !== undefined && oIdx === Number(userAns) && !isCorrect) {
                      optBg = "rgba(239,68,68,0.15)";
                      optBorder = "1px solid #ef4444";
                      labelColor = "#ef4444";
                    }

                    return (
                      <div key={oIdx} style={{ padding: "12px", background: optBg, border: optBorder, color: "#fff", borderRadius: "8px", fontSize: "14px" }}>
                        <strong style={{ marginRight: "8px", color: labelColor }}>{String.fromCharCode(65 + oIdx)}.</strong> {opt}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}