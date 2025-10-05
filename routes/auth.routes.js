import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/login", login);

authRouter.post("/register", authorize, register);

export default authRouter;
