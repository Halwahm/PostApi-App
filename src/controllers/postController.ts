import { Request, Response } from "express";
import postService from "../services/postService";
import createLogger from "../utils/loggerUtil";
import { getUserDataFromRequest, getUserRole } from "../utils/authUtil";
import { IFilters, ISearch, SortOrder, IUploadedFile, SortBy, BoolValues } from "./../globals";
import { Errors } from "../errors";
import { Answers } from "../answers";

const logger = createLogger("errors.log");

const postController = {
  getAllPosts: async (req: Request, res: Response) => {
    try {
      const { userId } = getUserDataFromRequest(req);
      if (!userId) res.status(401).json({ message: Answers.AUTH.UNAUTHORIZED });
      else {
        const { page, pageSize, sortBy, sortOrder, filters, search, viewAllUsers } = req.body;
        const defaultPage = page ? parseInt(page) : 1;
        const defaultPageSize = pageSize ? parseInt(pageSize) : 10;
        const defaultSortBy = [
          SortBy.CREATED_AT,
          SortBy.CREATED_BY_ID,
          SortBy.LIKES,
          SortBy.NAME
        ].includes(sortBy)
          ? sortBy
          : SortBy.CREATED_AT;
        const defaultSortOrder = Object.values(SortOrder).includes(sortOrder as SortOrder)
          ? (sortOrder as SortOrder)
          : SortOrder.ASC;
        const defaultView = [BoolValues.TRUE, BoolValues.FALSE].includes(viewAllUsers)
          ? viewAllUsers
          : BoolValues.FALSE;

        const posts = await postService.getAllPosts(
          userId,
          defaultPage,
          defaultPageSize,
          defaultSortBy,
          defaultSortOrder as SortOrder,
          filters as IFilters,
          search as ISearch,
          defaultView
        );
        res.status(200).render("posts", { posts });
      }
    } catch (error) {
      logger.error(error.message, { error: error.stack });
      res.status(500).json({ message: Errors.INTERNAL_SERVER_ERROR });
    }
  },

  getPostById: async (req: Request, res: Response) => {
    try {
      const postId = req.query.id as string;
      if (!postId) throw new Error(Answers.ERROR.NOT_ENOUGH_DATA);
      const post = await postService.getPostById(postId);
      if (!post) res.status(404).json({ error: Answers.ERROR.NOT_FOUND });
      res.status(200).render("post", { post });
    } catch (error) {
      logger.error(error.message, { error: error.stack });
      if (error.message.includes(Answers.ERROR.NOT_ENOUGH_DATA))
        res.status(400).json({ error: Answers.ERROR.NOT_ENOUGH_DATA });
      else res.status(500).json({ error: Errors.INTERNAL_SERVER_ERROR });
    }
  },

  createPost: async (req: Request, res: Response) => {
    const { name, content, hashtags } = req.body;
    const photoPaths: string[] = (req.files as IUploadedFile[]).map((file) => file.path);
    const { userId } = getUserDataFromRequest(req);
    if (!userId) res.status(401).json({ message: Answers.AUTH.UNAUTHORIZED });
    else {
      try {
        await postService.createPost(userId, name, content, photoPaths, hashtags);
        const posts = await postService.getAllPostsByUserId(userId);
        res.status(201).json(posts);
      } catch (error) {
        logger.error(error.message, { error: error.stack });
        res.status(500).json({ error: error.message });
      }
    }
  },

  updatePost: async (req: Request, res: Response) => {
    const { id, name, content, hashtags } = req.body;
    const photoPaths: string[] = (req.files as IUploadedFile[]).map((file) => file.path);
    const { userId } = getUserDataFromRequest(req);
    if (!userId) res.status(401).json({ message: Answers.AUTH.UNAUTHORIZED });
    else {
      try {
        const updatedPost = await postService.updatePost(
          id,
          name,
          content,
          photoPaths,
          userId,
          hashtags
        );
        res.status(200).json(updatedPost);
      } catch (error) {
        logger.error(error.message, { error: error.stack });
        res.status(500).json({ error: error.message });
      }
    }
  },

  deletePost: async (req: Request, res: Response) => {
    const postId = req.query.id as string;
    const { userId, userRole } = getUserDataFromRequest(req);
    const usrRole = getUserRole(userRole);
    if (!userId || usrRole) res.status(401).json({ message: Answers.AUTH.UNAUTHORIZED_OR_NO_PERM });
    else {
      try {
        await postService.deletePost(postId, userId, usrRole);
        res.status(204).send();
      } catch (error) {
        logger.error(error.message, { error: error.stack });
        res.status(500).json({ error: error.message });
      }
    }
  },

  getLikesCount: async (req: Request, res: Response) => {
    try {
      const postId = req.query.postId as string;
      if (!postId) throw new Error(Answers.ERROR.NOT_ENOUGH_DATA);
      const likesCount = await postService.getLikes(postId);
      if (!likesCount) res.status(404).json({ message: Answers.ERROR.NOT_FOUND });
      else res.status(200).json(likesCount);
    } catch (error) {
      logger.error(error.message, { error: error.stack });
      if (error.message.includes(Answers.ERROR.NOT_ENOUGH_DATA))
        res.status(400).json({ error: Answers.ERROR.NOT_ENOUGH_DATA });
      else res.status(500).json({ error: Errors.INTERNAL_SERVER_ERROR });
    }
  },
  likePost: async (req: Request, res: Response) => {
    const postId = req.query.postId as string;
    if (!postId) throw new Error(Answers.ERROR.NOT_ENOUGH_DATA);
    const { userId } = getUserDataFromRequest(req);
    if (!userId) res.status(401).json({ message: Answers.AUTH.UNAUTHORIZED });
    try {
      const likePost = await postService.likePost(postId, userId);
      res.status(200).json(likePost);
    } catch (error) {
      logger.error(error.message, { error: error.stack });
      switch (true) {
      case error.message.includes(Answers.ERROR.NOT_ENOUGH_DATA):
        res.status(400).json({ error: Answers.ERROR.NOT_ENOUGH_DATA });
        break;
      case error.message.includes(Answers.POST.ALREADY_LIKED_POST):
        res.status(400).json({ error: Answers.POST.ALREADY_LIKED_POST });
        break;
      default:
        res.status(500).json({ error: Errors.INTERNAL_SERVER_ERROR });
      }
    }
  },
  unlikePost: async (req: Request, res: Response) => {
    const postId = req.query.postId as string;
    if (!postId) throw new Error(Answers.ERROR.NOT_ENOUGH_DATA);
    const { userId } = getUserDataFromRequest(req);
    if (!userId) res.status(401).json({ message: Answers.AUTH.UNAUTHORIZED });
    try {
      await postService.unlikePost(postId, userId);
      res.status(204).send();
    } catch (error) {
      logger.error(error.message, { error: error.stack });
      res.status(500).json({ error: error.message });
    }
  }
};

export default postController;
