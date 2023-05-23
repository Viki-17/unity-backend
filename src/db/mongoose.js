const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/configurator-api", {
  useNewUrlParser: true,
});
// mongoose.connect(
//   "mongodb+srv://arumugamsathish25:sathish0108@configurator.fjrhz9m.mongodb.net/test",
//   {
//     useNewUrlParser: true,
//   }
// );
// mongoose.set("strictQuery", true);
