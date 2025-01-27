import express from "express";
import bodyParser from "body-parser";
import postController from "../controllers/postController";
import { uploadPhoto } from "./../middlewares/uploadPhotoMiddleware";
import { validateDataMiddleware } from "../middlewares/validationMiddleware";
import { authenticateToken } from "../middlewares/tokensMiddleware";
import { ability } from "../middlewares/abilityMiddleware";
import { postSchema } from "./../validationSchemas/postSchema";
import { Action, Resource } from "../globals";

const postsRoutes = express.Router();
postsRoutes.use(bodyParser.json());

postsRoutes.post(
  "/all",
  authenticateToken,
  ability(Action.Read, Resource.Post),
  postController.getAllPosts
);
postsRoutes.get("/", postController.getPostById);
postsRoutes.post(
  "/",
  authenticateToken,
  ability(Action.Create, Resource.Post),
  validateDataMiddleware(postSchema),
  uploadPhoto,
  postController.createPost
);
postsRoutes.put(
  "/",
  authenticateToken,
  ability(Action.Update, Resource.Post),
  validateDataMiddleware(postSchema),
  uploadPhoto,
  postController.updatePost
);
postsRoutes.delete(
  "/",
  authenticateToken,
  ability(Action.Delete, Resource.Post),
  postController.deletePost
);

postsRoutes.get(
  "/likes",
  authenticateToken,
  ability(Action.Read, Resource.Like),
  postController.getLikesCount
);
postsRoutes.post(
  "/likes",
  authenticateToken,
  ability(Action.Create, Resource.Like),
  postController.likePost
);
postsRoutes.delete(
  "/likes",
  authenticateToken,
  ability(Action.Delete, Resource.Like),
  postController.unlikePost
);

export default postsRoutes;
