import mongoose from "mongoose";

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
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
