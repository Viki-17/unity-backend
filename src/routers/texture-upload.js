const express = require("express");
const router = new express.Router();
const multer = require("multer");

const textureUpload = require("../models/texture-upload");
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

const multiUploads = upload.fields([{ name: "thumbnail" }]);

router.post("/textures", auth, multiUploads, async (req, res) => {
  //to check if the file format is wrong
  if (req.files.thumbnail?.[0].path === undefined) {
    res.status(400).send({ Error: "Please upload valid format" });
    return;
  }
  // console.log(req.files.model);

  const thumbnail = req.files.thumbnail?.[0].path;
  const filePath = new textureUpload({
    thumbnail,
    owner: req.user._id,
    ...req.body,
  });

  //formating the path to store in db

  const correctedThumbnailPath = `http://localhost/${filePath.thumbnail.replace(
    "\\",
    "/"
  )}`;
  filePath.thumbnail = correctedThumbnailPath;

  try {
    filePath.save();
    res.status(201).send({ message: "File Uploaded" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

//to get all the files from the db
router.get("/textures", async (req, res) => {
  try {
    const file = await textureUpload.find();
    if (!file) {
      return res.status(400).send({ Error: "No such file" });
    }
    res.send(file);
  } catch (e) {
    res.status(400).send();
  }
});

router.get("/textures/:name", async (req, res) => {
  const name = req.params.name.toLowerCase();
  let find = "";
  console.log(name);

  if (name.includes("chair")) {
    find = "chair";
  }
  if (name.includes("sofa")) {
    find = "sofa";
  }
  if (name.includes("table")) {
    find = "table";
  }
  if (name.includes("cabinet")) {
    find = "cabinet";
  }
  if (name.includes("ceiling")) {
    find = "ceiling";
  }
  if (name.includes("floor")) {
    find = "floor";
  }
  if (name.includes("wall")) {
    find = "wall";
  }

  console.log(find);
  try {
    const file = await textureUpload.find({ categoryname: find });
    if (!file) {
      return res.status(400).send({ Error: "No such file" });
    }
    res.send(file);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
