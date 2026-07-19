// backend/controllers/paymentController.js
// (FARJIYAT AKHI FILE REPLACE - Absolute Razorpay Key Alignment Fix)

import Razorpay from "razorpay";
import crypto from "crypto";
import { db } from "../config/firebase.js";

// ફિક્સ: ફ્રન્ટએન્ડ સાથે ૧૦０% સિંક રાખવા માટે અવાજ કી આઈડી ડિફાઇન કરી
const RAZORPAY_KEY_ID = "rzp_test_5M8UBrwvserR8o";
const RAZORPAY_KEY_SECRET = "YOUR_TEST_SECRET_KEY_HERE"; // તારો સાચો ટેસ્ટ સિક્રેટ કી અહીં લખી શકો છો

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// 1. Create Order Endpoint Logic
export const createOrder = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const options = {
      amount: amount * 100, // પૈસામાં કન્વર્ટ (₹49 = 4900 પૈસા)
      currency: "INR",
      receipt: `receipt_rob_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Order creation crashed on backend:", error);
    res.status(500).json({ error: error.message });
  }
};

// 2. Verify Payment Endpoint Logic
export const verifyPayment = async (req, res) => {
  try {
    const { userId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    const shasum = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const digest = shasum.digest("hex");

    if (digest === razorpaySignature) {
      // પેમેન્ટ સક્સેસ: ફાયરબેઝમાં યુઝરનું પ્રીમિયમ સ્ટેટસ એક્ટિવેટ કરો
      await db.collection("users").doc(userId).set({
        isPremium: true,
        premiumSubject: "TET_2_MATHS",
        updatedAt: new Date().toISOString()
      }, { merge: true });

      res.status(200).json({ success: true, message: "Payment verified, premium granted!" });
    } else {
      res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Verification endpoint crashed:", error);
    res.status(500).json({ error: error.message });
  }
};