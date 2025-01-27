import multer from "multer";
import { PhotoUploads } from "./../globals";
import { storage } from "../utils/uploadPhotoUtil";

export const uploadPhoto = multer({ storage: storage }).array(
  PhotoUploads.fieldname,
  PhotoUploads.maxPhotosCount
);
