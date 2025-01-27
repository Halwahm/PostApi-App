import { PrismaClient } from "@prisma/client";
import { UserRole, SortOrder } from "./../globals";
import { Answers } from "../answers";

const prisma = new PrismaClient();

export const commentService = {
  getCommentsForPost: async (postId: string) => {
    const comments = await prisma.comment.findMany({
      where: { postId: postId },
      include: {
        replies: {
          orderBy: {
            createdAt: SortOrder.ASC
          }
        }
      },
      orderBy: { createdAt: SortOrder.ASC }
    });
    return comments;
  },

  createCommentForPost: async (
    content: string,
    commenterId: string,
    postId: string,
    replyCommentId?: string
  ) => {
    const newComment = await prisma.comment.create({
      data: {
        content,
        commenterId,
        postId,
        replyCommentId
      }
    });
    return newComment;
  },

  getCommentById: async (commentId: string) => {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId
      }
    });
    return comment;
  },

  deleteComment: async (commentId: string, commenterId: string, userRole: UserRole) => {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { commenter: true, post: true }
    });
    if (!comment) throw new Error(Answers.ERROR.NOT_FOUND);
    const isAdmin = userRole === UserRole.Admin;
    const isCommenter = comment.commenterId === commenterId;
    const isPostOwner = comment.post.createdById === commenterId;
    if (isAdmin || isCommenter || isPostOwner) {
      await prisma.comment.delete({
        where: { id: commentId }
      });
      return true;
    }
    if (comment.commenterId !== commenterId) throw new Error(Answers.AUTH.NO_ACCESS);
    return false;
  },

  updateComment: async (
    commentId: string,
    content: string,
    commenterId: string,
    userRole: UserRole | null
  ) => {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { commenter: true }
    });
    if (!comment) throw new Error(Answers.ERROR.NOT_FOUND);
    if (userRole === UserRole.Admin || comment.commenterId === commenterId) {
      const updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: { content: content }
      });
      return updatedComment;
    } else if (comment.commenterId !== commenterId) throw new Error(Answers.AUTH.NO_ACCESS);
    return false;
  }
};

export default commentService;
