import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { checkPassword } from "./../utils/authUtil";
import { IUser, IAuthInfo } from "../globals";
import { Errors, AppError } from "../errors";
import { Answers } from "../answers";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new AppError(Errors.JWT_NOT_PROVIDED);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return done(null, false, { message: Answers.USER.USER_NOT_FOUND });
        const isPasswordValid = await checkPassword(password, user.password, user.salt);
        if (!isPasswordValid)
          return done(null, false, { message: Answers.AUTH.INVALID_CREDENTIALS });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: IUser, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (user) done(null, user);
    else done(new Error(Answers.USER.USER_NOT_FOUND));
  } catch (error) {
    console.error(error);
    done(error);
  }
});

export const sessionAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: Error, user: IUser, info: IAuthInfo) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });
    req.login(user, (err) => {
      if (err) return next(err);
      next();
    });
  })(req, res, next);
};
