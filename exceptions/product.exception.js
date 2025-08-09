import BaseException from "./base.exception.js";

class ProductNotFound extends BaseException {
  constructor(message = "Product not found") {
    super(message, 404);
  }
}

class ProductAlreadyExits extends BaseException {
  constructor(message = "Product already exits") {
    super(message, 409);
  }
}

class ProductAlreadyHasImage extends BaseException {
  constructor(message = "Product already has an image assigned") {
    super(message, 409);
  }
}

class ProductImageNotExit extends BaseException {
  constructor(message = "No image assigned to this Product") {
    super(message, 400);
  }
}

// helpers

const productNotFound = (id) => {
  const message = id ? `Product with id: ${id} not found` : "Product not found";
  throw new ProductNotFound(message);
};

const productAlreadyExits = (title) => {
  const message = title
    ? `Product with title: ${title} already exits`
    : "Product already exits";
  throw new ProductAlreadyExits(message);
};

const productAlreadyHasImage = (image) => {
  const message = image
    ? `Product already has an image assigned : ${image}`
    : "Product already has an image assigned ";
  throw new ProductAlreadyHasImage();
};

const productImageNotExit = () => {
  throw new ProductImageNotExit();
};

export {
  productNotFound,
  productAlreadyExits,
  productAlreadyHasImage,
  productImageNotExit,
};
