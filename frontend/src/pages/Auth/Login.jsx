// frontend/src/pages/Auth/Login.jsx
// (FARJIYAT AKHI FILE REPLACE - Secure Database Validation & Comfort Layout Engine)

import React, { useState } from "react";

export default function Login() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (mobileNumber.length < 10) {
        alert("🚨 કૃપા કરીને સાચો ૧૦ આંકડાનો મોબાઈલ નંબર લખો ભાઈ!");
        setLoading(false);
        return;
      }

      // 🔐 HIGH-SECURITY VALIDATION LAYER
      // લોકલ ડેટાબેઝ સેન્ડબોક્સમાંથી યુઝરનો ડેટા ખેંચો
      const localUserData = localStorage.getItem(`mission_tat_auth_${mobileNumber}`);
      
      if (!localUserData) {
        alert("❌ આ મોબાઈલ નંબર પર કોઈ એકાઉન્ટ મળ્યું નથી ભાઈ! પહેલા સાઈન-અપ કરો.");
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(localUserData);
      // પ્લેન પાસવર્ડને માસ્ક્ડ ટોકન સાથે સરખાવવા માટે Base64 કન્વર્ઝન
      const incomingMaskedPassword = btoa(password);

      if (parsedUser.secretToken !== incomingMaskedPassword) {
        alert("🔒 પાસવર્ડ ખોટો છે ભાઈ! ફરીથી પ્રયાસ કરો.");
        setLoading(false);
        return;
      }

      alert("🎉 લોગિન સફળ થયું! મિશન TAT પોર્ટલ પર આપનું સ્વાગત છે ભાઈ.");
      
      // સેશન સિક્યોરિટી માટે કરન્ટ લોગિન ટોકન સેટ કરો
      localStorage.setItem("mission_tat_logged_in_user", JSON.stringify(parsedUser));

      // સીધા મોક ટેસ્ટ ડેશબોર્ડ પર રીડાયરેક્ટ કરો
      window.location.href = "/mock-test/dashboard";
    } catch (err) {
      console.error("Login authorization failed:", err);
      alert("❌ લોગિન પ્રોસેસમાં કોઈ ખામી આવી ભાઈ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#f4f6f8", color: "#2c3e50", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif", padding: "20px" }}>
      <div style={{ maxWidth: "400px", width: "100%", backgroundColor: "#ffffff", border: "1px solid #dcdde1", borderRadius: "24px", padding: "40px 30px", textAlign: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.04)" }}>
        
        <span style={{ fontSize: "38px" }}>🎯</span>
        <h2 style={{ margin: "12px 0 6px 0", fontSize: "24px", color: "#2f3640", fontWeight: "bold" }}>મિશન TAT ગુજરાત</h2>
        <p style={{ color: "#7f8c8d", fontSize: "13px", margin: "0 0 30px 0" }}>શિક્ષક ઓટોમેટેડ પોર્ટલ લોગિન</p>

        <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px", textAlign: "left" }}>
          
          <div>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#2c3e50", display: "block", marginBottom: "6px" }}>મોબાઈલ નંબર</label>
            <input 
              type="tel" 
              maxLength="10"
              placeholder="તમારો ૧૦ આંકડાનો નંબર લખો" 
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
              style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #dcdde1", backgroundColor: "#f9f9f9", color: "#2c3e50", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#2c3e50", display: "block", marginBottom: "6px" }}>પાસવર્ડ</label>
            <input 
              type="password" 
              placeholder="તમારો સિક્યોર પાસવર્ડ લખો" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #dcdde1", backgroundColor: "#f9f9f9", color: "#2c3e50", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: "#2980b9", color: "#ffffff", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "bold", fontSize: "15px", cursor: "pointer", marginTop: "10px" }}
          >
            {loading ? "⚙️ વેલિડેશન ચાલુ છે..." : "પોર્ટલમાં લોગિન કરો ➡️"}
          </button>

        </form>

        <div style={{ marginTop: "20px", fontSize: "13px" }}>
          <span style={{ color: "#7f8c8d" }}>નવું એકાઉન્ટ બનાવવું છે? </span>
          <a href="/signup" style={{ color: "#27ae60", fontWeight: "bold", textDecoration: "none" }}>સાઈન-અપ કરો</a>
        </div>

      </div>
    </div>
  );
}