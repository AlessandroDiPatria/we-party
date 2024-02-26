const express = require("express");
const app = express();
const cors = require("cors");
const UserModel = require("./models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "fdfdfdfdf";
const CookieParser = require("cookie-parser");
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

mongoose.connect(process.env.MONGO_URL);
// mongoose.set("strictQuery", true);
app.use(express.json());
app.get("/test", (req, res) => {
  res.json("test ok");
});
app.use(CookieParser());

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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await UserModel.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id, name: userDoc.name },
        jwtSecret,
        {},
        (err, token) => {
          if (err) {
            throw err;
          } else {
            res.cookie("token", token).json("pass ok");
          }
        }
      );
      res.cookie("token", "").json("passok");
    } else {
      res.status(422).json("password incorrect");
    }
    res.json("found");
  } else {
    res.status(500).json("not found");
  }
});

app.get("/profileData", async (req, res) => {
  const { token } = req.cookie;
  res.json({ token });
  if (token) {
    // verify token through JWT
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const id = userData.id;
      const { name, email, _id } = await UserModel.findById({ id });
      res.json(name, email, _id);
    });
  } else {
    res.json(null);
  }
});

app.listen(4000);
