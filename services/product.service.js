import Product from "../models/product.model.js";
import { formatImageResponse } from "../utils/response.utils.js";
import { uploadImageCloudinary } from "./cloudinary.service.js";
import { productNotFound } from "../exceptions/product.exception.js";

export const findAllProducts = async () => {
  try {
    return await Product.find();
  } catch (error) {
    throw error;
  }
};

export const findProductsByType = async (type) => {
  try {
    return await Product.find({ type });
  } catch (error) {
    throw error;
  }
};

export const findProductById = async (id) => {
  try {
    const product = await Product.findById(id);
    console.log("product");
    console.log(product);
    if (!product) {
      productNotFound(id);
    }
    return product;
  } catch (error) {
    throw error;
  }
};

export const findProductByTitle = async (title) => {
  try {
    return await Product.findOne({ title });
  } catch (error) {
    throw error;
  }
};

export const insertProduct = async (product, session) => {
  try {
    return await Product.create([product], { session });
  } catch (error) {
    throw error;
  }
};

export const modifyProduct = async (id, product, session) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
      session,
    });

    if (!updateProduct) {
      productNotFound(id);
    }
    return updateProduct;
  } catch (error) {
    throw error;
  }
};

export const removeProduct = async (id, session) => {
  return await Product.deleteOne({ _id: id }, { session });
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

    return formatImageResponse(result);
  } catch (error) {
    throw error;
  }
};
