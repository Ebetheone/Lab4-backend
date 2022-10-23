import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { connectToDB } from "./models";

dotenv.config();
const app = express();

const main = async () => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors());

  // parse application/json
  app.use(bodyParser.json());
  app.use("/auth", require("./routes/auth"));
  app.use("/user", require("./routes/user"));

  app.get("/", (req, res) => {
    res.send("we are on home");
  });
  await connectToDB();
  app.listen(4000);
};
main();
