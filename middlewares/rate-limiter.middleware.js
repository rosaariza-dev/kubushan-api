import rateLimit from "express-rate-limit";

const rateLimitHandler = (req, res, next, options) => {
  const error = new Error(
    options.message || "Too many requests from this IP, please try again later"
  );
  error.statusCode = 429;
  error.code = "RATE_LIMIT_EXCEEDED";
  next(error);
};

export const limiterGlobal = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: "Too many requests from this IP, please try again after 15 minutes",
  handler: rateLimitHandler,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  message:
    "Too many authentication attempts, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // No cuenta requests exitosos, cuenta login fallidos,
  handler: rateLimitHandler,
});

export const subscriptionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3,
  message: "Too many email attempts, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});
