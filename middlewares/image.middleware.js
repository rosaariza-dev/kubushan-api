import { fileTypeFromBuffer } from "file-type";
import express from "express";

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
      console.log("Validating image - Buffer length:", req.body?.length);
      console.log("Content-Type:", req.headers["content-type"]);

      const contentType = req.headers["content-type"];

      if (!contentType) {
        const error = new Error("Content-type is required");
        error.statusCode = 400;
        throw error;
      }
      const isValidImageType =
        contentType.startsWith("image/") ||
        contentType === "application/octet-stream";

      if (!isValidImageType) {
        const error = new Error(
          `Invalid Content-Type: ${contentType}. Expected image/* or application/octet-stream`
        );
        error.statusCode = 400;
        throw error;
      }

      if (!req.body || req.body.length === 0) {
        const error = new Error("Empty file received");
        error.statusCode = 404;
        throw error;
      }

      // Validar tipo de archivo
      const fileType = await fileTypeFromBuffer(req.body);

      if (!fileType || !allowedTypes.includes(fileType.mime)) {
        const error = new Error("Invalid Image format.");
        error.statusCode = 400;
        throw error;
      }

      const contentLength = req.headers["content-length"];
      if (contentLength !== undefined) {
        const size = parseInt(contentLength, 10);
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (size === 0 || isNaN(size)) {
          const error = new Error("File not found");
          error.statusCode = 404;
          throw error;
        }

        if (size > maxSize) {
          const error = new Error(`File too large. Maximum ${maxSize} bytes`);
          error.statusCode = 400;
          throw error;
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  },
];

export default validateImageMiddleware;
