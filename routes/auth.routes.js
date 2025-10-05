import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validations/user.schema.js";

const authRouter = Router();

authRouter.post("/login", validateMiddleware(loginUserSchema), login);

authRouter.post(
  "/register",
  authorize,
  validateMiddleware(registerUserSchema),
  register
);

export default authRouter;
