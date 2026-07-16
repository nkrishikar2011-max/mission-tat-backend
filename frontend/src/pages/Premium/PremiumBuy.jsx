// frontend/src/pages/Premium/PremiumBuy.jsx
// (Taddan navi file - Midnight Cyber Gold Theme sathe Razorpay Payment Gateway Hub)

import React, { useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://mission-tat-backend.onrender.com";

export default function PremiumBuy() {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Load Razorpay SDK Script Dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user) {
      alert("🚨 Premium package kharidva mate pehla login karo bhai!");
      navigate("/login");
      return;
    }

    setLoading(true);
    const resScript = await loadRazorpayScript();

    if (!resScript) {
      alert("Razorpay SDK load thama bhool thai. Net check karo bhai!");
      setLoading(false);
      return;
    }

    try {
      // 1. Create order on backend
      const orderRes = await axios.post(`${API_BASE_URL}/api/payments/create-order`, {
        userId: user.uid,
        amount: 49, // ₹49 Rupees Only
      });

      const { id: order_id, amount, currency } = orderRes.data;

      // 2. Open Razorpay Checkout Window
      const options = {
        key: "rzp_test_YOUR_KEY_HERE", // Tare real key sathe replace karvi
        amount: amount.toString(),
        currency: currency,
        name: "Mission TAT Gujarat",
        description: "Premium Mock Test Module Unlock",
        image: "https://lh3.googleusercontent.com/d/YOUR_IMAGE_ID", // Channel logo url
        order_id: order_id,
        handler: async function (response) {
          // 3. Verify payment on backend after success
          try {
            const verifyRes = await axios.post(`${API_BASE_URL}/api/payments/verify`, {
              userId: user.uid,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              alert("👑 Badhai ho bhai! Premium status active thai gayu!");
              navigate("/mock-test/dashboard");
            } else {
              alert("Payment verification fail thayu!");
            }
          } catch (err) {
            console.error(err);
            alert("Payment verify karvama error aavi!");
          }
        },
        prefill: {
          name: user.displayName || "",
          email: user.email || "",
        },
        theme: {
          color: "#FFE07D", // Cyber Gold Theme Primary Color
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert("Backend order creation ma locho thayo!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#09090b", color: "#f4f4f5", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", fontFamily: "sans-serif" }}>
      
      {/* Glowing Premium Box */}
      <div style={{ background: "linear-gradient(135deg, #1c1c1e 0%, #09090b 100%)", border: "2px solid #FFE07D", padding: "40px", borderRadius: "24px", maxWidth: "450px", width: "100%", textAlign: "center", boxShadow: "0 0 30px rgba(255, 224, 125, 0.15)" }}>
        
        <div style={{ fontSize: "50px", marginBottom: "10px" }}>👑</div>
        <h1 style={{ margin: "0 0 10px 0", color: "#fff", fontSize: "26px" }}>MISSION TAT PREMIUM</h1>
        <p style={{ color: "#FFE07D", fontWeight: "bold", fontSize: "14px", letterSpacing: "1px" }}>UNLIMITIED ACCESS PASS</p>
        
        <div style={{ height: "1px", backgroundColor: "#27272a", margin: "24px 0" }}></div>
        
        {/* Features List */}
        <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "14px", marginBottom: "30px" }}>
          <div style={{ display: "flex", gap: "10px", fontSize: "15px" }}>✔️ <span style={{ color: "#e4e4e7" }}>150 Prashno vali badhi j VIP Mock Tests</span></div>
          <div style={{ display: "flex", gap: "10px", fontSize: "15px" }}>✔️ <span style={{ color: "#e4e4e7" }}>Instant Paper Solution & Analytics</span></div>
          <div style={{ display: "flex", gap: "10px", fontSize: "15px" }}>✔️ <span style={{ color: "#e4e4e7" }}>Direct PDF Report Download Option</span></div>
          <div style={{ display: "flex", gap: "10px", fontSize: "15px" }}>✔️ <span style={{ color: "#e4e4e7" }}>Golden Aura Profile Badge Activation</span></div>
        </div>

        {/* Price Tag */}
        <div style={{ marginBottom: "24px" }}>
          <span style={{ fontSize: "40px", fontWeight: "bold", color: "#fff" }}>₹49</span>
          <span style={{ color: "#71717a", textDecoration: "line-through", marginLeft: "10px", fontSize: "18px" }}>₹199</span>
          <p style={{ margin: "4px 0 0 0", color: "#4ade80", fontSize: "12px", fontWeight: "bold" }}>🎉 75% OFF ON INITIAL LAUNCH</p>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          style={{ width: "100%", background: "linear-gradient(135deg, #FFE07D 0%, #F5B041 100%)", color: "#000", border: "none", padding: "16px", borderRadius: "14px", fontWeight: "bold", cursor: "pointer", fontSize: "16px", boxShadow: "0 4px 15px rgba(255, 224, 125, 0.3)", transition: "all 0.2s" }}
        >
          {loading ? "Processing..." : "Secure Pay with Razorpay"}
        </button>

      </div>
    </div>
  );
}