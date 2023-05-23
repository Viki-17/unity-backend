const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const textureUploadSchema = new mongoose.Schema({
  categoryname: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  thumbnail: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const TextureUpload = mongoose.model("TextureUpload", textureUploadSchema);

module.exports = TextureUpload;
