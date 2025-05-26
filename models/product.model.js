import mongoose, { SchemaType } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      lowercase: true,
      minLenght: 2,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      lowercase: true,
      minLenght: 2,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be greater than 0"],
    },
    image: {
      type: String,
      required: false,
      minLenght: 10,
      trim: true,
      lowercase: true
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Type",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
