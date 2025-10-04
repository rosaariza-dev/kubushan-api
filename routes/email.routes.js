import { Router } from "express";
import { sendEmail } from "../controllers/email.controller.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import { sendEmailSchema } from "../validations/email.schema.js";

const emailRouter = Router();
emailRouter.post("/", validateMiddleware(sendEmailSchema), sendEmail);

export default emailRouter;
