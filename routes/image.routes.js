import { Router } from "express";

const imageRouter = Router();

imageRouter.get("/", (req, res) => {
  res.send({ message: "GET all images" });
});

imageRouter.get("/:id", (req, res) => {
  res.send({ message: "GET image" });
});

imageRouter.post("/upload", (req, res) => {
  res.send({ message: "UPLOAD image" });
});

imageRouter.delete("/:id", (req, res) => {
  res.send({ message: "DELETE image" });
});

export default imageRouter;