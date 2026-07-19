// frontend/src/pages/MockTest/AnalyticsReport.jsx
// (FARJIYAT AKHI FILE REPLACE - Router Context Immunity Edition)

import React, { useState, useEffect } from "react";

export default function AnalyticsReport() {
  const [loading, setLoading] = useState(true);

  const [analyticsData, setAnalyticsData] = useState({
    overallRank: "24 / 1,450",
    globalPercentile: "98.3%",
    averageTimePerQuestion: "42 સેકન્ડ",
    accuracyRate: "85.3%",
    sections: [
      { name: "ગણિત અને તાર્કિક ક્ષમતા (Content)", correct: 68, total: 75, color: "#FFE07D" },
      { name: "શિક્ષણશાસ્ત્ર અને મનોવિજ્ઞાન (Pedagogy)", correct: 32, total: 40, color: "#4ade80" },
      { name: "સામાન્ય જ્ઞાન અને વર્તમાન પ્રવાહો (GK)", correct: 18, total: 25, color: "#60a5fa" },
      { name: "ભાષાકીય સજ્જતા (ગુજરાતી / અંગ્રેજી)", correct: 10, total: 10, color: "#a78bfa" }
    ]
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // ⚡ Router Context વગર ડાયરેક્ટ નેવિગેશન બાયપાસ
  const handleGoDashboard = () => {
    window.location.href = "/mock-test/dashboard";
  };

  if (loading) return <div style={{ color: "#FFE07D", backgroundColor: "#09090b", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>⚙️ પર્સનલાઇઝ્ડ રિપોર્ટ જનરેટ થઈ રહ્યો છે...</div>;

  return (
    <div style={{ backgroundColor: "#09090b", color: "#f4f4f5", minHeight: "100vh", padding: "40px 24px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        {/* HEADER BLOCK */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1c1c1e", border: "1px solid #27272a", padding: "20px 30px", borderRadius: "20px", marginBottom: "30px" }}>
          <div>
            <span style={{ fontSize: "11px", color: "#FFE07D", fontWeight: "bold", textTransform: "uppercase" }}>એડવાન્સ પર્ફોર્મન્સ ડાયગ્નોસ્ટિક્સ</span>
            <h2 style={{ margin: "4px 0 0 0", color: "#fff", fontSize: "22px" }}>📊 તમારો ઊંડાણપૂર્વકનો એનાલિટિક્સ રિપોર્ટ</h2>
          </div>
          <button onClick={handleGoDashboard} style={{ background: "linear-gradient(135deg, #FFE07D 0%, #F5B041 100%)", color: "#000", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
            ડેશબોર્ડ પર પાછા જાઓ
          </button>
        </div>

        {/* TOP METRICS GRID BANNER */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "30px" }}>
          {[
            { label: "ઓલ ગુજરાત રેન્ક", val: analyticsData.overallRank, icon: "🏆", color: "#FFE07D" },
            { label: "પર્સન્ટાઈલ સ્કોર", val: analyticsData.globalPercentile, icon: "⚡", color: "#4ade80" },
            { label: "ચોકસાઈ દર (Accuracy)", val: analyticsData.accuracyRate, icon: "🎯", color: "#60a5fa" },
            { label: "સરેરાશ સમય / પ્રશ્ન", val: analyticsData.averageTimePerQuestion, icon: "⏱️", color: "#a78bfa" }
          ].map((item, i) => (
            <div key={i} style={{ backgroundColor: "#1c1c1e", border: "1px solid #27272a", padding: "20px", borderRadius: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "20px", marginBottom: "6px" }}>{item.icon}</div>
              <div style={{ fontSize: "11px", color: "#a1a1aa", fontWeight: "bold", textTransform: "uppercase", marginBottom: "6px" }}>{item.label}</div>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: item.color }}>{item.val}</div>
            </div>
          ))}
        </div>

        {/* MAIN ANALYSIS CONTENT */}
        <div style={{ backgroundColor: "#1c1c1e", border: "1px solid #27272a", padding: "30px", borderRadius: "24px", marginBottom: "30px" }}>
          <h3 style={{ margin: "0 0 24px 0", color: "#fff", fontSize: "18px" }}>📚 વિષયવાર પ્રદર્શન વિશ્લેષણ</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {analyticsData.sections.map((sec, idx) => {
              const percentage = ((sec.correct / sec.total) * 100).toFixed(1);
              return (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                    <span style={{ color: "#fff", fontWeight: "bold" }}>{sec.name}</span>
                    <span style={{ color: sec.color, fontWeight: "bold" }}>{sec.correct} / {sec.total} ({percentage}%)</span>
                  </div>
                  <div style={{ width: "100%", height: "10px", backgroundColor: "#09090b", borderRadius: "99px", overflow: "hidden" }}>
                    <div style={{ width: `${percentage}%`, height: "100%", background: sec.color, borderRadius: "99px" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI INSIGHT CARD */}
        <div style={{ backgroundColor: "rgba(255,224,125,0.02)", border: "1px solid rgba(255,224,125,0.2)", padding: "24px", borderRadius: "20px" }}>
          <h4 style={{ margin: "0 0 8px 0", color: "#FFE07D", fontSize: "15px" }}>💡 મિશન TAT નિષ્ણાત માર્ગદર્શન (AI Insights)</h4>
          <p style={{ margin: 0, fontSize: "13px", color: "#a1a1aa", lineHeight: "1.6" }}>
            નિતિનભાઈ, તમારું પ્રદર્શન ખૂબ જ ઉત્કૃષ્ટ રહ્યું છે. સેકન્ડરી મેઈન્સ પરીક્ષાને ધ્યાનમાં રાખતા મહેનત ચાલુ રાખો, તમે સેફ ઝોનમાં છો ભાઈ!
          </p>
        </div>

      </div>
    </div>
  );
}