import { PrismaClient } from "@prisma/client";
import { generateToken, TokenType } from "./../utils/authUtil";
import { Errors, AppError } from "../errors";
import bcrypt from "bcryptjs";
import { addResetCode, verifyResetCode, deleteResetCode } from "../utils/resetCodeUtil";
import { generateConfirmationCode, sendEmail } from "../utils/emailSendingUtil";
import { Answers } from "../answers";
import { cacheJwtToken } from "../utils/redisCacheUtil";

const prisma = new PrismaClient();

export const loginUser = async (email: string, ip: string, host: string, userAgent: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error(Answers.USER.USER_NOT_FOUND);
    
    const userAuth = await prisma.userAuth.findMany({ where: { userId: user.id } });
    const activeAuthIds = userAuth.filter((auth) => auth.isTokenActive).map((auth) => auth.id);
    if (activeAuthIds.length > 3) {
      await prisma.userAuth.updateMany({
        where: { userId: { in: activeAuthIds } },
        data: {
          isTokenActive: false,
          refreshToken: ""
        }
      });
    }
    const matchedAuth = userAuth.find(
      (ua) => ua.ip === ip && ua.host === host && ua.userAgent === userAgent
    );

    if (matchedAuth) {
      if (matchedAuth.isTokenActive) return false;

      const newRefreshToken = await generateToken(
        TokenType.Refresh,
        user.id,
        matchedAuth.refreshToken,
        user.role
      );
      const newAccessToken = await generateToken(TokenType.Access, user.id, undefined, user.role);
      await prisma.userAuth.update({
        where: { id: matchedAuth.id },
        data: { refreshToken: newRefreshToken, isTokenActive: true }
      });
      await cacheJwtToken(matchedAuth.id, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } else {
      const refreshToken = await generateToken(TokenType.Refresh, user.id, undefined, user.role);
      const accessToken = await generateToken(TokenType.Access, user.id, undefined, user.role);
      await prisma.userAuth.create({
        data: { userId: user.id, refreshToken, ip, host, userAgent, isTokenActive: true }
      });
      await cacheJwtToken(user.id, refreshToken);
      return { accessToken, refreshToken };
    }
  } catch (error) {
    throw new AppError(Errors.INTERNAL_SERVER_ERROR);
  }
};

export const logoutUser = async (
  userId: string,
  ip: string | undefined,
  host: string | undefined,
  userAgent: string | undefined
) => {
  try {
    const userAuth = await prisma.userAuth.findMany({ where: { userId } });
    if (!userAuth) return false;
    if (userAuth.length > 0) {
      const matchedAuth = userAuth.find(
        (ua) => ua.ip === ip && ua.host === host && ua.userAgent === userAgent && ua.isTokenActive
      );
      if (matchedAuth) {
        await prisma.userAuth.update({
          where: { id: matchedAuth.id },
          data: { isTokenActive: false, refreshToken: "" }
        });
      } else return false;
    }
    return true;
  } catch (error) {
    throw new AppError(Errors.INTERNAL_SERVER_ERROR);
  }
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error(Answers.USER.USER_NOT_FOUND);

  const resetCode = generateConfirmationCode().toString();
  addResetCode(email, resetCode);
  const subject = "Password Reset Code";
  const text = `Your password reset code is: ${resetCode}`;
  await sendEmail(email, subject, text);
};

export const resetPassword = async (email: string, code: string, newPassword: string) => {
  const isValidCode = verifyResetCode(email, code);
  if (!isValidCode) throw new AppError(Errors.INVALID_RESET_CODE);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      salt
    }
  });

  deleteResetCode(email);
};
