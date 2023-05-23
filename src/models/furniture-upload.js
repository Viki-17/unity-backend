const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const furnitureUploadSchema = new mongoose.Schema({
  categoryname: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  model: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const FurnitureUpload = mongoose.model(
  "FurnitureUpload",
  furnitureUploadSchema
);

module.exports = FurnitureUpload;
