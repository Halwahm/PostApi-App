import redis from "ioredis";
import { promisify } from "util";
import dotenv from "dotenv";
import { Answers } from "../answers";
import createLogger from "../utils/loggerUtil";

dotenv.config();
const logger = createLogger("errors.log");
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) throw new Error(Answers.ERROR.INVALID_REDIS_URL);
const client = new redis(redisUrl);

const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

export const cacheJwtToken = async (userId: string, token: string) => {
  try {
    return setAsync(userId, token, "EX", 864000);
  } catch (error) {
    logger.error(Answers.ERROR.ERROR_CACHING, { error: error.stack });
    throw error;
  }
};

export const getJwtTokenFromCache = async (userId: string) => {
  return getAsync(userId);
};
