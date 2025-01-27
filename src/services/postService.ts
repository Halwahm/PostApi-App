import { Post, Prisma, PrismaClient } from "@prisma/client";
import { IFilters, ISearch, SortOrder, SortBy, UserRole } from "./../globals";
import { Errors, AppError } from "../errors";
import { createWhereClause } from "../dtos/postFilters.dto";
import { Answers } from "../answers";

const prisma = new PrismaClient();

const postService = {
  getAllPosts: async (
    userId: string,
    page: number,
    pageSize: number,
    sortBy: string,
    sortOrder: SortOrder,
    filters: IFilters,
    search: ISearch,
    viewAllUsers: string
  ): Promise<Post[]> => {
    try {
      const offset: number = (page - 1) * pageSize;
      const whereClause = await createWhereClause(prisma, filters, search, userId, viewAllUsers);

      const orderBy: Prisma.PostOrderByWithRelationInput = {};
      switch (sortBy) {
      case SortBy.LIKES:
        orderBy.likedPost = { _count: sortOrder };
        break;
      case SortBy.CREATED_AT:
        orderBy.createdAt = sortOrder;
        break;
      case SortBy.NAME:
        orderBy.name = sortOrder;
        break;
      case SortBy.CREATED_BY_ID:
        orderBy.createdById = sortOrder;
        break;
      default:
        orderBy.createdAt = SortOrder.DESC;
        break;
      }

      const posts = await prisma.post.findMany({
        where: whereClause,
        orderBy,
        skip: offset,
        take: pageSize,
        include: {
          _count: {
            select: {
              comments: true,
              likedPost: true
            }
          },
          likedPost: {
            where: {
              userId: userId
            },
            select: {
              userId: true
            }
          }
        }
      });
      return posts;
    } catch (error) {
      throw new AppError(Errors.ERROR_WHILE_FETCHING_DATA);
    }
  },

  getPostById: async (postId: string) => {
    try {
      const post = await prisma.post.findUnique({
        where: { id: postId, deletedAt: null },
        include: {
          _count: {
            select: {
              comments: true,
              likedPost: true
            }
          }
        }
      });
      return post;
    } catch (error) {
      throw new AppError(Errors.ERROR_WHILE_FETCHING_DATA);
    }
  },

  async createPost(
    userId: string,
    name: string,
    content: string,
    photoPaths: string[],
    hashtags: string[] | undefined
  ) {
    try {
      const newPost = await prisma.$transaction(async (prisma) => {
        const createdPost = await prisma.post.create({
          data: {
            name,
            content,
            createdById: userId,
            mainPhotoUrl: photoPaths[0],
            createdAt: new Date(),
            updatedAt: new Date(),
            photos: {
              create: photoPaths
                ? photoPaths.slice(1).map((photoPath) => ({ photoPath }))
                : undefined
            }
          }
        });

        if (hashtags?.length) {
          for (const hashtag of hashtags) {
            let processedHashtag = hashtag;
            if (!hashtag.startsWith("#")) processedHashtag = `#${hashtag}`;

            const existingHashtag = await prisma.hashtag.findUnique({
              where: { content: processedHashtag }
            });

            if (!existingHashtag)
              await prisma.hashtag.create({ data: { content: processedHashtag } });

            await prisma.postHashtags.create({
              data: {
                post: {
                  connect: {
                    id: createdPost.id
                  }
                },
                hashtag: {
                  connect: {
                    content: processedHashtag
                  }
                }
              }
            });
          }
        }
        return createdPost;
      });
      return newPost;
    } catch (error) {
      throw new AppError(Errors.ERROR_WHILE_ADDING_DATA);
    }
  },

  async updatePost(
    postId: string,
    name: string,
    content: string,
    photoPaths: string[],
    userId: string,
    hashtags: string[] | undefined
  ) {
    try {
      const newPost = await prisma.$transaction(async (prisma) => {
        const post = await prisma.post.findUnique({
          where: { id: postId, deletedAt: null },
          select: { createdById: true, hashtags: true }
        });
        if (!post) throw new Error(Answers.ERROR.NOT_FOUND);
        if (post.createdById !== userId) throw new Error(Answers.AUTH.UNAUTHORIZED);

        const updatedPost = await prisma.post.update({
          where: { id: postId },
          data: {
            name,
            content,
            updatedAt: new Date(),
            mainPhotoUrl: photoPaths[0],
            photos: {
              create: photoPaths
                ? photoPaths.slice(1).map((photoPath) => ({ photoPath }))
                : undefined
            }
          }
        });

        await prisma.postHashtags.deleteMany({
          where: {
            postId
          }
        });

        if (hashtags?.length) {
          for (const hashtag of hashtags) {
            const existingHashtag = await prisma.hashtag.findUnique({
              where: { content: hashtag }
            });

            if (!existingHashtag) {
              await prisma.hashtag.create({
                data: { content: hashtag }
              });
            }

            await prisma.postHashtags.create({
              data: {
                post: { connect: { id: postId } },
                hashtag: { connect: { content: hashtag } }
              }
            });
          }
        }
        return updatedPost;
      });
      return newPost;
    } catch (error) {
      throw new AppError(Errors.ERROR_WHILE_UPDATING_DATA);
    }
  },

  async deletePost(postId: string, userId: string, userRole: UserRole | null) {
    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { createdById: true }
      });
      if (!post) throw new Error(Answers.ERROR.NOT_FOUND);
      if (post.createdById !== userId || userRole !== UserRole.Admin)
        throw new Error(Answers.AUTH.UNAUTHORIZED);
      else {
        await prisma.$transaction([
          prisma.postHashtags.deleteMany({
            where: { postId }
          }),
          prisma.post.update({
            where: { id: postId },
            data: {
              deletedAt: new Date()
            }
          })
        ]);
      }
    } catch (error) {
      throw new AppError(Errors.ERROR_WHILE_DELETING_DATA);
    }
  },

  async getAllPostsByUserId(userId: string) {
    try {
      const posts = await prisma.post.findMany({
        where: {
          createdById: userId
        },
        include: {
          comments: true,
          hashtags: true
        }
      });
      return posts;
    } catch (error) {
      throw new AppError(Errors.ERROR_WHILE_FETCHING_DATA);
    }
  },

  getLikes: async (postId: string) => {
    try {
      const likesCount = await prisma.post.findUnique({
        where: { id: postId, deletedAt: null },
        include: {
          _count: {
            select: {
              likedPost: true
            }
          }
        }
      });
      return likesCount?._count.likedPost;
    } catch (error) {
      throw new AppError(Errors.ERROR_WHILE_FETCHING_DATA);
    }
  },

  likePost: async (postId: string, userId: string) => {
    const existingLike = await prisma.userLikedPosts.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId
        }
      }
    });
    if (existingLike) throw new Error(Answers.POST.ALREADY_LIKED_POST);

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        likedPost: {
          create: { userId }
        }
      },
      include: {
        _count: {
          select: { likedPost: true }
        }
      }
    });

    return { likes: updatedPost._count.likedPost };
  },

  unlikePost: async (postId: string, userId: string) => {
    const existingLike = await prisma.userLikedPosts.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId
        }
      }
    });
    if (!existingLike) throw new Error(Answers.POST.NOT_LIKED_POST);
    await prisma.userLikedPosts.delete({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId
        }
      }
    });
  }
};

export default postService;
