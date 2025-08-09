import {
  getImageCloudinary,
  getImagesCloudinary,
} from "../services/cloudinary.service.js";
import { formatImageResponse } from "../utils/response.utils.js";

export const getImages = async (req, res, next) => {
  try {
    const result = await getImagesCloudinary();
    console.log(result);
    const filteredImages = result
      .filter((item) => item.bytes !== 0)
      .map((item) => formatImageResponse(item));

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
    const result = await getImageCloudinary(req.params.publicId);
    const formatResult = formatImageResponse(result);
    console.log(result);
      res.send({
        success: true,
        message: "Imagen consultada correctamente",
        data: formatResult,
      });
  } catch (error) {
    next(error);
  }
};
