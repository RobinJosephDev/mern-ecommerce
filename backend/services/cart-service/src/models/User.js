const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  cartData: {
    type: Map,
    of: Number,
    default: {},
  },
});

module.exports = mongoose.model("User", UserSchema);
