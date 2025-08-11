import { v4 as uuidv4 } from "uuid";
import httpContext from "express-http-context";

const correlationMiddleware = (req, res, next) => {
  const correlationId =
    req.headers["x-correlation-id"] || uuidv4().substring(0, 8);

  httpContext.set("correlationId", correlationId);
  res.setHeader("X-Correlation-ID", correlationId);

  next();
};

export default correlationMiddleware;
