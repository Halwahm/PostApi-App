import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Errors, AppError } from "../errors";
import { Answers } from "../answers";

const prisma = new PrismaClient();
const saltRounds = 10;

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return false;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        salt: salt
      }
    });
    return user;
  } catch (error) {
    throw new AppError(Errors.FAILED_TO_REGISTER);
  }
};

export const confirmRegistration = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error(Answers.USER.USER_NOT_FOUND);
    if (user.isActivated) throw new Error(Answers.USER.ACCOUNT_ALREADY_ACTIVATED);
    await prisma.user.update({ where: { email }, data: { isActivated: true } });
    return true;
  } catch (error) {
    throw new AppError(Errors.ERROR_WHILE_CONFIRMING_REGISTRATION);
  }
};
