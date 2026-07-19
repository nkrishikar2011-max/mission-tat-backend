import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Razorpay from "razorpay";
import crypto from "crypto"; 
import { db } from "./config/firebase.js";
import fs from "fs/promises";
import { getProducts, createProduct, updateProduct, deleteProduct, viewPdf, downloadPdf, uploadConfig } from "./controllers/productController.js";
import { firebaseLogin } from './controllers/authController.js';
import mockTestRoutes from "./routes/mockTestRoutes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

// Routing
app.use("/api/mock-tests", mockTestRoutes);
app.use("/public/uploads", express.static(path.join(__dirname, "public/uploads")));

// ડાયનેમિક પેપર જનરેટર રૂટ
app.post("/api/generate-mains-paper", async (req, res) => {
  try {
    const { subjectId } = req.body;
    const fileName = subjectId === 'sci_tech_maths' ? 'secondary_science_maths.json' : 'default.json';
    const filePath = path.join(__dirname, "data", fileName);
    
    const rawData = await fs.readFile(filePath, "utf-8");
    res.status(200).json({ success: true, papers: JSON.parse(rawData) });
  } catch (err) {
    console.error("Generator Error:", err);
    res.status(500).json({ error: "Data file not found or error reading file" });
  }
});

// 📊 1. રીઅલ-ટાઇમ ટ્રાફિક કાઉન્ટર રાઉટ (Hit Counter)
app.post("/api/analytics/hit", async (req, res) => {
  try {
    const trafficRef = db.collection("analytics").doc("site_traffic");
    const doc = await trafficRef.get();
    
    if (!doc.exists) {
      await trafficRef.set({ views: 1 });
    } else {
      await trafficRef.update({ views: (doc.data().views || 0) + 1 });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Traffic hit error:", error);
    res.status(500).json({ success: false });
  }
});

// 📊 2. એનાલિટિક્સ ડેટા મેળવવાનો રાઉટ
app.get("/api/analytics/traffic", async (req, res) => {
  try {
    const feedbackSnapshot = await db.collection("feedback").get();
    const productsSnapshot = await db.collection("products").get();
    const trafficDoc = await db.collection("analytics").doc("site_traffic").get();

    const totalFeedbacks = feedbackSnapshot.size;
    const totalViews = trafficDoc.exists ? (trafficDoc.data().views || 0) : 0;
    
    let totalDemands = 0;
    feedbackSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.materialDemand && data.materialDemand.trim() !== "") {
        totalDemands++;
      }
    });

    res.status(200).json({
      success: true,
      totalFeedbacks,
      totalDemands,
      totalViews,
      totalProducts: productsSnapshot.size
    });
  } catch (error) {
    console.error("Analytics Route Error:", error);
    res.status(500).json({ success: false, error: "સર્વરથી ટ્રાફિક ડેટા લોડ કરવામાં ભૂલ થઈ." });
  }
});

// ઓરિજિનલ પ્રોડક્ટ કંટ્રોલર્સ
app.get("/api/products", getProducts);
app.post("/api/products", uploadConfig, createProduct); 
app.put("/api/products/:id", uploadConfig, updateProduct);
app.delete("/api/products/:id", deleteProduct);
app.post('/api/auth/firebase-login', firebaseLogin);

// SERVER START
app.listen(5000, () => console.log("🚀 MISSION TAT GUJARAT Backend Live on Port 5000"));