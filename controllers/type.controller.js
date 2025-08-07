import mongoose from "mongoose";
import Type from "../models/type.model.js";
import Product from "../models/product.model.js";
import {
  deleteImageCloudinary,
  getImageCloudinary,
  uploadImageCloudinary,
} from "./image.controller.js";

export const getTypes = async (req, res, next) => {
  try {
    const types = await Type.find();
    res.status(200).json({ success: true, data: types });
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

    res.status(200).json({ success: true, data: type });
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
    res.status(200).json({
      success: true,
      data: productsByType,
    });
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

    res.status(201).json({
      success: true,
      message: "Type create successfully",
      data: newTypes[0],
    });
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

    res.status(200).json({
      success: true,
      message: "Type update successfully",
      data: updateType,
    });
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

    res.status(200).json({
      success: true,
      message: "Type delete successfully",
      data: type,
    });
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

    const regexUrlCloudinary =
      "^https://res.cloudinary.com/[a-zA-Z0-9_-]+/image/upload/v\\d+/[a-zA-Z0-9_-]+\\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$";
    const cloudinaryRegex = new RegExp(regexUrlCloudinary);

    if (type.image && cloudinaryRegex.test(type.image)) {
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
    res.send({
      success: true,
      message: "Imagen cargada correctamente",
      data: {
        updateType,
        cloudinaryResult: uploadImage,
      },
    });
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
    console.log(result);
    const response = {
      public_id: result.public_id,
      display_name: result.display_name,
      secure_url: result.secure_url,
      url: result.url,
      format: result.format,
      width: result.width,
      height: result.height,
      resource_type: result.resource_type,
      asset_folder: result.asset_folder,
    };
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
