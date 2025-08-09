import mongoose from "mongoose";
import Type from "../models/type.model.js";
import {
  deleteImage,
  deleteImageCloudinary,
  getImageCloudinary,
  isValidUrlCloudinary,
  restoreImageCloudinary,
  uploadImageCloudinary,
} from "../services/cloudinary.service.js";
import Product from "../models/product.model.js";
import { formatImageResponse, sendSuccess } from "../utils/response.utils.js";

export const getTypes = async (req, res, next) => {
  try {
    const types = await Type.find();
    sendSuccess(res, "Types successfully consulted", types);
  } catch (error) {
    next(error);
  }
};

export const getType = async (req, res, next) => {
  try {
    const type = await Type.findById(req.params.id);
    if (!type) {
      const error = new Error("Type not found");
      error.statusCode = 404;
      throw error;
    }

    sendSuccess(res, "Type successfully consulted", type);
  } catch (error) {
    next(error);
  }
};

export const getProductsByType = async (req, res, next) => {
  try {
    const type = await Type.findById(req.params.id);
    if (!type) {
      const error = new Error("Type not found");
      error.statusCode = 404;
      throw error;
    }

    const productsByType = await Product.find({ type: type._id });
    sendSuccess(
      res,
      `Product of type: ${type.name} successfully consulted`,
      productsByType
    );
  } catch (error) {
    next(error);
  }
};

export const createType = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, image } = req.body;
    const existingType = await Type.findOne({ name });
    if (existingType) {
      const error = new Error("Type already exits");
      error.statusCode = 409;
      throw error;
    }

    const newTypes = await Type.create([{ name, image }], { session });
    await session.commitTransaction();
    session.endSession();
    sendSuccess(res, "Type create successfully", newTypes[0], 201);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const updateType = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const updateType = await Type.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, session }
    );

    if (!updateType) {
      const error = new Error("Type not found");
      error.statusCode = 404;
      throw error;
    }

    await session.commitTransaction();
    session.endSession();

    sendSuccess(res, "Type update successfully", updateType);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const deleteType = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const type = await Type.findById(req.params.id);
    if (!type) {
      const error = new Error("Type not found");
      error.statusCode = 404;
      throw error;
    }

    await Type.deleteOne({ _id: type._id }, { session });
    await session.commitTransaction();
    session.endSession();
    sendSuccess(res, "Type delete successfully", type);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const uploadAndUpdateImageType = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let uploadImage = null;
  let type = null;
  try {
    type = await Type.findById(req.params.id);
    if (!type) {
      const error = new Error("Type not found");
      error.statusCode = 404;
      throw error;
    }

    if (type.image && isValidUrlCloudinary(type.image)) {
      const error = new Error(
        `Type already has an image assigned : ${type.image}`
      );
      error.statusCode = 409;
      throw error;
    }

    uploadImage = await uploadImageType(type, req.body);
    const updateType = await Type.findByIdAndUpdate(
      type._id,
      { image: uploadImage.secure_url },
      { new: true, session }
    );
    if (!updateType) {
      const error = new Error(
        "Failed to update type - Resource may have been deleted during operation"
      );
      error.statusCode = 409;
      throw error;
    }
    await session.commitTransaction();
    data = {
      updateType,
      cloudinaryResult: uploadImage,
    };
    sendSuccess(res, "Image upload successfully", data);
  } catch (error) {
    await session.abortTransaction();
    if (uploadImage) {
      try {
        console.log(type.id);
        const deleteImage = await deleteImageCloudinary(type.id);
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

export const uploadImageType = async (type, buffer) => {
  try {
    const displayName = `type_${type._id}`;
    const result = await uploadImageCloudinary(type._id, buffer, displayName);
    const response = formatImageResponse(result);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getImageType = async (req, res, next) => {
  try {
    const type = await Type.findById(req.params.id);
    if (!type) {
      const error = new Error("Type not found");
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

export const deleteAndUpdateImageType = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let type = null;
  let cloudinaryResult = null;
  let updateType = null;
  try {
    type = await Type.findById(req.params.id);
    if (!type) {
      const error = new Error("Type not found");
      error.statusCode = 404;
      throw error;
    }
    if (!type.image) {
      const error = new Error("No image assigned to this Type");
      error.statusCode = 400;
      throw error;
    }
    cloudinaryResult = await deleteImage(type.id);
    updateType = await Type.findByIdAndUpdate(
      type._id,
      { image: null },
      { new: true, session }
    );

    if (!updateType) {
      const error = new Error(
        "Failed to update type - Resource may have been deleted during operation"
      );
      error.statusCode = 409;
      throw error;
    }

    await session.commitTransaction();
    data = {
      updateType,
      cloudinaryResult,
    };
    sendSuccess(res, "Image successfully deleted", data);
  } catch (error) {
    await session.abortTransaction();
    if (cloudinaryResult) {
      try {
        const deleteImageType = await restoreImageCloudinary(type._id);
        if (deleteImageType) {
          console.log("Imagen deleted successfully:", deleteImageType);
        } else {
          console.log("Imagen not deleted:", deleteImageType);
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
