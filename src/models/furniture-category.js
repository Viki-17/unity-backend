const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const furnitureCategorySchema = new mongoose.Schema({
  categoryname: {
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

const FurnitureCategory = mongoose.model(
  "FurnitureCategory",
  furnitureCategorySchema
);

module.exports = FurnitureCategory;
