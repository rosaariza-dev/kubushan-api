import { Router } from "express";
import {
  createType,
  deleteType,
  getProductsByType,
  getType,
  getTypes,
  updateType,
} from "../controllers/type.controller.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import {
  createTypeSchema,
  deleteTypeSchema,
  getProductsByTypeSchema,
  getTypeSchema,
  updateTypeSchema,
} from "../validations/type.schema.js";

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

export default typeRouter;
