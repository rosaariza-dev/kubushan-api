import BaseException from "./base.exception.js";

class ImageNotFound extends BaseException {
  constructor(message = "Image not found") {
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

export { imageNotFound, imageNotDeleted, imageNotContent, fileNotFound };
