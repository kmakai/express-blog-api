const asyncHandler = require("express-async-handler");

// import post and user models
const Post = require("../models/Post");
const User = require("../models/User");

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ published: true }).sort({
    createdAt: "desc",
  });

  res.status(200).json(posts);
});

const createPost = asyncHandler(async (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    res.status(400);
    throw new Error("Posts need title and body text");
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("No user found please login or register");
  }

  if (!user.isAuthor) {
    res.status(401);
    throw new Error("User is not an author");
  }

  const post = await Post.create({
    title,
    text,
    author: req.user.id,
  });

  res.status(200).json({ post });
});

module.exports = {
  getAllPosts,
  createPost,
};
