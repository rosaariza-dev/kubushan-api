import BaseException from "./base.exception.js";

class TypeNotFound extends BaseException {
  constructor(message = "Type not found") {
    super(message, 404);
  }
}

class TypeAlreadyExits extends BaseException {
  constructor(message = "Type already exits") {
    super(message, 409);
  }
}

class TypeAlreadyHasImage extends BaseException {
  constructor(message = "Type already has an image assigned") {
    super(message, 409);
  }
}

class TypeImageNotExit extends BaseException {
  constructor(message = "No image assigned to this Type") {
    super(message, 400);
  }
}

// helpers

const typeNotFound = (id) => {
  const message = id ? `Type with id: ${id} not found` : "Type not found";
  throw new TypeNotFound(message);
};

const typeAlreadyExits = (name) => {
  const message = name
    ? `Type with name: ${name} already exits`
    : "Type already exits";
  throw new TypeAlreadyExits(message);
};

const typeAlreadyHasImage = (image) => {
  const message = image
    ? `Type already has an image assigned : ${image}`
    : "Type already has an image assigned ";
  throw new TypeAlreadyHasImage(message);
};

const typeImageNotExit = () => {
  throw new TypeImageNotExit();
};

export {
  typeNotFound,
  typeAlreadyExits,
  typeAlreadyHasImage,
  typeImageNotExit,
};
