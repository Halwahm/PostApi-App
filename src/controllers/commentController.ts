import { Request, Response } from "express";
import commentService from "../services/commentService";
import createLogger from "../utils/loggerUtil";
import { getUserDataFromRequest, getUserRole } from "../utils/authUtil";
import { Answers } from "../answers";
import { Errors } from "../errors";

const logger = createLogger("errors.log");

const commentController = {
  getCommentsForPost: async (req: Request, res: Response) => {
    try {
      const postId = req.query.postId as string;
      if (!postId) throw new Error(Answers.ERROR.NOT_ENOUGH_DATA);
      const comments = await commentService.getCommentsForPost(postId);
      if (comments.length === 0) res.status(404).json({ message: Answers.ERROR.NOT_FOUND });
      else res.status(200).json(comments);
    } catch (error) {
      logger.error(error.message, { error: error.stack });
      if (error.message.includes(Answers.ERROR.NOT_ENOUGH_DATA))
        res.status(400).json({ error: Answers.ERROR.NOT_ENOUGH_DATA });
      else res.status(500).json({ error: Errors.INTERNAL_SERVER_ERROR });
    }
  },

  createCommentForPost: async (req: Request, res: Response) => {
    const { content, postId, replyToCommentId } = req.body;
    if (!content && !postId && !replyToCommentId)
      res.status(401).json({ error: Answers.ERROR.NOT_ENOUGH_DATA });
    const commenterData = getUserDataFromRequest(req);
    const commenterId = commenterData.userId;
    if (!commenterId) res.status(401).json({ message: Answers.AUTH.UNAUTHORIZED });
    else {
      try {
        const newComment = await commentService.createCommentForPost(
          content,
          commenterId,
          postId,
          replyToCommentId
        );
        res.status(201).json(newComment);
      } catch (error) {
        res.status(500).json({ error: error.message });
        logger.error(error.message, { error: error.stack });
      }
    }
  },

  deleteComment: async (req: Request, res: Response) => {
    const commentId = req.query.commentId as string;
    if (!commentId) res.status(401).json({ error: Answers.ERROR.NOT_ENOUGH_DATA });
    const { userId, userRole } = getUserDataFromRequest(req);
    const commenterRole = getUserRole(userRole);
    if (!userId || !commenterRole)
      res.status(401).json({ message: Answers.AUTH.UNAUTHORIZED_OR_NO_PERM });
    else {
      try {
        const existingComment = await commentService.getCommentById(commentId);
        if (!existingComment) res.status(404).json({ error: Answers.ERROR.NOT_FOUND });
        else {
          await commentService.deleteComment(commentId, userId, commenterRole);
          res.status(204).send({ message: "deleted" });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
        logger.error(error.message, { error: error.stack });
      }
    }
  },

  updateComment: async (req: Request, res: Response) => {
    const { content, commentId } = req.body;
    const { userId, userRole } = getUserDataFromRequest(req);
    const commenterRole = getUserRole(userRole);
    if (!userId || !userRole)
      res.status(401).json({ message: Answers.AUTH.UNAUTHORIZED_OR_NO_PERM });
    else {
      try {
        const existingComment = await commentService.getCommentById(commentId);
        if (!existingComment) res.status(404).json({ error: Answers.ERROR.NOT_FOUND });
        const updatedComment = await commentService.updateComment(
          commentId,
          content,
          userId,
          commenterRole
        );
        res.status(200).json(updatedComment);
      } catch (error) {
        res.status(500).json({ error: error.message });
        logger.error(error.message, { error: error.stack });
      }
    }
  }
};

export default commentController;
