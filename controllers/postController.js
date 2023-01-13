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

const getSinglePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    res.status(404);
    throw new Error("post not found");
  }

  const user = await User.findById(req.user.id);

  if (!post.published && !user.isAuthor) {
    res.status(401);
    throw new Error("You cannot see this post");
  }

  res.status(200).json(post);
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

  res.status(200).json(post);
});

const updatePost = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("No user found please login to update");
  }

  const post = await Post.findById(req.params.postId);

  if (!post) {
    res.status(404);
    throw new Error("post not found");
  }

  if (!user.isAuthor) {
    res.status(401);
    throw new Error("User is not an author");
  }

  if (post.author.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.postId,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedPost);
});

const deletePost = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("No user found please login to delete");
  }

  const post = await Post.findById(req.params.postId);

  if (!post) {
    res.status(404);
    throw new Error("post not found");
  }

  if (!user.isAuthor) {
    res.status(401);
    throw new Error("User is not an author");
  }

  if (post.author.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await post.remove();

  res.status(200).json({
    success: true,
  });
});

module.exports = {
  getAllPosts,
  createPost,
  getSinglePost,
  updatePost,
  deletePost,
};
