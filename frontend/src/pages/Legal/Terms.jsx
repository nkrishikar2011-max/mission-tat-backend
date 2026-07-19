import React from "react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div style={{ backgroundColor: "#111827", color: "#ffffff", minHeight: "100vh", padding: "40px 20px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#1f2937", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
        <h1 style={{ color: "#dc2626", fontSize: "28px", borderBottom: "2px solid #374151", paddingBottom: "10px", marginBottom: "20px" }}>Terms & Conditions</h1>
        <p style={{ color: "#9ca3af", fontSize: "14px" }}>Last Updated: July 2026</p>
        
        <div style={{ lineHeight: "1.6", color: "#d1d5db", marginTop: "20px" }}>
          <h3 style={{ color: "#ffffff" }}>1. Acceptance of Terms</h3>
          <p>By accessing and using Mission TAT Gujarat (mission-tat-gujrat.vercel.app), you agree to comply with and be bound by these Terms and Conditions. If you do not agree, please do not use our platform.</p>
          
          <h3 style={{ color: "#ffffff", marginTop: "20px" }}>2. Digital Products & Content</h3>
          <p>All materials, PDFs, exam preparation notes, and mock tests available on this store are digital products. The content is for personal, educational, and non-commercial use only. Sharing, reproducing, or reselling this content without authorization is strictly prohibited.</p>
          
          <h3 style={{ color: "#ffffff", marginTop: "20px" }}>3. User Information</h3>
          <p>To access purchases, you must provide accurate details (Name and Mobile Number) at checkout. This information will be used purely for generating payment verification via Razorpay and granting access to the study material.</p>
          
          <h3 style={{ color: "#ffffff", marginTop: "20px" }}>4. Modifications to Service</h3>
          <p>We reserve the right to modify, update, or discontinue any product or service layout on the store at any time without prior notice.</p>
          
          <h3 style={{ color: "#ffffff", marginTop: "20px" }}>5. Contact Us</h3>
          <p>For any queries related to our terms, you can contact us via our official channel provided on the store page.</p>
        </div>
        
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <Link to="/store" style={{ backgroundColor: "#dc2626", color: "#fff", padding: "10px 20px", borderRadius: "6px", textDecoration: "none", fontWeight: "bold" }}>Back to Store</Link>
        </div>
      </div>
    </div>
  );
}