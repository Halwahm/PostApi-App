import express, { Request, Response } from "express";
import usersRoutes from "./usersRoutes";
import postsRoutes from "./postsRoutes";
import commentsRoutes from "./commentsRoutes";
import authRoutes from "./authRoutes";
import registerRoutes from "./registerRoutes";
import { options } from "../globals";
import swaggerUI from "swagger-ui-express";
import swaggerJSDocs from "swagger-jsdoc";
import { Answers } from "../answers";

const mainRouter = express.Router();
const swaggerSpec = swaggerJSDocs(options);

mainRouter.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
mainRouter.use("/register", registerRoutes);
mainRouter.use("/auth", authRoutes);
mainRouter.use("/users", usersRoutes);
mainRouter.use("/posts", postsRoutes);
mainRouter.use("/comments", commentsRoutes);

mainRouter.get("/", (_req: Request, res: Response) => {
  res.send(`
    <h2>List of available endpoints:</h2>
    <ul>
      <li>/register</li>
      <li>/auth</li>
      <li>/users</li>
      <li>/posts</li>
      <li>/comments</li>
    </ul>
  `);
});

mainRouter.all("*", (_req: Request, res: Response) => {
  res.status(404).json({ message: Answers.ERROR.NOT_FOUND });
});

export default mainRouter;
