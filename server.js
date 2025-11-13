import express from "express";
import cors from "cors";
import fs from "fs-extra";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Cloudinary sozlamalari
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fayl yo‘qligini tekshirish
const DATA_PATH = "./data.json";
if (!fs.existsSync(DATA_PATH)) {
  fs.writeJsonSync(DATA_PATH, []);
}

// 📥 Barcha rasmlarni olish
app.get("/images", async (req, res) => {
  const data = await fs.readJson(DATA_PATH);
  res.json(data);
});

// 📤 Yangi rasm yuklash
app.post("/upload", async (req, res) => {
  try {
    const { base64, title } = req.body;
    const uploadRes = await cloudinary.uploader.upload(base64, {
      folder: "telegramMini",
    });

    const newImage = {
      id: Date.now(),
      title,
      url: uploadRes.secure_url,
    };

    const data = await fs.readJson(DATA_PATH);
    data.push(newImage);
    await fs.writeJson(DATA_PATH, data);

    res.json({ success: true, newImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// 🗑️ Rasmni o‘chirish
app.delete("/images/:id", async (req, res) => {
  const id = Number(req.params.id);
  let data = await fs.readJson(DATA_PATH);
  data = data.filter((item) => item.id !== id);
  await fs.writeJson(DATA_PATH, data);
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
