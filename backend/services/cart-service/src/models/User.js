const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  cartData: { type: Object, default: {} },
});

module.exports = mongoose.model("User", UserSchema);
