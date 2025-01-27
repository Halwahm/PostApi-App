import express from "express";
import multer from "multer";
import bodyParser from "body-parser";
import { registerUserHandler, confirmRegistrationHandler } from "../controllers/registerController";
import { validateDataMiddleware } from "../middlewares/validationMiddleware";
import { userSchemaRegister, confirmEmailSchema } from "./../validationSchemas/userSchemaRegister";

const registerRoutes = express.Router();
const upload = multer().none();

registerRoutes.use(upload, bodyParser.json());

registerRoutes.post("/", validateDataMiddleware(userSchemaRegister), registerUserHandler);
registerRoutes.post(
  "/confirm",
  validateDataMiddleware(confirmEmailSchema),
  confirmRegistrationHandler
);

export default registerRoutes;
