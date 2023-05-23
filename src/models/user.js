const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});
//jwt token key
const jwtKey =
  "e3654f52043bd41c968790de6fa80f1c1097bbe9c780ced41d4c09baeb860b9bfd71c4235a1e4299e4f2ba375596415fe02db8bb162251a0bd2c3c003f7200b2";

//to make virtual connection between fileupload and user
userSchema.virtual("file-upload", {
  ref: "FileUpload",
  localField: "_id",
  foreignField: "owner",
});
//to make virtual connection between store-json and user
userSchema.virtual("store-json", {
  ref: "StoreJson",
  localField: "_id",
  foreignField: "owner",
});
//to control whats being sent along with user data
userSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

//to generate token for user
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, jwtKey);

  user.tokens = user.tokens.concat({ token });

  await user.save();

  return token;
};

//to find the user stored on db
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }
  const pass = await User.findOne({ password });

  if (!pass) {
    throw new Error("Unable to login");
  }
  return user;
};

//to check whether the user already exists on db
userSchema.statics.checkUserExist = async (email) => {
  const user = await User.findOne({ email });

  if (user) {
    throw new Error("User already exist");
  }

  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
