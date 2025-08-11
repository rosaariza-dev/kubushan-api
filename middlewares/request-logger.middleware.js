import logger from "../logger/index.js";

const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log inicio
  logger.httpStart(req);

  // Capturar cuando termine la respuesta
  res.on("finish", () => {
    const responseTime = Date.now() - startTime;
    logger.httpEnd(req, res, responseTime);
  });

  next();
};

export default requestLogger;
