const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const fileUploadSchema = new mongoose.Schema({
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

const FileUpload = mongoose.model("FileUpload", fileUploadSchema);

module.exports = FileUpload;
