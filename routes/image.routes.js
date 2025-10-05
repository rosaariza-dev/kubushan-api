import { Router } from "express";
import { getImage, getImages } from "../controllers/image.controller.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import { getImageSchema } from "../validations/image.schema.js";
import authorize from "../middlewares/auth.middleware.js";

const imageRouter = Router();

imageRouter.get("/", authorize, getImages);

imageRouter.get(
  "/:publicId",
  authorize,
  validateMiddleware(getImageSchema),
  getImage
);

export default imageRouter;
