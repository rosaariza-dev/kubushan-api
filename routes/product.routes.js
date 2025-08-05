import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getImageProduct,
  getProduct,
  getProducts,
  updateProduct,
  uploadImageProduct,
} from "../controllers/product.controller.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import {
  createProductSchema,
  deleteProductSchema,
  getImageProductSchema,
  getProductSchema,
  updateProductSchema,
  uploadImageProductSchema,
} from "../validations/product.schema.js";
import validateImageMiddleware from "../middlewares/image.middleware.js";

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

productRouter.post(
  "/:id/images",
  validateMiddleware(uploadImageProductSchema),
  validateImageMiddleware,
  uploadImageProduct
);

productRouter.get(
  "/:id/images",
  validateMiddleware(getImageProductSchema),
  getImageProduct
);

export default productRouter;
