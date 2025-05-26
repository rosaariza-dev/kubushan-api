import { Router } from "express";
import {
  createType,
  deleteType,
  getProductsByType,
  getType,
  getTypes,
  updateType,
} from "../controllers/type.controller.js";

const typeRouter = Router();

typeRouter.get("/", getTypes);

typeRouter.get("/:id", getType);

typeRouter.get("/:id/products", getProductsByType);

typeRouter.post("/", createType);

typeRouter.put("/:id", updateType);

typeRouter.delete("/:id", deleteType);

export default typeRouter;
