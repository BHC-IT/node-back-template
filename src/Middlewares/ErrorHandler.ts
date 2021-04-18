import logger from "../Utils/Logger";

export default function errorHandler(err : any, req : any, res : any, next : any) {
  logger.error(`${err.code || err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  logger.error(`Body : ${JSON.stringify(req.body)}`);
  res.status(err.code ? err.code : 420).json({ error: err.name, message: err.message });
}