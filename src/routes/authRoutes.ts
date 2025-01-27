import express from "express";
import multer from "multer";
import bodyParser from "body-parser";
import {
  forgotPasswordHandler,
  loginUserHandler,
  logoutUserHandler,
  resetPasswordHandler
} from "../controllers/authController";
import { sessionAuthMiddleware } from "../middlewares/authMiddleware";
import { validateDataMiddleware } from "../middlewares/validationMiddleware";
import { authenticateToken } from "../middlewares/tokensMiddleware";
import { userSchemaAuth } from "../validationSchemas/userSchemaAuth";
import { resetPasswordSchema } from "../validationSchemas/resetPasswordSchema";
import { forgotPasswordSchema } from "../validationSchemas/forgotPasswordSchema";

const authRoutes = express.Router();
const upload = multer().none();

authRoutes.use(upload, bodyParser.json());
authRoutes.post(
  "/login",
  validateDataMiddleware(userSchemaAuth),
  sessionAuthMiddleware,
  loginUserHandler
);
authRoutes.post("/logout", authenticateToken, logoutUserHandler);
authRoutes.post(
  "/password/forgot",
  validateDataMiddleware(forgotPasswordSchema),
  forgotPasswordHandler
);
authRoutes.post(
  "/password/reset",
  validateDataMiddleware(resetPasswordSchema),
  resetPasswordHandler
);

export default authRoutes;
