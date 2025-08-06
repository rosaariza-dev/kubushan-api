import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Type from "../models/type.model.js";
import {
  getImageCloudinary,
  uploadImageCloudinary,
} from "./image.controller.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, data: products });
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
    res.status(200).json({ success: true, data: product });
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

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct[0],
    });
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

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updateProduct,
    });
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

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const uploadImageProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }
    const displayName = `prod_${product._id}`;
    const result = await uploadImageCloudinary(
      req.params.id,
      req.body,
      displayName
    );
    console.log(result);
    res.send({
      success: true,
      message: "Imagen cargada correctamente",
      data: {
        public_id: result.public_id,
        display_name: result.display_name,
        secure_url: result.secure_url,
        url: result.url,
        format: result.format,
        width: result.width,
        height: result.height,
        resource_type: result.resource_type,
        asset_folder: result.asset_folder,
      },
    });
  } catch (error) {
    next(error);
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
    res.send({
      success: true,
      message: "Imagen consultada correctamente",
      data: {
        public_id: result.public_id,
        display_name: result.display_name,
        secure_url: result.secure_url,
        url: result.url,
        format: result.format,
        width: result.width,
        height: result.height,
        resource_type: result.resource_type,
        asset_folder: result.asset_folder,
      },
    });
  } catch (error) {
    next(error);
  }
};
