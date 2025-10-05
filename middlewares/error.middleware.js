import { ZodError } from "zod/v4";
import logger from "../logger/index.js";

const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;

    //Mongoose bad objectId
    if (err.name === "CastError") {
      const message = "Resource not found";
      error = new Error(message);
      error.statusCode = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
      const message = "Duplicate field value entered";
      error = new Error(message);
      error.statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
      const message = Object.values(err).map((val) => val.message);
      error = new Error(message.join(","));
      error.statusCode = 400;
    }

    // Manejar error específico de PayloadTooLargeError
    if (err.type === "entity.too.large") {
      const message = "File too large. Maximum size allowed is 10MB";
      error = new Error(message);
      error.statusCode = 413;
    }

    // Zod error
    if (err instanceof ZodError) {
      const message = err.issues.map((errorItem) => errorItem.message);
      error = new Error(message.join(","));
      error.statusCode = 400;
    }

    logger.inspectError("Unhandled request error", err, {
      method: req.method,
      url: req.originalUrl,
    });

    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message || "Server error" });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
