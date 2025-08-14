import logger from "../logger/index.js";
import {
  getImageCloudinary,
  getImagesCloudinary,
} from "../services/cloudinary.service.js";
import { formatImageResponse, sendSuccess } from "../utils/response.utils.js";

export const getImages = async (req, res, next) => {
  try {
    logger.info("Getting images from Cloudinary..");

    const result = await getImagesCloudinary();

    logger.inspectDebug("Images retrieved from Cloudinary:", result, {
      totalImages: result?.length || 0,
      typeResult: typeof result,
    });

    const filteredImages = result
      .filter((item) => item.bytes !== 0)
      .map((item) => formatImageResponse(item));

    logger.inspectDebug("Images filtered result: ", filteredImages, {
      zeroByteImages: (result?.length || 0) - filteredImages.length,
      totalFiltered: filteredImages.length || 0,
    });

    sendSuccess(res, "Images successfully consulted", filteredImages);

    logger.info("Images request completed successfully");
  } catch (error) {
    logger.error("Error occurred while getting the images", error);
    next(error);
  }
};

export const getImage = async (req, res, next) => {
  try {
    logger.info("Getting image from Cloudinary..", {
      publicId: req.params.publicId,
    });
    const result = await getImageCloudinary(req.params.publicId);

    logger.inspectDebug("Image retrieved from cloudinary: ", result);

    const formatResult = formatImageResponse(result);

    sendSuccess(res, "Image successfully consulted", formatResult);

    logger.info("Image successfully consulted", {
      totalImage: formatResult ? 1 : 0,
    });
  } catch (error) {
    logger.inspectError("Error occurred while getting image", error, {
      publicId: req.params.publicId,
    });
    next(error);
  }
};
