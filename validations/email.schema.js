import { z, object, strictObject } from "zod/v4";

const validateBodyEmailSchema = object({
  body: strictObject({
    toEmail: z
      .email({
        error: (iss) =>
          iss.input === undefined
            ? "toEmail is required"
            : "toEmail must be a valid email",
      })
      .trim()
      .min(4, "toEmail must be greater than 4")
      .toLowerCase(),
  }),
});

export const sendEmailSchema = validateBodyEmailSchema;
