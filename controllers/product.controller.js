import mongoose from "mongoose";
import { formatImageResponse, sendSuccess } from "../utils/response.utils.js";
import {
  deleteImage,
  deleteImageCloudinary,
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

export const getProducts = async (req, res, next) => {
  try {
    const products = await findAllProducts();
    sendSuccess(res, "Products successfully consulted", products);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await findProductById(req.params.id);
    sendSuccess(res, "Product successfully consulted", product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { title, type, ...rest } = req.body;
    const product = await findProductByTitle(title);
    if (product) {
      productAlreadyExits(title);
    }

    const typeOfProduct = await findTypeById(type);
    const newProduct = await insertProduct(
      { title, ...rest, type: typeOfProduct._id },
      session
    );
    await session.commitTransaction();

    sendSuccess(res, "Product created successfully", newProduct[0], 201);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const updateProduct = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { type } = req.body;
    await findTypeById(type);
    const updateProduct = await modifyProduct(req.params.id, req.body, session);
    await session.commitTransaction();

    sendSuccess(res, "Product updated successfully", updateProduct);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const deleteProduct = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const product = await findProductById(req.params.id);

    await removeProduct(product._id, session);
    await session.commitTransaction();

    sendSuccess(res, "Product deleted successfully", product);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const uploadAndUpdateImageProduct = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let uploadImage = null;
  let product = null;
  try {
    product = await findProductById(req.params.id);

    if (product.image && isValidUrlCloudinary(product.image)) {
      productAlreadyHasImage(product.image);
    }

    uploadImage = await uploadImageProduct(product, req.body);
    const updateProduct = await modifyProduct(
      product._id,
      { image: uploadImage.secure_url },
      session
    );
    await session.commitTransaction();

    const data = {
      updateProduct,
      cloudinaryResult: uploadImage,
    };
    sendSuccess(res, "Image upload successfully", data);
  } catch (error) {
    await session.abortTransaction();
    if (uploadImage && product) {
      try {
        console.log(product.id);
        const deleteImage = await deleteImageCloudinary(product.id);
        console.log("Image deleted successfully from Cloudinary", deleteImage);
      } catch (deleteError) {
        console.error("Error occurred while deleting the image:", deleteError);
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
    await findProductById(req.params.id);
    const result = await getImageCloudinary(req.params.id);
    const formatResult = formatImageResponse(result);

    sendSuccess(res, "Image successfully consulted", formatResult);
  } catch (error) {
    next(error);
  }
};

export const deleteAndUpdateImageProduct = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let product = null;
  let cloudinaryResult = null;
  let updateProduct = null;
  try {
    product = await findProductById(req.params.id);
    if (!product.image) {
      productImageNotExit();
    }
    cloudinaryResult = await deleteImage(product.id);
    updateProduct = await modifyProduct(product._id, { image: null }, session);

    await session.commitTransaction();
    const data = {
      updateProduct,
      cloudinaryResult,
    };
    sendSuccess(res, "Image successfully deleted", data);
  } catch (error) {
    await session.abortTransaction();
    if (cloudinaryResult && product) {
      try {
        const deleteImageProduct = await restoreImageCloudinary(product._id);
        if (deleteImageProduct) {
          console.log("Imagen deleted successfully:", deleteImageProduct);
        } else {
          console.log("Imagen not deleted:", deleteImageProduct);
        }
      } catch (error) {
        console.log(
          "Error occurred revert deleted operation - upload image",
          error
        );
        throw error;
      }
    }
    next(error);
  } finally {
    session.endSession();
  }
};
