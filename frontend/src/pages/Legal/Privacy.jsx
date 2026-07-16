import React from "react";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div style={{ backgroundColor: "#111827", color: "#ffffff", minHeight: "100vh", padding: "40px 20px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#1f2937", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
        <h1 style={{ color: "#dc2626", fontSize: "28px", borderBottom: "2px solid #374151", paddingBottom: "10px", marginBottom: "20px" }}>Privacy Policy</h1>
        <p style={{ color: "#9ca3af", fontSize: "14px" }}>Last Updated: July 2026</p>
        
        <div style={{ lineHeight: "1.6", color: "#d1d5db", marginTop: "20px" }}>
          <h3 style={{ color: "#ffffff" }}>1. Information We Collect</h3>
          <p>We collect minimal required information when you interact with our platform. During the checkout process for purchasing premium materials, we securely ask for your Name and Mobile Number.</p>
          
          <h3 style={{ color: "#ffffff", marginTop: "20px" }}>2. How We Use Your Data</h3>
          <p>The collected information is used solely to securely process transactions through Razorpay, generate unique user purchase tracking in our Firebase database, and maintain accurate records of download access counts.</p>
          
          <h3 style={{ color: "#ffffff", marginTop: "20px" }}>3. Data Security</h3>
          <p>We do not store your credit card, debit card, or net banking passwords. All financial transactions are handled securely by Razorpay using high-standard encryption. User purchase statuses are securely managed within our private Firebase setup.</p>
          
          <h3 style={{ color: "#ffffff", marginTop: "20px" }}>4. Third-Party Services</h3>
          <p>We do not sell, trade, or share your personal data with any external advertising networks. Third-party interactions are strictly restricted to payment handling (Razorpay) and web hosting (Vercel).</p>
        </div>
        
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <Link to="/store" style={{ backgroundColor: "#dc2626", color: "#fff", padding: "10px 20px", borderRadius: "6px", textDecoration: "none", fontWeight: "bold" }}>Back to Store</Link>
        </div>
      </div>
    </div>
  );
}