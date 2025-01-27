import { Request, Response } from "express";
import { loginUser, logoutUser } from "../services/authService";
import createLogger from "../utils/loggerUtil";
import { getUserDataFromRequest } from "../utils/authUtil";
import { AppError, Errors } from "../errors";
import { Answers } from "../answers";
import { forgotPassword, resetPassword } from "../services/authService";

const logger = createLogger("errors.log");

export const loginUserHandler = async (req: Request, res: Response) => {
  const { email } = req.body;
  const ip: string | undefined = req.ip,
    host: string = req.hostname,
    userAgent: string | undefined = req.headers["user-agent"];
  if (!ip || !host || !userAgent) throw new Error(Answers.AUTH.INVALID_AUTH_DATA);
  try {
    const loginResult = await loginUser(email, ip, host, userAgent);
    if (loginResult) {
      const { accessToken, refreshToken } = loginResult;
      res.setHeader("authorization", `Bearer ${accessToken}`);
      res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
      res.status(200).json({ message: Answers.AUTH.AUTHORIZED, accessToken, refreshToken });
    } else {
      res.status(200).json({
        message: Answers.AUTH.ALREADY_AUTHORIZED
      });
    }
  } catch (error) {
    res.status(500).json({ message: Errors.INTERNAL_SERVER_ERROR });
    logger.error(error.message, { error: error.stack });
  }
};

export const logoutUserHandler = async (req: Request, res: Response) => {
  try {
    const { userId } = getUserDataFromRequest(req);
    if (!userId) res.status(401).json({ error: Answers.AUTH.UNAUTHORIZED });
    const ip: string | undefined = req.ip,
      host: string | undefined = req.hostname,
      userAgent: string | undefined = req.headers["user-agent"];
    const logoutSuccess = await logoutUser(userId, ip, host, userAgent);
    if (!logoutSuccess) res.status(401).json({ error: Answers.AUTH.UNAUTHORIZED });
    req.session.destroy((err) => {
      if (err) throw new AppError(Errors.FAILED_TO_DESTROY_SESSION);
      res.setHeader("authorization", "Bearer \"\"");
      res.cookie("refreshToken", "", { httpOnly: true, secure: true });
      res.status(200).json({ message: Answers.AUTH.LOGGED_OUT_SUCCESSFULLY });
    });
  } catch (error) {
    res.status(500).json({ message: Errors.INTERNAL_SERVER_ERROR });
    logger.error(error.message, { error: error.stack });
  }
};

export const forgotPasswordHandler = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    await forgotPassword(email);
    res.status(200).json({ message: Answers.PASSWORD.RESET_CODE_SENT });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const resetPasswordHandler = async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;
  try {
    await resetPassword(email, code, newPassword);
    res.status(200).json({ message: Answers.PASSWORD.PASSWORD_RESET_SUCCESSFULLY });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
