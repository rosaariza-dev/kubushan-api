import express from "express";
import { PORT } from "./config/env.js";
import connectToDatabase from "./database/mongodb.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the Kubushan API");
});

app.listen(PORT, async () => {
  console.log(`Kubushan API is running on port ${PORT}`);
  await connectToDatabase();
});

export default app;
