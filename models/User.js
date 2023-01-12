const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, require: [true, "Please add a name"] },
  email: {
    type: String,
    require: [true, "Please add an email"],
    unique: true,
  },
  password: { type: String, required: [true, "Please add a password"] },
  isAuthor: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model("User", userSchema);
