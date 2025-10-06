import { fileTypeFromBuffer } from "file-type";
import express from "express";
import {
  contentTypeRequired,
  emptyFile,
  fileNotFound,
  invalidContentType,
  invalidImageFormat,
} from "../exceptions/image.exception";
import logger from "../logger/index.js";

const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/avif",
  "image/webp",
  "image/svg+xml",
];

const validateImageMiddleware = [
  express.raw({
    type: ["image/*", "application/octet-stream"],
    limit: "10mb",
  }),
  async (req, res, next) => {
    try {
      logger.info("Validating image - Buffer length:", req.body?.length);
      logger.info("Content-Type:", req.headers["content-type"]);

      const contentType = req.headers["content-type"];

      if (!contentType) {
        logger.warn("Content-type required", { contentType });
        contentTypeRequired();
      }
      const isValidImageType =
        contentType.startsWith("image/") ||
        contentType === "application/octet-stream";

      if (!isValidImageType) {
        logger.warn("Invalid content-type", { contentType });
        invalidContentType();
      }

      if (!req.body || req.body.length === 0) {
        logger.warn("Empty file");
        emptyFile();
      }

      // Validar tipo de archivo
      const fileType = await fileTypeFromBuffer(req.body);

      if (!fileType || !allowedTypes.includes(fileType.mime)) {
        logger.warn("Invalid Image format.");
        invalidImageFormat();
      }

      const contentLength = req.headers["content-length"];
      if (contentLength !== undefined) {
        const size = parseInt(contentLength, 10);
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (size === 0 || isNaN(size)) {
          logger.warn("File not found");
          fileNotFound();
        }

        if (size > maxSize) {
          logger.warn("File too large", { size, maxSize });
          fileTooLarge(maxSize);
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  },
];

export default validateImageMiddleware;
