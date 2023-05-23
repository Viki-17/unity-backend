const express = require("express");
const router = new express.Router();
const multer = require("multer");

const furnitureUpload = require("../models/furniture-upload");
const auth = require("../middleware/auth");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//to limit the type of file and if needed have to constrain the size
const upload = multer({
  // dest: "files",
  fileFilter(req, file, cb) {
    try {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "model/gltf-binary" ||
        file.mimetype == "application/octet-stream" ||
        file.mimetype == "image/jpeg"
      ) {
        cb(undefined, true);
      } else {
        cb(undefined, false);
      }
    } catch (e) {
      console.error(e);
    }
  },
  storage: storage,
});

const multiUploads = upload.fields([{ name: "model" }, { name: "thumbnail" }]);

router.post("/furniture", auth, multiUploads, async (req, res) => {
  //to check if the file format is wrong
  if (
    req.files.model?.[0].path === undefined ||
    req.files.thumbnail?.[0].path === undefined
  ) {
    res.status(400).send({ Error: "Please upload valid format" });
    return;
  }
  // console.log(req.files.model);
  const model = req.files.model?.[0].path;

  const thumbnail = req.files.thumbnail?.[0].path;
  const filePath = new furnitureUpload({
    model,
    thumbnail,
    owner: req.user._id,
    ...req.body,
  });

  //formating the path to store in db
  const correctedModelPath = `http://localhost/${filePath.model.replace(
    "\\",
    "/"
  )}`;
  const correctedThumbnailPath = `http://localhost/${filePath.thumbnail.replace(
    "\\",
    "/"
  )}`;
  filePath.model = correctedModelPath;
  filePath.thumbnail = correctedThumbnailPath;

  try {
    //to convert the uploaded model into zip

    filePath.save();
    res.status(201).send({ message: "File Uploaded" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

//to get all the types of furniture files from the db
router.get("/furniture/types", async (req, res) => {
  try {
    const file = await furnitureUpload.find();

    // console.log(file.name);
    if (!file) {
      return res.status(400).send({ Error: "No such file" });
    }
    const types = file.map((item) => {
      return item.categoryname;
    });
    res.send(file);
  } catch (e) {
    res.status(400).send();
  }
});

//to get the furniture by category
router.get("/furniture/:categoryname", async (req, res) => {
  const categoryName = req.params.categoryname;
  try {
    const file = await furnitureUpload.find({ categoryname: categoryName });
    if (!file) {
      return res.status(400).send({ Error: "No such file" });
    }
    res.send(file);
  } catch (e) {
    res.status(500).send();
  }
});

//to update or to make change to a particular model
router.patch("/furniture/:id", multiUploads, async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ["categoryname", "name", "thumbnail", "model"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(404).send({ error: "Invalid Update" });
  }
  try {
    const file = await furnitureUpload.findOne({
      _id: req.params.id,
    });
    if (!file) {
      return res.status(404).send();
    }
    updates.forEach((update) => (file[update] = req.body[update]));

    await file.save();
    res.send(file);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
