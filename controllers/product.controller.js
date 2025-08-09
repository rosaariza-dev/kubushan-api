import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Type from "../models/type.model.js";
import { formatImageResponse, sendSuccess } from "../utils/response.utils.js";
import {
  deleteImage,
  deleteImageCloudinary,
  getImageCloudinary,
  isValidUrlCloudinary,
  restoreImageCloudinary,
  uploadImageCloudinary,
} from "../services/cloudinary.service.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    sendSuccess(res, "Products successfully consulted", products);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }
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
    const product = await Product.findOne({ title });
    if (product) {
      const error = new Error("Product already exits");
      error.statusCode = 409;
      throw error;
    }

    const typeOfProduct = await Type.findById(type);

    if (!typeOfProduct) {
      const error = new Error("Product type not found");
      error.statusCode = 404;
      throw error;
    }

    const newProduct = await Product.create(
      [{ title, ...rest, type: typeOfProduct._id }],
      { session }
    );
    await session.commitTransaction();
    session.endSession();

    sendSuccess(res, "Product created successfully", newProduct[0], 201);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { type } = req.body;
    const typeOfProduct = await Type.findById(type);

    if (!typeOfProduct) {
      const error = new Error("Product type not found");
      error.statusCode = 404;
      throw error;
    }

    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, session }
    );

    if (!updateProduct) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    await session.commitTransaction();
    session.endSession();

    sendSuccess(res, "Product updated successfully", updateProduct);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    await Product.deleteOne({ _id: product._id }, { session });
    await session.commitTransaction();
    session.endSession();

    sendSuccess(res, "Product deleted successfully", product);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const uploadAndUpdateImageProduct = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let uploadImage = null;
  let product = null;
  try {
    product = await Product.findById(req.params.id);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    if (product.image && isValidUrlCloudinary(product.image)) {
      const error = new Error(
        `Product already has an image assigned : ${product.image}`
      );
      error.statusCode = 409;
      throw error;
    }

    uploadImage = await uploadImageProduct(product, req.body);
    const updateProduct = await Product.findByIdAndUpdate(
      product._id,
      { image: uploadImage.secure_url },
      { new: true, session }
    );
    if (!updateProduct) {
      const error = new Error(
        "Failed to update product - Resource may have been deleted during operation"
      );
      error.statusCode = 409;
      throw error;
    }
    await session.commitTransaction();

    data = {
      updateProduct,
      cloudinaryResult: uploadImage,
    };

    sendSuccess(res, "Image upload successfully", data);
  } catch (error) {
    await session.abortTransaction();
    if (uploadImage) {
      try {
        console.log(product.id);
        const deleteImage = await deleteImageCloudinary(product.id);
        console.log("Image deleted successfully from Cloudinary", deleteImage);
      } catch (deleteError) {
        console.error("Error occurred while deleting the image:", deleteError);
      }
    }
    next(error);
  } finally {
    session.endSession();
  }
};

export const uploadImageProduct = async (product, buffer) => {
  try {
    const displayName = `prod_${product._id}`;

    const result = await uploadImageCloudinary(
      product._id,
      buffer,
      displayName
    );
    console.log(result);
    const response = formatImageResponse(result);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getImageProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }
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
    product = await Product.findById(req.params.id);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }
    if (!product.image) {
      const error = new Error("No image assigned to this Product");
      error.statusCode = 400;
      throw error;
    }
    cloudinaryResult = await deleteImage(product.id);
    updateProduct = await Product.findByIdAndUpdate(
      product._id,
      { image: null },
      { new: true, session }
    );

    if (!updateProduct) {
      const error = new Error(
        "Failed to update product - Resource may have been deleted during operation"
      );
      error.statusCode = 409;
      throw error;
    }

    await session.commitTransaction();
    data = {
      updateProduct,
      cloudinaryResult,
    };
    sendSuccess(res, "Image successfully deleted", data);
  } catch (error) {
    await session.abortTransaction();
    if (cloudinaryResult) {
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
