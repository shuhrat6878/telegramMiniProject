import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import uploadRouter from "./upload.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/upload", uploadRouter);

app.get("/images", (req, res) => {
  const data = JSON.parse(fs.readFileSync("data.json"));
  res.json(data);
});

app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on port ${process.env.PORT}`);
});
