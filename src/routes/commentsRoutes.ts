import express from "express";
import multer from "multer";
import commentController from "../controllers/commentController";
import { validateDataMiddleware } from "../middlewares/validationMiddleware";
import { authenticateToken } from "../middlewares/tokensMiddleware";
import { ability } from "../middlewares/abilityMiddleware";
import { commentSchema } from "../validationSchemas/commentSchema";
import { Action, Resource } from "../globals";
import bodyParser from "body-parser";

const commentRoutes = express.Router();
const upload = multer().none();

commentRoutes.use(upload, bodyParser.json());

commentRoutes.get("/", commentController.getCommentsForPost);
commentRoutes.post(
  "/",
  authenticateToken,
  ability(Action.Create, Resource.Comment),
  validateDataMiddleware(commentSchema),
  commentController.createCommentForPost
);
commentRoutes.delete(
  "/:commentId",
  authenticateToken,
  ability(Action.Delete, Resource.Comment),
  commentController.deleteComment
);
commentRoutes.put(
  "/:commentId",
  authenticateToken,
  ability(Action.Update, Resource.Comment),
  validateDataMiddleware(commentSchema),
  commentController.updateComment
);

export default commentRoutes;
