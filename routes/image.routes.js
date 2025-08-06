import { Router } from "express";
import {
  deleteImage,
  getImage,
  getImages,
} from "../controllers/image.controller.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import {
  deleteImageSchema,
  getImageSchema,
} from "../validations/image.schema.js";

const imageRouter = Router();

imageRouter.get("/", getImages);

imageRouter.get("/:publicId", validateMiddleware(getImageSchema), getImage);

imageRouter.delete(
  "/:publicId",
  validateMiddleware(deleteImageSchema),
  deleteImage
);

export default imageRouter;
