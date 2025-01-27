import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { getTokenExpiration } from "./authUtil";

const prisma = new PrismaClient();
const checkTokenExpiration = async () => {
  try {
    const userAuths = await prisma.userAuth.findMany({ where: { isTokenActive: true } });
    const now = new Date();
    for (const userAuth of userAuths) {
      const { refreshToken, userId } = userAuth;
      const expirationDate = getTokenExpiration(refreshToken);
      if (!expirationDate || expirationDate <= now) {
        await prisma.userAuth.updateMany({
          where: { userId, refreshToken },
          data: { isTokenActive: false, refreshToken: "" }
        });
        console.log(`Deactivated and cleaned token for user ${userId}`);
      }
    }
  } catch (error) {
    console.error("Error checking and cleaning tokens:", error);
  }
};

cron.schedule("*/30 * * * * *", checkTokenExpiration);
