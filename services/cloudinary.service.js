import cloudinary from "../config/cloudinary.js";

export const deleteImageCloudinary = async (publicId) => {
  try {
    return await new Promise((resolve, reject) => {
      const response = cloudinary.api.delete_resources(
        publicId,
        (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

export const deleteImage = async (publicId) => {
  try {
    const result = await deleteImageCloudinary(publicId);
    const statusImage = Object.values(result.deleted)[0];
    if (statusImage === "not_found") {
      const error = new Error(`Image with publicId: ${publicId} not found`);
      error.statusCode = 404;
      throw error;
    }

    if (statusImage !== "deleted") {
      const error = new Error(
        `Image could not be deleted, statusImage: ${statusImage} `
      );
      error.statusCode = 400;
      throw error;
    }

    return result.deleted;
  } catch (error) {
    throw error;
  }
};

export const getImagesCloudinary = async () => {
  const result = await new Promise((resolve, reject) => {
    const response = cloudinary.api.resources((error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });

  return result.resources;
};

export const getImageCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    console.log(result);
    if (result.bytes === 0) {
      const err = new Error(
        `Image with publicId: ${publicId} is not exist. The image may have been deleted. Check the automatic backup of Cloudinary.`
      );
      err.statusCode = 400;
      throw err;
    }

    return result;
  } catch (error) {
    if (error.error && error.error.http_code === 404) {
      const err = new Error(`Image with publicId: ${publicId} is not found.`);
      err.statusCode = 404;
      throw err;
    }

    throw error;
  }
};

export const uploadImageCloudinary = async (
  publicId,
  fileBuffer,
  displayName
) => {
  try {
    const options = {
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      resource_type: "image",
      public_id: publicId,
      display_name: displayName,
    };

    if (!fileBuffer || fileBuffer.lenght === 0) {
      const error = new Error("File not found");
      error.statusCode = 404;
      throw error;
    }

    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            console.error("Error de Cloudinary:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      stream.end(fileBuffer);
    });
  } catch (error) {
    throw error;
  }
};

export const restoreImageCloudinary = async (publicId) => {
  const result = await cloudinary.api.restore(publicId);
  console.log(result);
  return result[publicId];
};

export const isValidUrlCloudinary = (url) => {
  const regexUrlCloudinary =
    "^https://res.cloudinary.com/[a-zA-Z0-9_-]+/image/upload/v\\d+/[a-zA-Z0-9_-]+\\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$";
  const cloudinaryRegex = new RegExp(regexUrlCloudinary);
  return cloudinaryRegex.test(url);
};
