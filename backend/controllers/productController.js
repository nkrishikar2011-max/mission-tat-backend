import { db } from "../config/firebase.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ 
  cloud_name: 'perecex6', 
  api_key: '366332611142993', 
  api_secret: 'L31UAw5xoEZbACpPz9AW4fUQ61I' 
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../public/uploads");

const ensureUploadDirExists = () => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadDirExists();
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.]/g, "_")}`);
  }
});

// 🖼️ ફક્ત થંબનેલ ઈમેજ સ્વીકારવા માટે મલ્ટર કોન્ફિગરેશન
export const uploadConfig = multer({ storage }).fields([
  { name: "thumbnail", maxCount: 1 }
]);

export const getProducts = async (req, res) => {
  try {
    const snap = await db.collection("products").get();
    const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(products);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const createProduct = async (req, res) => {
  try {
    const { title, subtitle, description, price, discount, category, isPaid } = req.body;
    
    let parsedCategories = [];
    try { parsedCategories = JSON.parse(req.body.categories || "[]"); } catch(e) { parsedCategories = [category]; }
    
    let incomingFiles = [];
    try { incomingFiles = JSON.parse(req.body.files || "[]"); } catch(e) { incomingFiles = []; }

    // ☁️ થંબનેલ ઈમેજ Cloudinary પર અપલોડ
    let thumbnail = "https://via.placeholder.com/150";
    if (req.files && req.files["thumbnail"]) {
      const localFilePath = req.files["thumbnail"][0].path;
      const uploadResult = await cloudinary.uploader.upload(localFilePath, {
        folder: "mission_tat_thumbnails"
      });
      thumbnail = uploadResult.secure_url;
      if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    }

    const newProd = {
      title, subtitle, description,
      category: category || "General",
      categories: parsedCategories,
      price: Number(price || 0),
      discount: Number(discount || 0),
      isPaid: isPaid === "true" || isPaid === true,
      thumbnail,
      files: incomingFiles, // ડ્રાઈવ લિંક્સનો ડેટા
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection("products").add(newProd);
    res.status(201).json({ success: true, id: docRef.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, price, discount, category, isPaid } = req.body;
    
    let parsedCategories = [];
    try { parsedCategories = JSON.parse(req.body.categories || "[]"); } catch(e) { parsedCategories = [category]; }
    
    let incomingFiles = [];
    try { incomingFiles = JSON.parse(req.body.files || "[]"); } catch(e) { incomingFiles = []; }

    const docRef = db.collection("products").doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return res.status(404).json({ error: "Product not found" });
    const currentProduct = docSnap.data();

    let updateData = { 
      title, subtitle, description,
      category: category || "General",
      categories: parsedCategories,
      price: Number(price || 0),
      discount: Number(discount || 0), 
      isPaid: isPaid === "true" || isPaid === true,
      files: incomingFiles
    };

    if (req.files && req.files["thumbnail"]) {
      const localFilePath = req.files["thumbnail"][0].path;
      const uploadResult = await cloudinary.uploader.upload(localFilePath, {
        folder: "mission_tat_thumbnails"
      });
      updateData.thumbnail = uploadResult.secure_url;
      if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    }

    await docRef.update(updateData);
    res.status(200).json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteProduct = async (req, res) => {
  try {
    await db.collection("products").doc(req.params.id).delete();
    res.status(200).json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const viewPdf = (req, res) => { res.status(400).send("Deprecated"); };
export const downloadPdf = (req, res) => { res.status(400).send("Deprecated"); };