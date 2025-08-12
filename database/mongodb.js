import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";
import logger from "../logger/index.js";

if (!DB_URI) {
  const message =
    "Please define the MONGODB URI enviroment variable inside .env.<development/production>.local";
  logger.error("Database configuration error:", { missingVariable: "DB_URI" });
  throw new Error(message);
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    logger.info("✅ Connected to database successfully", {
      environment: NODE_ENV,
    });
  } catch (error) {
    logger.error("❌ Error connecting to database ", error);
    process.exit(1);
  }
};

export default connectToDatabase;
