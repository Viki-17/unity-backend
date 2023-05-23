const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  const jwtKey =
    "e3654f52043bd41c968790de6fa80f1c1097bbe9c780ced41d4c09baeb860b9bfd71c4235a1e4299e4f2ba375596415fe02db8bb162251a0bd2c3c003f7200b2";
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, jwtKey);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Unauthorized entry" });
  }
};

module.exports = auth;
