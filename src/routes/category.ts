import express from "express";
import { Category } from "../models/Category";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(403).send();
});

router.get("/getCategories", async (_, res) => {
  const categories = await Category.find();
  res.status(200).send(categories);
});

router.post("/add", async (req, res) => {
  if (!req.body.name) {
    return res
      .status(200)
      .send({ result: "Нэрээ оруулна уу.", success: false });
  }
  if (!req.body.description) {
    return res
      .status(200)
      .send({ result: "Тайлбараа оруулна уу.", success: false });
  }

  const category = new Category({
    name: req.body.name,
    description: req.body.description,
  });

  await category.save();

  return res.status(200).send({
    result: category,
    message: "Амжилттай бүртгэгдлээ.",
  });
});

router.post("/delete", async (req, res) => {
  const categoryId = req.body.userId;
  if (!categoryId) {
    return res
      .status(200)
      .send({ result: "categoryId-г оруулна уу.", success: false });
  }
  await Category.findByIdAndDelete({ _id: categoryId });
  res.status(200).send({
    result: categoryId,
    success: true,
  });
});

module.exports = router;
