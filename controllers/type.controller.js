import mongoose from "mongoose";
import {
  deleteImage,
  deleteImageCloudinary,
  getImageCloudinary,
  isValidUrlCloudinary,
  restoreImageCloudinary,
} from "../services/cloudinary.service.js";
import { formatImageResponse, sendSuccess } from "../utils/response.utils.js";
import {
  findAllTypes,
  findTypeById,
  findTypeByName,
  insertType,
  modifyType,
  removeType,
  uploadImageType,
} from "../services/type.service.js";
import { findProductsByType } from "../services/product.service.js";
import {
  typeAlreadyExits,
  typeAlreadyHasImage,
  typeImageNotExit,
} from "../exceptions/type.exception.js";

export const getTypes = async (req, res, next) => {
  try {
    const types = await findAllTypes();
    sendSuccess(res, "Types successfully consulted", types);
  } catch (error) {
    next(error);
  }
};

export const getType = async (req, res, next) => {
  try {
    const type = await findTypeById(req.params.id);
    sendSuccess(res, "Type successfully consulted", type);
  } catch (error) {
    next(error);
  }
};

export const getProductsByType = async (req, res, next) => {
  try {
    const type = await findTypeById(req.params.id);
    const productsByType = await findProductsByType(type._id);
    sendSuccess(
      res,
      `Products of type: ${type.name} successfully consulted`,
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
    const existingType = await findTypeByName(name);
    if (existingType) {
      typeAlreadyExits(name);
    }

    const newTypes = await insertType({ name, image }, session);
    await session.commitTransaction();
    sendSuccess(res, "Type create successfully", newTypes[0], 201);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const updateType = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const updateType = await modifyType(
      req.params.id,
      { $set: req.body },
      session
    );
    await session.commitTransaction();

    sendSuccess(res, "Type update successfully", updateType);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const deleteType = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const type = await findTypeById(req.params.id);
    await removeType(type._id, session);
    await session.commitTransaction();
    sendSuccess(res, "Type delete successfully", type);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const uploadAndUpdateImageType = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let uploadImage = null;
  let type = null;
  try {
    type = await findTypeById(req.params.id);

    if (type.image && isValidUrlCloudinary(type.image)) {
      typeAlreadyHasImage(type.image);
    }

    uploadImage = await uploadImageType(type, req.body);
    const updateType = await modifyType(
      type._id,
      { image: uploadImage.secure_url },
      session
    );
    await session.commitTransaction();
    const data = {
      updateType,
      cloudinaryResult: uploadImage,
    };
    sendSuccess(res, "Image upload successfully", data);
  } catch (error) {
    await session.abortTransaction();
    if (uploadImage && type) {
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

export const getImageType = async (req, res, next) => {
  try {
    await findTypeById(req.params.id);
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
    type = await findTypeById(req.params.id);

    if (!type.image) {
      typeImageNotExit();
    }
    cloudinaryResult = await deleteImage(type.id);
    updateType = await modifyType(type._id, { image: null }, session);
    await session.commitTransaction();
    const data = {
      updateType,
      cloudinaryResult,
    };
    sendSuccess(res, "Image successfully deleted", data);
  } catch (error) {
    await session.abortTransaction();
    if (cloudinaryResult && type) {
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
