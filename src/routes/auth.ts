import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", async (_, res) => {
  res.status(403).send();
});

router.post("/login", async (req, res) => {
  const message = "Нэвтрэх нэр эсвэл нууц үг буруу байна.";

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(200).send({ success: false, result: message });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(200).send({ success: false, result: message });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(200).send({ success: false, result: message });
  }

  if (!process.env.ACCESS_TOKEN_SECRET) {
    return res.status(200).send({ success: false, result: "Алдаа гарлаа" });
  }

  const accessToken = await jwt.sign(
    { username },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
  res.status(200).send({
    result: accessToken,
    success: true,
  });
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    return res
      .status(200)
      .send({ result: "Нэвтрэх нэрээ оруулна уу.", success: false });
  }
  if (!password) {
    return res
      .status(200)
      .send({ result: "Нууц үгээ оруулна уу.", success: false });
  }

  const existUser = await User.findOne({ username });
  if (existUser) {
    return res
      .status(200)
      .send({ result: "Бүртгэлтэй хэрэглэгч байна.", success: false });
  }

  const user = new User({
    username,
    password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  res.status(200).send({
    result: user,
    success: true,
  });
});

module.exports = router;
