import cloudinary from "../config/cloudinary.js";

export const getImages = async (req, res, next) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const response = cloudinary.api.resources((error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
    console.log(result);
    const filteredImages = result.resources.map((item) => ({
      public_id: item.public_id,
      secure_url: item.secure_url,
      url: item.url,
      format: item.format,
      width: item.width,
      height: item.height,
      resource_type: item.resource_type,
      asset_folder: item.asset_folder,
    }));
    res.send({
      success: true,
      message: "Imagenes consultas exitosamente",
      data: filteredImages,
    });
  } catch (error) {
    next(error);
  }
};

export const getImage = async (req, res, next) => {
  try {
    const result = await getImageCloudinary(req.params.publicId, next);
    res.send({
      success: true,
      message: "Imagen consultada correctamente",
      data: {
        public_id: result.public_id,
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

export const deleteImage = async (req, res, next) => {
  try {
    const result = await deleteImageCloudinary(req.params.publicId, next);
    const statusImage = Object.values(result.deleted)[0];
    if (statusImage === "not_found") {
      const error = new Error(
        `Image with publicId: ${req.params.publicId} not found`
      );
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

    res.send({
      success: true,
      message: "Imagen eliminada exitosamente",
      data: result.deleted,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteImageCloudinary = async (publicId, next) => {
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
    next(error);
  }
};

export const getImageCloudinary = async (publicId, next) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    console.log(result);
    return result;
  } catch (error) {
    if (error.error && error.error.http_code === 404) {
      const err = new Error(`Image with publicId: ${publicId} is not found.`);
      err.statusCode = 404;
      throw err;
    }

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
