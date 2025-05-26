import mongoose from "mongoose";

const typeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Type name is required"],
      trim: true,
      lowercase: true,
      minLenght: 2,
    },
    image: {
      type: String,
      required: false,
      trim: true,
      minLenght: 10,
    },
  },
  { timestamps: true }
);

const Type = mongoose.model("Type", typeSchema);

export default Type;
