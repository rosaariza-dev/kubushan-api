import { Router } from "express";
import { getImage } from "../controllers/image.controller.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import { getImageSchema } from "../validations/image.schema.js";

const imageRouter = Router();

imageRouter.get("/", (req, res) => {
  res.send({ message: "GET all images" });
});

imageRouter.get("/:publicId", validateMiddleware(getImageSchema), getImage);

imageRouter.delete("/:id", (req, res) => {
  res.send({ message: "DELETE image" });
});

export default imageRouter;
