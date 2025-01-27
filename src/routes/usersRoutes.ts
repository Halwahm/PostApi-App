import express from "express";
import multer from "multer";
import userController from "../controllers/userController";
import { authenticateToken } from "../middlewares/tokensMiddleware";
import { ability } from "../middlewares/abilityMiddleware";
import { Action, Resource } from "../globals";
import bodyParser from "body-parser";

const usersRoutes = express.Router();
const upload = multer().none();

usersRoutes.use(upload, bodyParser.json());
usersRoutes.use(authenticateToken);

usersRoutes.get("/", ability(Action.Read, Resource.User), userController.getAllUsers);
usersRoutes.get("/:id", ability(Action.Read, Resource.User), userController.getUserProfile);
usersRoutes.get(
  "/:id/subscribers",
  ability(Action.Read, Resource.User),
  userController.getUserSubscribers
);
usersRoutes.get(
  "/:id/subscribed",
  ability(Action.Read, Resource.User),
  userController.getUserSubscribed
);
usersRoutes.get(
  "/all/statistics",
  ability(Action.Manage, Resource.All),
  userController.getStatistics
);

export default usersRoutes;
