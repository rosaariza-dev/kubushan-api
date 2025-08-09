import { Router } from "express";
import {
  createType,
  deleteAndUpdateImageType,
  deleteType,
  getImageType,
  getProductsByType,
  getType,
  getTypes,
  updateType,
  uploadAndUpdateImageType,
} from "../controllers/type.controller.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import {
  createTypeSchema,
  deleteImageTypeSchema,
  deleteTypeSchema,
  getImageTypeSchema,
  getProductsByTypeSchema,
  getTypeSchema,
  updateTypeSchema,
  uploadImageTypeSchema,
} from "../validations/type.schema.js";
import validateImageMiddleware from "../middlewares/image.middleware.js";

const typeRouter = Router();

typeRouter.get("/", getTypes);

typeRouter.get("/:id", validateMiddleware(getTypeSchema), getType);

typeRouter.get(
  "/:id/products",
  validateMiddleware(getProductsByTypeSchema),
  getProductsByType
);

typeRouter.post("/", validateMiddleware(createTypeSchema), createType);

typeRouter.put("/:id", validateMiddleware(updateTypeSchema), updateType);

typeRouter.delete("/:id", validateMiddleware(deleteTypeSchema), deleteType);

typeRouter.post(
  "/:id/images",
  validateMiddleware(uploadImageTypeSchema),
  validateImageMiddleware,
  uploadAndUpdateImageType
);

typeRouter.get(
  "/:id/images",
  validateMiddleware(getImageTypeSchema),
  getImageType
);

typeRouter.delete(
  "/:id/images",
  validateMiddleware(deleteImageTypeSchema),
  deleteAndUpdateImageType
);

export default typeRouter;
