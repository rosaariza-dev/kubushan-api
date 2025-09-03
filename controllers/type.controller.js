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
import logger from "../logger/index.js";

export const getTypes = async (req, res, next) => {
  try {
    logger.info("Getting types..");

    const types = await findAllTypes();
    logger.inspectDebug("Types retrieved", types, {
      totalTypes: types?.length || 0,
    });

    sendSuccess(res, "Types successfully consulted", types);

    logger.info("Types successfully consulted", {
      totalTypes: types?.length || 0,
    });
  } catch (error) {
    logger.inspectError("Error occurred while getting types", error);
    next(error);
  }
};

export const getType = async (req, res, next) => {
  try {
    logger.info("Getting type..", { typeId: req.params.id });

    const type = await findTypeById(req.params.id);
    logger.inspectDebug("Type retrieved ", type, {
      totalType: type ? 1 : 0,
    });

    sendSuccess(res, "Type successfully consulted", type);

    logger.info("Type successfully consulted", { typeId: type.id });
  } catch (error) {
    logger.inspectError("Error occurred while getting type", error, {
      typeId: req.params.id,
    });
    next(error);
  }
};

export const getProductsByType = async (req, res, next) => {
  try {
    logger.info("Getting products of type..", { typeId: req.params.id });

    const type = await findTypeById(req.params.id);
    logger.inspectDebug("Type retrieved", type);

    const productsByType = await findProductsByType(type._id);
    logger.inspectDebug("Products of type retrieved", productsByType, {
      typeId: type.id,
      totalProduct: productsByType?.length || 0,
    });

    sendSuccess(
      res,
      `Products of type: ${type.name} successfully consulted`,
      productsByType
    );

    logger.info("Products of type successfully consulted", {
      typeId: type.id,
      totalProducts: productsByType?.length || 0,
    });
  } catch (error) {
    logger.inspectError(
      "Error occurred while getting products of type",
      error,
      { typeId: req.params.id }
    );
    next(error);
  }
};

