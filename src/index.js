const express = require("express");
const bodyParser = require("body-parser");

require("./db/mongoose");
//============================================================
const furnitureCategory = require("./routers/furniture-category");
const furnitureUpload = require("./routers/furniture-upload");
const textureUpload = require("./routers/texture-upload");
const fileUpload = require("./routers/file-upload");
const toStoreJson = require("./routers/to-store-json");
const user = require("./routers/user");
const app = express();
const cors = require("cors");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//============================================================
app.set("view engine", "ejs");
app.use(cors());
app.get("/", (req, res) => {
  res.render("index");
});

//============================================================

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(furnitureCategory);
app.use(fileUpload);
app.use(furnitureUpload);
app.use(textureUpload);
app.use(user);
app.use(toStoreJson);

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
