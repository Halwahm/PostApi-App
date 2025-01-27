import { Prisma, PrismaClient } from "@prisma/client";
import { CreatedFilter, IFilters, ISearch } from "../globals";
import { addDateRangeFilter } from "../utils/postUtil";

export const createWhereClause = async (
  prisma: PrismaClient,
  filters: IFilters,
  search: ISearch,
  userId: string,
  viewAllUsers: string
): Promise<Prisma.PostWhereInput> => {
  const whereClause: Prisma.PostWhereInput = { deletedAt: null };

  if (filters?.createdAt) {
    Object.assign(whereClause, addDateRangeFilter(CreatedFilter.CREATED_AT, filters.createdAt));
  }
  if (filters?.likes) {
    Object.assign(whereClause, {
      likedPost: { every: addDateRangeFilter(CreatedFilter.CREATED_AT, filters.likes) }
    });
  }
  if (filters?.comments) {
    Object.assign(whereClause, {
      comments: { every: addDateRangeFilter(CreatedFilter.CREATED_AT, filters.comments) }
    });
  }
  if (filters?.subscriptions) {
    const users = await prisma.user.findMany({
      where: {
        name: {
          in: filters.subscriptions
        }
      }
    });
    const userIds = users.map((user) => user.id);
    const userSubscribed = await prisma.userSubscribers.findMany({
      where: {
        userId: {
          in: userIds
        }
      }
    });
    const subscribtionIds = userSubscribed.map((user) => user.userId);
    Object.assign(whereClause, { id: { in: subscribtionIds } });
  }
  if (filters?.hashtags) {
    const hashtags = await prisma.hashtag.findMany({
      where: {
        content: {
          in: filters.hashtags
        }
      }
    });
    const hashtagIds = hashtags.map((hashtag) => hashtag.id);
    const postHashtags = await prisma.postHashtags.findMany({
      where: {
        hashtagId: {
          in: hashtagIds
        }
      }
    });
    const postIds = postHashtags.map((postHashtag) => postHashtag.postId);
    Object.assign(whereClause, { id: { in: postIds } });
  }

  if (search?.subscription) {
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: search.subscription
        }
      }
    });
    const userIds = users.map((user) => user.id);
    const userSubscribed = await prisma.userSubscribers.findMany({
      where: {
        userId: {
          in: userIds
        }
      }
    });
    const subscribtionIds = userSubscribed.map((user) => user.userId);
    Object.assign(whereClause, { id: { in: subscribtionIds } });
  }
  if (search?.hashtag) {
    const hashtags = await prisma.hashtag.findMany({
      where: {
        content: {
          contains: search.hashtag
        }
      }
    });
    const hashtagIds = hashtags.map((hashtag) => hashtag.id);
    const postHashtags = await prisma.postHashtags.findMany({
      where: {
        hashtagId: {
          in: hashtagIds
        }
      }
    });
    const postIds = postHashtags.map((postHashtag) => postHashtag.postId);
    Object.assign(whereClause, { id: { in: postIds } });
  }

  if (viewAllUsers !== "true") {
    const subscribedUserIds = await prisma.userSubscribers.findMany({
      where: { subscriberId: userId },
      select: { userId: true }
    });
    const subscribedIds = subscribedUserIds.map((sub) => sub.userId);
    Object.assign(whereClause, { createdById: { in: subscribedIds } });
  }

  return whereClause;
};
