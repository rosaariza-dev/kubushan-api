import express from "express";
import { PORT } from "./config/env.js";
import connectToDatabase from "./database/mongodb.js";
import typeRouter from "./routes/type.routes.js";
import productRouter from "./routes/product.routes.js";
import imageRouter from "./routes/image.routes.js";

const app = express();

app.use(express.json());

app.use("/api/v1/types", typeRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/images", imageRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Kubushan API");
});

app.listen(PORT, async () => {
  console.log(`Kubushan API is running on port ${PORT}`);
  await connectToDatabase();
});

export default app;
