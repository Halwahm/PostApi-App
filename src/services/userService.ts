import { PrismaClient } from "@prisma/client";
import { UserRole } from "./../globals";
import { Errors, AppError } from "../errors";
import { Answers } from "../answers";

const prisma = new PrismaClient();

export const userService = {
  getUserProfile: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        subscribers: true,
        subscribedTo: true,
        posts: true
      }
    });
    const subscribersCount = user?.subscribers.length;
    const subscribedToCount = user?.subscribedTo.length;
    const postsCount = user?.posts.length;

    return {
      user,
      subscribersCount,
      subscribedToCount,
      postsCount
    };
  },
  getAllUsers: async (search: string | undefined) => {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search || "",
              mode: "insensitive" //character (lower/upper)
            }
          },
          {
            email: {
              contains: search || "",
              mode: "insensitive"
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarImage: true,
        profileDescription: true,
        subscribers: true,
        subscribedTo: true,
        posts: true
      }
    });
    return users;
  },
  getUserSubscribers: async (userId: string, search: string | undefined) => {
    const subscriptions = await prisma.userSubscribers.findMany({
      where: {
        subscriberId: userId,
        userId: {
          contains: search || "",
          mode: "insensitive"
        }
      }
    });
    return subscriptions;
  },
  getUserSubscribed: async (userId: string, search: string | undefined) => {
    const subscribers = await prisma.userSubscribers.findMany({
      where: {
        userId: userId,
        subscriberId: {
          contains: search || "",
          mode: "insensitive"
        }
      }
    });
    return subscribers;
  },
  getStatistics: async (startDate: string, endDate: string, userRole: UserRole | null) => {
    if (userRole !== UserRole.Admin) throw new Error(Answers.AUTH.NO_ACCESS);
    else {
      const statisticsPromise = await prisma.$queryRaw`
      SELECT 
          month,
          year,
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'name', name,
              'email', email,
              'amountOfPublishedPosts', amountOfPublishedPosts,
              'amountOfLikedPosts', amountOfLikedPosts,
              'amountOfNewSubscribers', amountOfNewSubscribers,
              'amountOfNewSubscriptions', amountOfNewSubscriptions
            )
          ) AS users
        FROM (
          SELECT
            DATE_PART('month', p."createdAt") AS month,
            DATE_PART('year', p."createdAt") AS year,
            u.name,
            u.email,
            COUNT(DISTINCT p.id) AS amountOfPublishedPosts,
            COUNT(DISTINCT ulp."postId") AS amountOfLikedPosts,
            COUNT(DISTINCT uss."subscriberId") AS amountOfNewSubscribers,
            COUNT(DISTINCT us."userId") AS amountOfNewSubscriptions
          FROM 
            "Post" p
          LEFT JOIN 
            "User" u ON p."createdById" = u.id
          LEFT JOIN 
            "UserLikedPosts" ulp ON p.id = ulp."postId"
          LEFT JOIN 
            "UserSubscribers" uss ON u.id = uss."userId"
          LEFT JOIN 
            "UserSubscribers" us ON u.id = us."userId"
          WHERE 
            p."createdAt" BETWEEN TO_DATE(${startDate}, 'DD-MM-YYYY') AND TO_DATE(${endDate}, 'DD-MM-YYYY')
          GROUP BY 
            DATE_PART('month', p."createdAt"),
            DATE_PART('year', p."createdAt"),
            u.name,
            u.email
        ) AS aggregated_data
        GROUP BY month, year
        ORDER BY year, month;
      `;
      try {
        const statistics = await statisticsPromise;
        return statistics;
      } catch (error) {
        throw new AppError(Errors.FAILED_TO_RETRIEVE);
      }
    }
  }
};

export default userService;
