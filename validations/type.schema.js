import { z, object, strictObject } from "zod/v4";
import { validateParamsSchema } from "./shared/params.validation.js";

const validateBodyTypeSchema = object({
  body: strictObject({
    name: z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "Type name is required"
            : "Type name must be string",
      })
      .trim()
      .min(2, "Type name must be greater than 2")
      .lowercase(),
    image: z
      .url("Type image must be a valid url")
      .trim()
      .min(10, "Type image must be greater than 10")
      .lowercase()
      .optional(),
  }),
});

export const getTypeSchema = validateParamsSchema;

export const getProductsByTypeSchema = validateParamsSchema;

export const createTypeSchema = validateBodyTypeSchema;

export const updateTypeSchema = object({
  params: validateParamsSchema.shape.params,
  body: validateBodyTypeSchema.shape.body,
});

export const deleteTypeSchema = validateParamsSchema;

export const uploadImageTypeSchema = validateParamsSchema;

export const getImageTypeSchema = validateParamsSchema;
