import { z, object, strictObject } from "zod/v4";
import { validateParamsSchema } from "./shared/params.validation.js";
import mongoose from "mongoose";

const validateBodyProductSchema = object({
  body: strictObject({
    title: z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "Product title is required"
            : "Product title must be string",
      })
      .trim()
      .min(2, "Product title must be greater than 2")
      .toLowerCase(),
    description: z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "Product description is required"
            : "Product description must be string",
      })
      .trim()
      .min(2, "Product description must be greater than 2")
      .toLowerCase(),
    price: z
      .number({
        error: (iss) =>
          iss.input === undefined
            ? "Product price is required"
            : "Product price must be number",
      })
      .min(1, "Product price must be greater than 0"),
    image: z
      .url("Product image is not a valid url")
      .trim()
      .min(10, "Product url must be greater than 10")
      .optional(),
    type: z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "Product type is required"
            : "Product type must be string",
      })
      .trim()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Product type is not a valid ObjectId",
      }),
  }),
});

export const getProductSchema = validateParamsSchema;
export const createProductSchema = validateBodyProductSchema;
export const updateProductSchema = object({
  params: validateParamsSchema.shape.params,
  body: validateBodyProductSchema.shape.body,
});
export const deleteProductSchema = validateParamsSchema;
