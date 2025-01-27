import { Request } from "express";
import multer from "multer";
import fs from "fs";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

export const storage = multer.diskStorage({
  destination: function (_req: Request, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req: Request, _file, cb) {
    cb(null, `${Date.now()}-${_file.originalname}`);
  }
});
