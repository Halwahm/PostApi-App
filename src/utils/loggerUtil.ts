import winston, { format } from "winston";
import path from "path";

const createLogger = (logFileName: string) => {
  const logsDirectory = path.join("logs");
  return winston.createLogger({
    format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: path.join(logsDirectory, logFileName)
      })
    ]
  });
};

export default createLogger;
