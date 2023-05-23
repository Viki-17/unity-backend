const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const upload = multer();

//to signup
router.post("/users", upload.array(), async (req, res) => {
  //   console.log(req);
  console.log(req.body);
  console.log({ ...req.body });
  const user = new User(req.body);

  try {
    await user.save();
    // const token = await user.generateAuthToken();
    res.status(201).send({ user });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//to login
router.post("/users/login", upload.array(), async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//to logout from single device
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send({ success: "User Logged out" });
  } catch (e) {
    res.status(500).send();
  }
});

//to logout from all devices
router.post("/users/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send({ success: "User logged out from all devices" });
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
