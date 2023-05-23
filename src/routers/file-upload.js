const express = require("express");
const router = new express.Router();
const multer = require("multer");
const JSZip = require("jszip");
const fs = require("fs");
const fileUpload = require("../models/file-upload");
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
      // if (!file.originalname.match(/\.(glb|fbx|gltf|png|PNG|jpeg|jpg)$/)) {
      //   cb(undefined, false);
      //   // return cb(new Error("Please upload a glb or fbx"));
      // }
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

router.post("/files", auth, multiUploads, async (req, res) => {
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
  const filePath = new fileUpload({
    model,
    thumbnail,
    owner: req.user._id,
    ...req.body,
  });

  //formating the path to store in db
  const correctedModelPath = `http://localhost/${filePath.model
    .replace("\\", "/")
    .replace(/\.(glb|gltf|fbx|png|jpeg|jpg)$/, ".zip")}`;
  const correctedThumbnailPath = `http://localhost/${filePath.thumbnail.replace(
    "\\",
    "/"
  )}`;
  filePath.model = correctedModelPath;
  filePath.thumbnail = correctedThumbnailPath;

  try {
    //to convert the uploaded model into zip
    (async () => {
      const zip = new JSZip();

      const { originalname } = req.files.model?.[0];

      zip.file(`${originalname}`, fs.readFileSync(`files/${originalname}`));

      zip.generateAsync({ type: "nodebuffer" }).then((content) => {
        fs.writeFileSync(
          `files/${originalname.replace(
            /\.(glb|gltf|fbx|png|PNG|jpeg|jpg)$/,
            ".zip"
          )}`,
          content
        );
      });
    })();

    filePath.save();
    res.status(201).send({ message: "File Uploaded" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

//to get all the files from the db
router.get("/files", async (req, res) => {
  try {
    const file = await fileUpload.find();
    if (!file) {
      return res.status(400).send({ Error: "No such file" });
    }
    res.send(file);
  } catch (e) {
    res.status(400).send();
  }
});

router.get("/files/:name", auth, async (req, res) => {
  const name = req.params.name;

  try {
    const file = await fileUpload.findOne({ name, owner: req.user._id });
    if (!file) {
      return res.status(400).send({ Error: "No such file" });
    }
    res.send(file);
  } catch (e) {
    res.status(500).send();
  }
});

//to update or to make change to a particular model
router.patch("/files/:id", multiUploads, async (req, res) => {
  //to check if the file format is wrong

  try {
    //to convert the uploaded model into zip
    const file = await fileUpload.findOne({
      _id: req.params.id,
    });

    if (
      req.files.model?.[0].path === undefined ||
      req.files.thumbnail?.[0].path === undefined
    ) {
      res.status(400).send({ Error: "Please upload valid format" });
      return;
    }

    //formating the path to store in db
    const correctedModelPath = `http://localhost/${req.files.model?.[0].path
      .replace("\\", "/")
      .replace(/\.(glb|gltf|fbx|png|jpeg|jpg)$/, ".zip")}`;
    const correctedThumbnailPath = `http://localhost/${req.files.thumbnail?.[0].path.replace(
      "\\",
      "/"
    )}`;
    file.model = correctedModelPath;
    file.thumbnail = correctedThumbnailPath;

    file.save();
    res.status(201).send(file);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
