import * as nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Errors, AppError } from "../errors";

dotenv.config();
const email = process.env.email ? process.env.email : "";
const pass = process.env.pass ? process.env.pass : "";

const transporter = nodemailer.createTransport({
  host: "smtp.yandex.com",
  port: 587,
  secure: false,
  auth: {
    user: email,
    pass: pass
  }
});

export const generateConfirmationCode = () => {
  return Math.floor(10000 + Math.random() * 90000);
};

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    await transporter.sendMail({
      from: email,
      to,
      subject,
      text
    });
  } catch (error) {
    throw new AppError(Errors.FAILED_TO_SEND_EMAIL);
  }
};
