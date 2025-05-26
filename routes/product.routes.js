import { Router } from "express";

const productRouter = Router();

productRouter.get("/", (req, res) => {
  res.send({ message: "GET all products" });
});

productRouter.get("/:id", (req, res) => {
  res.send({ message: "GET product" });
});

productRouter.post("/", (req, res) => {
  res.send({ message: "CREATE new product" });
});

productRouter.put("/:id", (req, res) => {
  res.send({ message: "UPDATE product" });
});

productRouter.delete("/:id", (req, res) => {
  res.send({ message: "DELETE product" });
});

export default productRouter;


