const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const storeJson = require("../models/store-json");
const multer = require("multer");
const upload = multer();

router.post("/store", upload.array(), auth, async (req, res) => {
  const json = JSON.stringify(req.body.data);
  // console.log(json);
  const image = JSON.stringify(req.body.image);
  // console.log(image);
  // console.log(req.body.name);
  const data = new storeJson({
    owner: req.user._id,
    data: json,
    image: image,
    name: req.body.name,
  });
  try {
    await data.save();

    res.status(200).send(data);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/store", auth, async (req, res) => {
  try {
    const data = await storeJson.find({ owner: req.user._id });
    if (!data) {
      return res.status(400).send({ Error: "No such JSON file" });
    }
    res.send(data);
  } catch (e) {
    res.status(400).send();
  }
});
module.exports = router;
