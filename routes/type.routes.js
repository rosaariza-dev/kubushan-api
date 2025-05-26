import { Router } from "express";

const typeRouter = Router();

typeRouter.get("/", (req, res) => {
  res.send({ message: "GET all types" });
});

typeRouter.get("/:id", (req, res) => {
  res.send({ message: "GET type" });
});

typeRouter.get("/:id/products", (req, res) => {
  res.send({ message: "GET products for type" });
});

typeRouter.post("/", (req, res) => {
  res.send({ message: "CREATE new type" });
});

typeRouter.put("/:id", (req, res) => {
  res.send({ message: "UPDATE type" });
});

typeRouter.delete("/:id", (req, res) => {
  res.send({ message: "DELETE type" });
});

export default typeRouter;
