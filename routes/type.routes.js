import { Router } from "express";
import {
  createType,
  deleteType,
  getImageType,
  getProductsByType,
  getType,
  getTypes,
  updateType,
  uploadImageType,
} from "../controllers/type.controller.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import {
  createTypeSchema,
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
  uploadImageType
);

typeRouter.get(
  "/:id/images",
  validateMiddleware(getImageTypeSchema),
  getImageType
);

export default typeRouter;
