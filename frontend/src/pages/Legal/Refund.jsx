import React from "react";
import { Link } from "react-router-dom";

export default function Refund() {
  return (
    <div style={{ backgroundColor: "#111827", color: "#ffffff", minHeight: "100vh", padding: "40px 20px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#1f2937", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
        <h1 style={{ color: "#dc2626", fontSize: "28px", borderBottom: "2px solid #374151", paddingBottom: "10px", marginBottom: "20px" }}>Refund & Cancellation Policy</h1>
        <p style={{ color: "#9ca3af", fontSize: "14px" }}>Last Updated: July 2026</p>
        
        <div style={{ lineHeight: "1.6", color: "#d1d5db", marginTop: "20px" }}>
          <h3 style={{ color: "#ffffff" }}>1. Digital Product Policy</h3>
          <p>All items sold on Mission TAT Gujarat are instant-access digital PDFs and educational study notes. Due to the irreversible nature of digital content delivery, all purchases made are final.</p>
          
          <h3 style={{ color: "#ffffff", marginTop: "20px" }}>2. No Refunds</h3>
          <p>We do not offer any cash refunds, order cancellations, or returns once a premium pack has been successfully unlocked and associated with your user identity.</p>
          
          <h3 style={{ color: "#ffffff", marginTop: "20px" }}>3. Failed Transactions & Double Deductions</h3>
          <p>In case money is deducted from your account but the premium content remains locked, the issue is typically resolved automatically by the payment gateway. If a double payment occurs due to technical glitches, the excess amount will be refunded directly to your original payment source via Razorpay within 5-7 working days.</p>
          
          <h3 style={{ color: "#ffffff", marginTop: "20px" }}>4. Support</h3>
          <p>If you experience any platform issues while viewing or accessing your purchased content, please reach out with transaction proof for prompt assistance.</p>
        </div>
        
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <Link to="/store" style={{ backgroundColor: "#dc2626", color: "#fff", padding: "10px 20px", borderRadius: "6px", textDecoration: "none", fontWeight: "bold" }}>Back to Store</Link>
        </div>
      </div>
    </div>
  );
}