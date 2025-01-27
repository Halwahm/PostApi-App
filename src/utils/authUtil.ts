import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request } from "express";
import { TokenType, ITokenConfig, UserRole } from "../globals";
import dotenv from "dotenv";
import { Errors, AppError } from "../errors";
import { Answers } from "../answers";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new AppError(Errors.JWT_NOT_PROVIDED);
const ExpiresAccess = process.env.expiresAccess;
if (!ExpiresAccess) throw new Error(Answers.ERROR.EXPRIRES_TIME);
const ExpiresRefresh = process.env.expiresRefresh;
if (!ExpiresRefresh) throw new Error(Answers.ERROR.EXPRIRES_TIME);

const getConfig = (type: TokenType): ITokenConfig => {
  const config = {
    [TokenType.Access]: { expiresIn: ExpiresAccess }, // 30s
    [TokenType.Refresh]: { expiresIn: ExpiresRefresh } // 1 week
  };
  return config[type];
};

const generateToken = async (
  type: TokenType,
  userId?: string,
  oldRefreshToken?: string,
  userRole?: string
): Promise<string> => {
  const tokenConfig: ITokenConfig = getConfig(type);
  let expiresIn = tokenConfig.expiresIn;
  if (type === TokenType.Refresh && oldRefreshToken) {
    const oldRefreshTokenExpiration = getTokenExpiration(oldRefreshToken);
    if (oldRefreshTokenExpiration) {
      const remainingTime = Math.floor((oldRefreshTokenExpiration.getTime() - Date.now()) / 1000);
      const newRefreshTokenDuration =
        Math.min(remainingTime, parseInt(tokenConfig.expiresIn)) + "s";
      expiresIn = newRefreshTokenDuration;
    }
  }
  const tokenPayload: {
    userId: string | undefined;
    userRole: string | undefined;
  } = { userId, userRole };

  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn });
  return token;
};

const getTokenExpiration = (token: string): Date | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { exp: number };
    const expirationDate = new Date(decoded.exp * 1000);
    return expirationDate;
  } catch (error) {
    return null;
  }
};

const checkPassword = async (enteredPassword: string, hashedPassword: string, salt: string) => {
  const hashedInputPassword = await bcrypt.hash(enteredPassword, salt);
  return hashedInputPassword === hashedPassword;
};

const getUserDataFromRequest = (req: Request) => {
  let userId = "",
    userRole = "";
  if (req.user) {
    const userString = JSON.stringify(req.user);
    const userObject = JSON.parse(userString);
    userId = userObject.id;
    userRole = userObject.role;
    return { userId, userRole };
  } else return { userId, userRole };
};

const getUserRole = (role: string): UserRole | null => {
  if (Object.values(UserRole).includes(role as UserRole)) return role as UserRole;
  else return null;
};

export {
  generateToken,
  getTokenExpiration,
  checkPassword,
  getUserDataFromRequest,
  getUserRole,
  TokenType
};
