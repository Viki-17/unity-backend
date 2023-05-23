const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const storeJsonSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    data: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const StoreJson = mongoose.model("StoreJson", storeJsonSchema);

module.exports = StoreJson;
