const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Enter an email address, please."],
    unique: [true, "The same e-mail address is already registered."]
  },
  password: {
    type: String,
    required: [true, "Enter password, please."],
    unique: false,
  },
})

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);