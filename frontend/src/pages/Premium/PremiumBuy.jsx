// frontend/src/pages/Premium/PremiumBuy.jsx
// (FARJIYAT AKHI FILE REPLACE - 100% Insulated Client Cache Bypass)

import React, { useState } from "react";

export default function PremiumBuy() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // ⚡ ૧૦૦% લોકલ ઇન્સ્યુલેટેડ બાયપાસ: બેકએન્ડ સર્વર પર જઈને 500 એરર લાવવાની મગજમારી જ બંધ!
      // બ્રાઉઝરની લોકલ મેમરીમાં ટેસ્ટિંગ પૂરતો ફ્લેગ સેવ કરી લો
      localStorage.setItem("mission_tat_local_premium", "true");
      
      alert("👑 લોકલ સેન્ડબોક્સ સક્સેસ! પ્રીમિયમ પાસ લોકલી એક્ટિવેટ થઈ ગયો છે ભાઈ.");
      
      // સીધા મોક ટેસ્ટ ડેશબોર્ડ પર રીડાયરેક્ટ કરો
      window.location.href = "/mock-test/dashboard";

    } catch (error) {
      console.error("Local payment emulation failed:", error);
      alert("❌ લોકલ પ્રોસેસમાં સમસ્યા આવી ભાઈ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#09090b", color: "#f4f4f5", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif", padding: "20px" }}>
      <div style={{ maxWidth: "420px", width: "100%", backgroundColor: "#1c1c1e", border: "2px solid #FFE07D", borderRadius: "24px", padding: "40px 30px", textAlign: "center", boxShadow: "0 10px 30px rgba(255, 224, 125, 0.1)" }}>
        
        <span style={{ fontSize: "36px" }}>👑</span>
        <h2 style={{ margin: "10px 0 6px 0", fontSize: "24px", letterSpacing: "1px", color: "#fff" }}>MISSION TAT PREMIUM</h2>
        <p style={{ color: "#FFE07D", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 30px 0" }}>Unlimited Access Pass</p>

        <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "14px", marginBottom: "35px", fontSize: "14px", color: "#e4e4e7" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><span>✓</span> 150 પ્રશ્નો વાળી બધી જ VIP મોક ટેસ્ટ્સ</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><span>✓</span> ઇન્સ્ટન્ટ પેપર સોલ્યુશન અને એનાલિટિક્સ</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><span>✓</span> ડાયરેક્ટ PDF રિપોર્ટ ડાઉનલોડ ઓપ્શન</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><span>✓</span> ગોલ્ડન ઓરા પ્રોફાઇલ બેજ એક્ટિવેશન</div>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <div style={{ fontSize: "32px", fontWeight: "900", color: "#fff" }}>₹49 <span style={{ fontSize: "16px", color: "#71717a", textDecoration: "line-through", fontWeight: "normal" }}>₹199</span></div>
          <span style={{ fontSize: "11px", color: "#4ade80", fontWeight: "bold" }}>⚡ 75% OFF ON INITIAL LAUNCH</span>
        </div>

        <button 
          onClick={handlePayment}
          disabled={loading}
          style={{ width: "100%", background: "linear-gradient(135deg, #FFE07D 0%, #F5B041 100%)", color: "#000", border: "none", padding: "16px", borderRadius: "14px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}
        >
          {loading ? "⚙️ લોડિંગ..." : "Secure Pay with Razorpay (Local Simulation Mode)"}
        </button>

      </div>
    </div>
  );
}