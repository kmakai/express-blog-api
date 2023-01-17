const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title to your blog post"],
    },
    text: {
      type: String,
      required: [true, "Please put some text for your blog post"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    published: { default: false, type: Boolean },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
