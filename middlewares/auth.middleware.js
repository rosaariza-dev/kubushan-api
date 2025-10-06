import User from "../models/user.model.js";
import {
  accessDenied,
  tokenInvalid,
  tokenNotProviden,
} from "../exceptions/auth.exception.js";
import logger from "../logger/index.js";
import { verifyToken } from "../services/auth.service.js";

const authorize = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      logger.warn("Token not providen");
      tokenNotProviden();
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);

    if (!user) {
      logger.warn("Invalid token, user not found");
      tokenInvalid();
    }

    if (!user.isAdmin) {
      logger.warn("Forbidden - Admin access required", { userId: user._id });
      accessDenied();
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default authorize;
