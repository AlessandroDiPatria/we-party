const express = require("express");
const app = express();
const cors = require("cors");
const UserModel = require("./models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();
const bcryptSalt = bcrypt.genSaltSync(10);

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

mongoose.connect(process.env.MONGO_URL);
// mongoose.set("strictQuery", true);
app.use(express.json());
app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  res.json({ name, email, password });
  try {
    const user = await UserModel.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json({ user });
  } catch (e) {
    res.status(422).json(e);
  }
});

app.listen(4000);
