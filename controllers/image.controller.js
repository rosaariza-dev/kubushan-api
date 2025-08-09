import {
  getImageCloudinary,
  getImagesCloudinary,
} from "../services/cloudinary.service.js";
import { formatImageResponse, sendSuccess } from "../utils/response.utils.js";

export const getImages = async (req, res, next) => {
  try {
    const result = await getImagesCloudinary();
    console.log(result);
    const filteredImages = result
      .filter((item) => item.bytes !== 0)
      .map((item) => formatImageResponse(item));

    sendSuccess(res, "Images successfully consulted", filteredImages);
  } catch (error) {
    next(error);
  }
};

export const getImage = async (req, res, next) => {
  try {
    const result = await getImageCloudinary(req.params.publicId);
    console.log(result);
    const formatResult = formatImageResponse(result);
    sendSuccess(res, "Image successfully consulted", formatResult);
  } catch (error) {
    next(error);
  }
};
