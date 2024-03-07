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
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const Place = require("./models/Places");
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

mongoose.connect(process.env.MONGO_URL);
//mongoose.set("strictQuery", true);
app.use(express.json());
app.get("/test", (req, res) => {
  res.json("test ok");
});
app.use(CookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

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
    //res.status(422).json(e);
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
            res.cookie("token", token).json(userDoc);
          }
        }
      );
    } else {
      res.status(422).json("password incorrect");
    }
    //res.json("found");
  } else {
    res.status(500).json("not found");
  }
});

app.get("/profile", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "uploads" + newName,
  });
  res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads/", ""));
  }
  res.json(req.files);
});
app.post("/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    });
    res.json(placeDoc);
  });
});

app.listen(4000);
