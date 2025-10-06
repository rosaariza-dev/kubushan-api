import BaseException from "./base.exception.js";

class InvalidEmailDomain extends BaseException {
  constructor(message = "Invalid or disposable email domain") {
    super(message, 403);
  }
}

class EmailAlreadyExists extends BaseException {
  constructor(message = "Email already subscribed") {
    super(message, 409);
  }
}

const invalidEmailDomain = () => {
  throw new InvalidEmailDomain();
};

const emailAlreadyExists = () => {
  throw new EmailAlreadyExists();
};

export { invalidEmailDomain, emailAlreadyExists };
