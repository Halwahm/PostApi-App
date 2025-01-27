import { Request, Response } from "express";
import userService from "../services/userService";
import createLogger from "../utils/loggerUtil";
import { getUserDataFromRequest, getUserRole } from "../utils/authUtil";
import { Errors } from "../errors";
import { Answers } from "../answers";

const logger = createLogger("errors.log");

const userController = {
  getUserProfile: async (req: Request, res: Response) => {
    const userId = req.query.id as string;
    if (!userId) res.status(401).json(Answers.ERROR.NOT_ENOUGH_DATA);
    try {
      const userProfile = await userService.getUserProfile(userId);
      res.status(200).json(userProfile);
    } catch (error) {
      logger.error(error.message, { error: error.stack });
      res.status(500).json({ error: error.message });
    }
  },
  getAllUsers: async (req: Request, res: Response) => {
    const search = req.query.search as string | undefined;
    try {
      const users = await userService.getAllUsers(search);
      res.status(200).json(users);
    } catch (error) {
      logger.error(error.message, { error: error.stack });
      res.status(500).json({ error: Errors.INTERNAL_SERVER_ERROR });
    }
  },
  getUserSubscribers: async (req: Request, res: Response) => {
    const userId = req.query.id as string;
    const search = req.query.search as string | undefined;
    if (!userId) res.status(401).json({ message: Answers.ERROR.NOT_ENOUGH_DATA });
    try {
      const subscriptions = await userService.getUserSubscribers(userId, search);
      res.status(200).json(subscriptions);
    } catch (error) {
      logger.error(error.message, { error: error.stack });
      res.status(500).json({ error: error.message });
    }
  },
  getUserSubscribed: async (req: Request, res: Response) => {
    const userId = req.query.id as string;
    const search = req.query.search as string | undefined;
    if (!userId) res.status(401).json({ message: Answers.ERROR.NOT_ENOUGH_DATA });
    try {
      const subscriptions = await userService.getUserSubscribed(userId, search);
      res.status(200).json(subscriptions);
    } catch (error) {
      logger.error(error.message, { error: error.stack });
      res.status(500).json({ error: error.message });
    }
  },
  getStatistics: async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    const { userId, userRole } = getUserDataFromRequest(req);
    const usrRole = getUserRole(userRole);
    if (!userId || !userRole)
      res.status(401).json({ message: Answers.AUTH.UNAUTHORIZED_OR_NO_PERM });
    if (!startDate || !endDate) res.status(400).json({ message: Answers.ERROR.NOT_ENOUGH_DATA });
    else {
      try {
        const startDateStr = startDate.toString();
        const endDateStr = endDate.toString();
        const statistics = await userService.getStatistics(startDateStr, endDateStr, usrRole);
        res.json(statistics);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
};

export default userController;
