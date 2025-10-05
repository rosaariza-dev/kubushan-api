import mongoose from "mongoose";
import logger from "../logger/index.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import { sendSuccess } from "../utils/response.utils.js";
import bcrypt from "bcryptjs";

export const login = async (req, res, next) => {
  logger.info("Login starting..", { username: req.body.username });
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    logger.inspectDebug(
      "check if there is a user with the same username",
      user
    );

    if (!user) {
      logger.warn("User not found", { username });
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      logger.warn("Invalid password", { username });
      const error = new Error("Invalid Password");
      error.statusCode = 404;
      throw error;
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    logger.inspectDebug("token created", token, { username });

    sendSuccess(res, "User authenticated successfully", token);

    logger.info("User authenticated successfully", { username });
  } catch (error) {
    logger.inspectError("Occurred error while authenticate user", {
      username: req.body.username,
    });
    next(error);
  }
};

export const register = async (req, res, next) => {
  logger.info("Register user starting..", { username: req.body.username });

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { username, password, admin } = req.body;

    const user = await User.findOne({ username });
    logger.inspectDebug(
      "Check if there is a user with the same username",
      user,
      { username, alreadyExist: user ? true : false }
    );

    if (user) {
      logger.warn("User already exists", { username });
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);
    logger.inspectDebug("Password hashed successfully", {
      passwordHashed,
      salt,
    });

    const newUser = await User.create(
      [{ username, passwordHash: passwordHashed, isAdmin: admin }],
      { session }
    );

    logger.inspectDebug(
      "User created completed (awaiting database commit)",
      newUser
    );

    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    logger.inspectDebug("Token created", token, { username });
    await session.commitTransaction();

    const { passwordHash, ...userSafe } = newUser[0].toObject();

    sendSuccess(res, "User registered successfully", userSafe, 201);

    logger.info("User created successfully", { userId: userSafe._id });
  } catch (error) {
    logger.inspectError("Occurred error while register new user", error, {
      username: req.body.username,
    });
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
