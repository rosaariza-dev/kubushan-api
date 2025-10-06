import { typeNotFound } from "../exceptions/type.exception.js";
import Type from "../models/type.model.js";
import { formatImageResponse } from "../utils/response.utils.js";
import { uploadImageCloudinary } from "./cloudinary.service.js";

export const findAllTypes = async () => {
  try {
    return await Type.find();
  } catch (error) {
    throw error;
  }
};

export const findTypeById = async (id) => {
  try {
    const type = await Type.findById(id);
    if (!type) {
      typeNotFound(id);
    }
    return type;
  } catch (error) {
    throw error;
  }
};

export const findTypeByName = async (name) => {
  try {
    return await Type.findOne({ name });
  } catch (error) {
    throw error;
  }
};

export const insertType = async (type, session) => {
  try {
    return await Type.create([type], { session });
  } catch (error) {
    throw error;
  }
};

export const modifyType = async (id, type, session) => {
  try {
    const updateType = await Type.findByIdAndUpdate(id, type, {
      new: true,
      session,
    });

    if (!updateType) {
      typeNotFound(id);
    }
    return updateType;
  } catch (error) {
    throw error;
  }
};

export const removeType = async (id, session) => {
  try {
    return await Type.deleteOne({ _id: id }, { session });
  } catch (error) {
    throw error;
  }
};

export const uploadImageType = async (type, buffer) => {
  try {
    const displayName = `type_${type._id}`;
    const result = await uploadImageCloudinary(type._id, buffer, displayName);
    return formatImageResponse(result);
  } catch (error) {
    throw error;
  }
};


