import { Router } from "express";
import { PING_SECRET_KEY } from "../config/env.js";
import { accessDenied } from "../exceptions/auth.exception.js";

const botRouter = Router();

botRouter.get("/", (req, res, next) => {
  try {
    const key = req.query.key;
    if (key !== PING_SECRET_KEY) {
      accessDenied();
    }
    res.status(200).send("ping");
  } catch (error) {
    next(error);
  }
});

export default botRouter;
