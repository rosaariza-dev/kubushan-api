import BaseException from "./base.exception.js";

class InvalidCredentials extends BaseException {
  constructor(message = "Invalid credentials") {
    super(message, 401);
  }
}

class UserAlreadyExits extends BaseException {
  constructor(message = "User already exits") {
    super(message, 409);
  }
}

class TokenNotProviden extends BaseException {
  constructor(message = "Token not providen") {
    super(message, 401);
  }
}

class AccessDenied extends BaseException {
  constructor(message = "Access Denied") {
    super(message, 403);
  }
}

class TokenInvalid extends BaseException {
  constructor(message = "Invalid Token") {
    super(message, 401);
  }
}

const invalidCredentials = () => {
  throw new InvalidCredentials();
};

const userAlreadyExits = (username) => {
  const message = username
    ? `User with username: ${username} already exits `
    : "User already exits ";
  throw new UserAlreadyExits(message);
};

const tokenNotProviden = () => {
  throw new TokenNotProviden();
};

const accessDenied = () => {
  throw new AccessDenied();
};

const tokenInvalid = () => {
  throw new TokenInvalid();
};

export {
  invalidCredentials,
  userAlreadyExits,
  tokenNotProviden,
  accessDenied,
  tokenInvalid,
};
