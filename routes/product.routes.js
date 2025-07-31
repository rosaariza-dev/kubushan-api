import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from "../validations/product.schema.js";

const productRouter = Router();

productRouter.get("/", getProducts);

productRouter.get("/:id", validateMiddleware(getProductSchema), getProduct);

productRouter.post("/", validateMiddleware(createProductSchema), createProduct);

productRouter.put(
  "/:id",
  validateMiddleware(updateProductSchema),
  updateProduct
);

productRouter.delete(
  "/:id",
  validateMiddleware(deleteProductSchema),
  deleteProduct
);

export default productRouter;
