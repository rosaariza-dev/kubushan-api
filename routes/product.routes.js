import { Router } from "express";
import {
  createProduct,
  deleteAndUpdateImageProduct,
  deleteProduct,
  getImageProduct,
  getProduct,
  getProducts,
  updateProduct,
  uploadAndUpdateImageProduct,
} from "../controllers/product.controller.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import {
  createProductSchema,
  deleteImageProductSchema,
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
  uploadAndUpdateImageProduct
);

productRouter.get(
  "/:id/images",
  validateMiddleware(getImageProductSchema),
  getImageProduct
);

productRouter.delete(
  "/:id/images",
  validateMiddleware(deleteImageProductSchema),
  deleteAndUpdateImageProduct
);
export default productRouter;
