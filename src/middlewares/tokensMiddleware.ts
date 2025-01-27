import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { generateToken, getTokenExpiration, TokenType } from "./../utils/authUtil";
import { IUser, UserRole } from "../globals";
import { Errors, AppError } from "../errors";
import { Answers } from "../answers";
import { cacheJwtToken, getJwtTokenFromCache } from "../utils/redisCacheUtil";

dotenv.config();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw new AppError(Errors.JWT_NOT_PROVIDED);

interface TokenPayload extends JwtPayload {
  userId: string;
  userRole: UserRole;
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers["authorization"]?.split(" ")[1];
  const refreshToken = req.cookies["refreshToken"];
  if (!accessToken) {
    res.status(401).json({ message: Answers.AUTH.UNAUTHORIZED_OR_NO_PERM });
    return next();
  } else {
    const decoded = jwt.verify(accessToken, JWT_SECRET) as TokenPayload;
    const userId = decoded.userId;
    const cachedRefreshToken = await getJwtTokenFromCache(userId);
    if (cachedRefreshToken && cachedRefreshToken === refreshToken) {
      req.user = { id: decoded.userId, role: decoded.userRole } as IUser;
      next();
    } else {
      const refreshTokenExp = getTokenExpiration(refreshToken);
      if (refreshTokenExp && refreshTokenExp > new Date()) {
        try {
          const decodedRefresh = jwt.verify(refreshToken, JWT_SECRET) as TokenPayload;
          const userId = decodedRefresh.userId;
          const userRole = decodedRefresh.userRole;
          const newAccessToken = await generateToken(TokenType.Access, userId, undefined, userRole);
          const newRefreshToken = await generateToken(
            TokenType.Refresh,
            userId,
            refreshToken,
            userRole
          );
          await prisma.userAuth.updateMany({
            where: { userId },
            data: { refreshToken: newRefreshToken }
          });
          await cacheJwtToken(userId, newRefreshToken);
          res.setHeader("authorization", `Bearer ${newAccessToken}`);
          res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true });
          req.user = {
            id: decodedRefresh.userId,
            role: decodedRefresh.userRole
          } as IUser;
          next();
        } catch (err) {
          res.status(401).json({ message: Answers.AUTH.INVALID_TOKEN });
        }
      } else res.status(401).json({ message: Answers.AUTH.UNAUTHORIZED });
    }
  }
};
