import { createLogger, transports, format } from "winston";

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: "DD-MM-YYYY HH:mm:ss:ms" }),
    format.printf(info => `[${info.timestamp}] - ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.File({ filename: "./Logs/error.log", level: "error" }),
    new transports.File({
      filename: "./Logs/all-logs.log",
      // json: false,
      maxsize: 5242880,
      maxFiles: 5
    }),
    new transports.Console()
  ]
});

export class LoggerStream {
    write(message: string) {
        logger.info(message);
    }
}

export default logger;
