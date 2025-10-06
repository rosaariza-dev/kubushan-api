import BaseException from "./base.exception.js";

class ImageNotFound extends BaseException {
  constructor(message = "Image not found") {
    super(message, 404);
  }
}

class InvalidImageFormat extends BaseException {
  constructor(message = "Invalid Image format.") {
    super(message, 400);
  }
}

class FileTooLarge extends BaseException {
  constructor(message = "File too large.") {
    super(message, 413);
  }
}

class EmptyFile extends BaseException {
  constructor(message = "Empty file received.") {
    super(message, 404);
  }
}

class ImageNotDeleted extends BaseException {
  constructor(message = "Image could not be deleted") {
    super(message, 400);
  }
}

class ImageNotContent extends BaseException {
  constructor(
    message = "Image not exits. The image may have been deleted. Check the automatic backup of Cloudinary."
  ) {
    super(message, 400);
  }
}

class FileNotFound extends BaseException {
  constructor(message = "File not found") {
    super(message, 404);
  }
}

class ContentTypeRequired extends BaseException {
  constructor(message = "Content-type is required") {
    super(message, 400);
  }
}

class InvalidContentType extends BaseException {
  constructor(
    message = "Invalid Content-Type. Expected image/* or application/octet-stream"
  ) {
    super(message, 400);
  }
}

const imageNotFound = (publicId) => {
  const message = publicId
    ? `Image with publicId: ${publicId} not found`
    : "Image not found";
  throw new ImageNotFound(message);
};

const imageNotDeleted = (statusImage) => {
  const message = statusImage
    ? `Image could not be deleted, statusImage: ${statusImage}`
    : "Image could not be deleted";
  throw new ImageNotDeleted(message);
};

const imageNotContent = (publicId) => {
  const message = publicId
    ? `Image with publicId: ${publicId} is not exist. The image may have been deleted. Check the automatic backup of Cloudinary.`
    : "Image not exits. The image may have been deleted. Check the automatic backup of Cloudinary.";
  throw new ImageNotContent(message);
};

const fileNotFound = () => {
  throw new FileNotFound();
};

const invalidImageFormat = () => {
  throw new InvalidImageFormat();
};

const fileTooLarge = (maxSize) => {
  const message = maxSize
    ? `File too large. Maximum ${maxSize} bytes`
    : "File too large.";
  throw new FileTooLarge(message);
};

const emptyFile = () => {
  throw new EmptyFile();
};

const contentTypeRequired = () => {
  throw new ContentTypeRequired();
};

const invalidContentType = (contentType) => {
  const message = publicId
    ? `Invalid Content-Type: ${contentType}. Expected image/* or application/octet-stream`
    : "Invalid Content-Type. Expected image/* or application/octet-stream";
  throw new InvalidContentType(message);
};

export {
  imageNotFound,
  imageNotDeleted,
  imageNotContent,
  fileNotFound,
  invalidImageFormat,
  fileTooLarge,
  emptyFile,
  contentTypeRequired,
  invalidContentType,
};
