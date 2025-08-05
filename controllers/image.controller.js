import cloudinary from "../config/cloudinary.js";

export const getImages = (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const getImage = (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const uploadImageCloudinary = async (publicId, fileBuffer, next) => {
  try {
    const options = {
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      resource_type: "image",
      public_id: publicId,
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
    next(error);
  }
};

export const deleteImage = (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
