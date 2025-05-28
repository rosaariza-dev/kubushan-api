import mongoose from "mongoose";
import { z, object, strictObject } from "zod/v4";

export const validateParamsSchema = object({
  params: strictObject({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Params 'id' is not a valid ObjectId",
    }),
  }),
});
