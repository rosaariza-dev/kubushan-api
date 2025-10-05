import { object, strictObject, z } from "zod/v4";

const validateFieldUsername = z
  .string({
    error: (iss) =>
      iss.input === undefined
        ? "Username is required"
        : "Username must be string",
  })
  .trim()
  .min(2, "Username must be greater than 2")
  .toLowerCase();

const validateFieldPassword = z
  .string({
    error: (iss) =>
      iss.input === undefined
        ? "Password is required"
        : "Password must be string",
  })
  .trim()
  .min(2, "Password must be greater than 2");

const validateFieldAdmin = z.boolean({
  error: (iss) =>
    iss.input === undefined ? "Admin is required" : "Admin must be a boolean",
});

const baseAuthSchema = strictObject({
  username: validateFieldUsername,
  password: validateFieldPassword,
});

const loginUserSchema = object({
  body: baseAuthSchema,
});

const registerUserSchema = object({
  body: baseAuthSchema.extend({
    admin: validateFieldAdmin,
  }),
});

export { loginUserSchema, registerUserSchema };