export const createType = async (req, res, next) => {
  logger.info("Creating type..");

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, image } = req.body;
    const existingType = await findTypeByName(name);
    logger.inspectDebug(
      "check if a type with the same name exists",
      existingType,
      {
        searchedName: name,
        alreadyExist: existingType ? true : false,
      }
    );

    if (existingType) {
      logger.warn("Already exist a type with the same name", {
        typeName: name,
      });
      typeAlreadyExits(name);
    }

    const newTypes = await insertType({ name, image }, session);
    logger.inspectDebug(
      "Type created completed (awaiting database commit)",
      newTypes
    );

    await session.commitTransaction();

    sendSuccess(res, "Type create successfully", newTypes[0], 201);

    logger.info("Type successfully created", {
      typeIdCreated: newTypes[0]?.id,
    });
  } catch (error) {
    logger.inspectError("Error occurred while creating type", error);
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const updateType = async (req, res, next) => {
  logger.info("Updating type..", { typeId: req.params.id });

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const updateType = await modifyType(
      req.params.id,
      { $set: req.body },
      session
    );
    logger.inspectDebug(
      "Type modification completed (awaiting database commit)",
      updateType
    );

    await session.commitTransaction();

    sendSuccess(res, "Type update successfully", updateType);

    logger.info("Type successfully updated", { typeId: updateType.id });
  } catch (error) {
    logger.inspectError("Error occurred while updating type", error, {
      typeId: req.params.id,
    });
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const deleteType = async (req, res, next) => {
  logger.info("Deleting type..", { typeId: req.params.id });

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const type = await findTypeById(req.params.id);
    logger.inspectDebug("Consulted if type exits", type);

    await removeType(type._id, session);
    logger.inspectDebug(
      "Type elimination completed (awaiting database commit)",
      { typeId: type.id }
    );

    await session.commitTransaction();

    sendSuccess(res, "Type delete successfully", type);

    logger.info("Type successfully deleted", { typeId: type.id });
  } catch (error) {
    logger.inspectError("Error occurred while deleting type", error, {
      typeId: req.params.id,
    });
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const uploadAndUpdateImageType = async (req, res, next) => {
  logger.info("Uploading image to type..", { typeId: req.params.id });

  const session = await mongoose.startSession();
  session.startTransaction();
  let uploadImage = null;
  let type = null;
  try {
    type = await findTypeById(req.params.id);
    logger.inspectDebug(
      "Check if the type exists before upload the image",
      type
    );

    if (type.image && isValidUrlCloudinary(type.image)) {
      logger.warn("Type already have a image assigned", {
        typeId: type.id,
        typeImage: type.image,
      });
      typeAlreadyHasImage(type.image);
    }

    uploadImage = await uploadImageType(type, req.body);
    logger.inspectDebug(
      "Result from cloudinary of upload image of type",
      uploadImage,
      {
        totalImage: uploadImage ? 1 : 0,
        typeId: type.id,
      }
    );

    const updateType = await modifyType(
      type._id,
      { image: uploadImage.secure_url },
      session
    );
    logger.inspectDebug(
      "Type to upload image update (awaiting database commit)",
      updateType
    );

    await session.commitTransaction();

    const data = {
      updateType,
      cloudinaryResult: uploadImage,
    };
    sendSuccess(res, "Image upload successfully", data);

    logger.info("Upload image to type successfully", {
      tyoeId: data.updateType.id,
      typeImage: data.updateType.image,
    });
  } catch (error) {
    await session.abortTransaction();

    if (uploadImage && type) {
      try {
        const deleteImage = await deleteImageCloudinary(type.id);
        logger.inspectDebug(
          "(Revert action) - Result to deleting image from cloudinary",
          deleteImage,
          { publicId: type.id }
        );
        if (deleteImage) {
          logger.info(
            "(Revert action) - Image deleted successfully from cloudinary",
            { publicId: type.id }
          );
        } else {
          logger.warn(
            "(Revert action) - Error occurred while deleting image from cloudinary",
            { publicId: type.id }
          );
        }
      } catch (deleteError) {
        logger.inspectError(
          "(Revert action) - Error occurred while deleting the image:",
          deleteError,
          { publicId: type.id }
        );

        throw deleteError;
      }
    }
    next(error);
  } finally {
    session.endSession();
  }
};

export const getImageType = async (req, res, next) => {
  try {
    logger.info("Getting image of type..", { typeId: req.params.id });
    await findTypeById(req.params.id);

    const result = await getImageCloudinary(req.params.id);
    logger.inspectDebug("Image retrieved from cloudinary of type", result, {
      typeId: req.params.id,
    });

    const formatResult = formatImageResponse(result);

    sendSuccess(res, "Image successfully consulted", formatResult);

    logger.info("Image of type successfully upload", {
      publicId: result.secure_url,
    });
  } catch (error) {
    logger.inspectError("Error occurred while getting image of type", error, {
      typeId: req.params.id,
    });
    next(error);
  }
};

export const deleteAndUpdateImageType = async (req, res, next) => {
  logger.info("Deleting image of type..", { typeId: req.params.id });

  const session = await mongoose.startSession();
  session.startTransaction();
  let type = null;
  let cloudinaryResult = null;
  let updateType = null;
  try {
    type = await findTypeById(req.params.id);
    logger.inspectDebug(
      "check if the type exists before deleting the image",
      type,
      { typeId: req.params.id }
    );

    if (!type.image) {
      logger.warn("The type does not have an image assigned", {
        typeId: type.id,
      });
      typeImageNotExit();
    }

    cloudinaryResult = await deleteImage(type.id);
    logger.inspectDebug(
      "Result from cloudinary of deleting image of type ",
      cloudinaryResult,
      { typeId: type.id }
    );

    updateType = await modifyType(type._id, { image: null }, session);
    logger.inspectDebug(
      "Type to delete image updated (awaiting database commit)",
      updateType
    );

    await session.commitTransaction();

    const data = {
      updateType,
      cloudinaryResult,
    };

    sendSuccess(res, "Image successfully deleted", data);

    logger.info("Image deleted from type successfully", {
      typeId: data.updateType.id,
    });
  } catch (error) {
    logger.inspectError("Error occurred while deleting image of type", error, {
      typeId: req.params.id,
    });
    await session.abortTransaction();

    if (cloudinaryResult && type) {
      try {
        const restoreImageType = await restoreImageCloudinary(type._id);
        logger.inspectDebug(
          "(Revert action) - Result to restore image from cloudinary",
          restoreImageType,
          { publicId: type.id }
        );
        if (restoreImageProduct) {
          logger.info(
            "(Revert action) - Imagen restored successfully:",
            restoreImageType,
            { typeId: type.id }
          );
        } else {
          logger.inspectError(
            "(Revert action) - Imagen not restored:",
            restoreImageType,
            { typeId: type.id }
          );
        }
      } catch (error) {
        logger.inspectError(
          "Error occurred revert deleted operation - deleted image of type",
          error,
          { typeId: type.id }
        );
        throw error;
      }
    }
    next(error);
  } finally {
    session.endSession();
  }
};
