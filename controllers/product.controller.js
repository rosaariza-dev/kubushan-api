import mongoose from "mongoose";
import { formatImageResponse, sendSuccess } from "../utils/response.utils.js";
import {
  deleteImage,
  getImageCloudinary,
  isValidUrlCloudinary,
  restoreImageCloudinary,
} from "../services/cloudinary.service.js";
import {
  findAllProducts,
  findProductById,
  findProductByTitle,
  insertProduct,
  modifyProduct,
  removeProduct,
  uploadImageProduct,
} from "../services/product.service.js";
import { findTypeById } from "../services/type.service.js";
import {
  productAlreadyExits,
  productAlreadyHasImage,
  productImageNotExit,
} from "../exceptions/product.exception.js";
import logger from "../logger/index.js";

export const getProducts = async (req, res, next) => {
  try {
    logger.info("Getting products..");

    const products = await findAllProducts();
    logger.inspectDebug("Products retrieved:", products, {
      totalProducts: products?.length || 0,
    });

    sendSuccess(res, "Products successfully consulted", products);

    logger.info("Products successfully consulted", {
      totalProducts: products?.length || 0,
    });
  } catch (error) {
    logger.inspectError("Error occurred while getting products", error);
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    logger.info("Getting product..", { productId: req.params.id });

    const product = await findProductById(req.params.id);
    logger.inspectDebug("Product retrieved ", product, {
      totalProduct: product ? 1 : 0,
    });

    sendSuccess(res, "Product successfully consulted", product);

    logger.info("Product successfully consulted", {
      totalProduct: product ? 1 : 0,
    });
  } catch (error) {
    logger.inspectError("Error occurred while getting product", error, {
      productId: req.params.id,
    });
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  logger.info("Creating product..");

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { title, type, ...rest } = req.body;

    const product = await findProductByTitle(title);
    logger.inspectDebug(
      "check if there is a product with the same title",
      product,
      {
        searchedTitle: title,
        alreadyExist: product ? true : false,
      }
    );

    if (product) {
      logger.warn("Product already exist with the same title", {
        productTitle: title,
      });
      productAlreadyExits(title);
    }

    const typeOfProduct = await findTypeById(type);
    const newProduct = await insertProduct(
      { title, ...rest, type: typeOfProduct._id },
      session
    );
    logger.inspectDebug(
      "Product created completed (awaiting database commit)",
      newProduct
    );
    await session.commitTransaction();

    sendSuccess(res, "Product created successfully", newProduct[0], 201);

    logger.info("Product successfully created", {
      productIdCreated: newProduct[0]?.id,
    });
  } catch (error) {
    logger.inspectError("Error occurred while creating product", error);

    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const updateProduct = async (req, res, next) => {
  logger.info("Updating product..", { publicId: req.params.id });

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { type } = req.body;
    await findTypeById(type);

    const updateProduct = await modifyProduct(req.params.id, req.body, session);
    logger.inspectDebug(
      "Product modification completed (awaiting database commit)",
      updateProduct
    );

    await session.commitTransaction();

    sendSuccess(res, "Product updated successfully", updateProduct);

    logger.info("Product successfully updated", {
      update: updateProduct ? 1 : 0,
    });
  } catch (error) {
    logger.inspectError("Error occurred while updating product", error, {
      productId: req.params.id,
    });
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const deleteProduct = async (req, res, next) => {
  logger.info("Deleting product..", { productId: req.params.id });

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const product = await findProductById(req.params.id);
    logger.inspectDebug("Consulted if product exits", product); // se cambio type a product porque generaba un error

    await removeProduct(product._id, session);
    logger.inspectDebug(
      "Product elimination completed (awaiting database commit)",
      { productId: product.id }
    );

    await session.commitTransaction();

    sendSuccess(res, "Product deleted successfully", product);

    logger.info("Product successfully deleted", { productId: product.id });
  } catch (error) {
    logger.inspectError("Error occurred while deleting product", {
      productId: req.params.id,
    });
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const uploadAndUpdateImageProduct = async (req, res, next) => {
  logger.info("Uploading image to product..", { productId: req.params.id });

  const session = await mongoose.startSession();
  session.startTransaction();
  let uploadImage = null;
  let product = null;
  try {
    product = await findProductById(req.params.id);
    logger.inspectDebug("Consulted product to upload image", product);

    if (product.image && isValidUrlCloudinary(product.image)) {
      logger.warn("Product already have a image assigned", {
        productId: product.id,
        productImage: product.image,
      });
      productAlreadyHasImage(product.image);
    }

    uploadImage = await uploadImageProduct(product, req.body);
    logger.inspectDebug("Image upload to cloudinary", uploadImage, {
      totalImage: uploadImage ? 1 : 0,
      productId: product.id,
    });

    const updateProduct = await modifyProduct(
      product._id,
      { image: uploadImage.secure_url },
      session
    );
    logger.inspectDebug(
      "Product to upload image update (awaiting database commit)",
      updateProduct
    );

    await session.commitTransaction();

    const data = {
      updateProduct,
      cloudinaryResult: uploadImage,
    };
    sendSuccess(res, "Image upload successfully", data);

    logger.info("Upload image to product successfully", {
      productId: data.updateProduct.id,
      productImage: data.updateProduct.image,
    });
  } catch (error) {
    logger.inspectError(
      "Error occurred while upload and update image to product",
      error,
      { productId: req.params.id }
    );
    await session.abortTransaction();
    if (uploadImage && product) {
      try {
        const imageDeleted = await deleteImage(product.id);
        logger.inspectDebug(
          "(Revert action) - Result to deleting image from cloudinary",
          imageDeleted,
          { publicId: product.id }
        );
        if (imageDeleted) {
          logger.info(
            "(Revert action) - Image deleted successfully from cloudinary",
            { publicId: product.id }
          );
        } else {
          logger.warn(
            "(Revert action) - Error occurred while deleting image from cloudinary",
            { publicId: product.id }
          );
        }
      } catch (deleteError) {
        logger.inspectError(
          "(Revert action) - Error occurred while deleting the image:",
          deleteError,
          { publicId: product.id }
        );

        throw deleteError;
      }
    }
    next(error);
  } finally {
    session.endSession();
  }
};

export const getImageProduct = async (req, res, next) => {
  try {
    logger.info("Getting image of product..", { productId: req.params.id });
    await findProductById(req.params.id);

    const result = await getImageCloudinary(req.params.id);
    logger.inspectDebug("Image retrieved from cloudinary of product", result, {
      productId: req.params.id,
    });

    const formatResult = formatImageResponse(result);

    sendSuccess(res, "Image successfully consulted", formatResult);

    logger.info("Image of product successfully upload", {
      publicId: result.secure_url,
    });
  } catch (error) {
    logger.inspectError(
      "Error occurred while getting image of product",
      error,
      { productId: req.params.id }
    );
    next(error);
  }
};

export const deleteAndUpdateImageProduct = async (req, res, next) => {
  logger.info("Deleting image of product..", { productId: req.params.id });

  const session = await mongoose.startSession();
  session.startTransaction();
  let product = null;
  let cloudinaryResult = null;
  let updateProduct = null;
  try {
    product = await findProductById(req.params.id);
    logger.inspectDebug(
      "check if the product exists before deleting the image",
      product,
      { productId: req.params.id }
    );

    if (!product.image) {
      logger.warn("The product does not have an image assigned", {
        productId: product.id,
      });
      productImageNotExit();
    }

    cloudinaryResult = await deleteImage(product.id);
    logger.inspectDebug(
      "Result from cloudinary of deleting image of product ",
      cloudinaryResult,
      { productId: product.id }
    );

    updateProduct = await modifyProduct(product._id, { image: null }, session);
    logger.inspectDebug(
      "Product to delete image updated (awaiting database commit)",
      updateProduct
    );
    await session.commitTransaction();

    const data = {
      updateProduct,
      cloudinaryResult,
    };
    sendSuccess(res, "Image successfully deleted", data);

    logger.info("Image deleted from product successfully", {
      productId: data.updateProduct.id,
    });
  } catch (error) {
    logger.inspectError(
      "Error occurred while deleting image of product",
      error,
      { productId: req.params.id }
    );
    await session.abortTransaction();

    if (cloudinaryResult && product) {
      try {
        const restoreImageProduct = await restoreImageCloudinary(product._id);
        logger.inspectDebug(
          "(Revert action) - Result to restore image from cloudinary",
          restoreImageProduct,
          { publicId: product.id }
        );
        if (restoreImageProduct) {
          logger.info(
            "(Revert action) - Imagen restored successfully:",
            restoreImageProduct,
            { productId: product.id }
          );
        } else {
          logger.inspectError(
            "(Revert action) - Imagen not restored:",
            restoreImageProduct,
            { productId: product.id }
          );
        }
      } catch (error) {
        logger.inspectError(
          "Error occurred revert deleted operation - deleted image of product",
          error,
          { productId: product.id }
        );
        throw error;
      }
    }
    next(error);
  } finally {
    session.endSession();
  }
};
