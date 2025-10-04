import express from "express";
import { PORT, NODE_ENV, CLIENT_URL } from "./config/env.js";
import connectToDatabase from "./database/mongodb.js";
import typeRouter from "./routes/type.routes.js";
import productRouter from "./routes/product.routes.js";
import imageRouter from "./routes/image.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import httpContext from "express-http-context";
import "./config/cloudinary.js";
import correlationMiddleware from "./middlewares/correlation.middleware.js";
import requestLogger from "./middlewares/request-logger.middleware.js";
import logger from "./logger/index.js";
import emailRouter from "./routes/email.routes.js";
import cors from "cors";

const app = express();

app.use(httpContext.middleware);
// Correlation ID
app.use(correlationMiddleware);

app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET"],
  })
);

app.use(express.json());

// Request logging
app.use(requestLogger);

// Routes
app.use("/api/v1/types", typeRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/images", imageRouter);
app.use("/api/v1/email", emailRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Welcome to the Kubushan API");
});

app.listen(PORT, async () => {
  logger.info("🚀 Server started - Kubushan API", {
    port: PORT,
    environment: NODE_ENV || "development",
  });
  await connectToDatabase();
});

export default app;
