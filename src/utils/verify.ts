import { NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: any, res: any, next: NextFunction) => {
  if (!req.headers.authorization) {
    res.status(200).send({
      success: false,
      result: "Та нэвтрээгүй байна.",
    });
  }
  const token = req.headers.authorization.toString().split(" ")[1];

  if (!process.env.ACCESS_TOKEN_SECRET) {
    res.status(200).send({ success: false, result: "Алдаа гарлаа" });
    return;
  }

  if (!token) {
    res.status(200).send({
      success: false,
      result: "Та нэвтрээгүй байна.",
    });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(200).send({
      success: false,
      result: err,
    });
  }
};
