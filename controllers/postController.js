const asyncHandler = require("express-async-handler");

// import post, comment and user models
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ published: true })
    .populate("author", "name")
    .sort({
      createdAt: "asc",
    });

  res.status(200).json(posts);
});

const getAuthorPosts = asyncHandler(async (req, res) => {
  if (!req.user.isAuthor) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  const posts = await Post.find({ author: req.user.id }).sort({
    createdAt: "desc",
  });

  res.status(200).json(posts);
});

const getSinglePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId).populate(
    "author",
    "name"
  );

  if (!post) {
    res.status(404);
    throw new Error("post not found");
  }

  if (!post.published) {
    const user = await User.findById(req.user.id);

    if (!user || !user.isAuthor) {
      res.status(401);
      throw new Error("You cannot see this post");
    }
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

/* CONTROLLERS FOR COMMENTS */

const getPostComments = asyncHandler(async (req, res) => {
  // check if post exists
  const post = await Post.findById(req.params.postId);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  //get comments
  const comments = await Comment.find({ post: req.params.postId })
    .populate("user", "name")
    .sort({
      createdAt: "asc",
    });

  res.status(200).json(comments);
});

const createPostComment = asyncHandler(async (req, res) => {
  const { user } = req;
  if (!user) {
    res.status(401);
    throw new Error("No user found please login or register");
  }

  // check if post exists
  const post = await Post.findById(req.params.postId);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  // check text
  const { text } = req.body;

  if (!text) {
    res.status(400);
    throw new Error("body text is required for comment");
  }

  const comment = await Comment.create({
    user: user.id,
    post: post._id,
    text,
  });

  res.status(200).json(comment);
});

const getSinglePostComment = asyncHandler(async (req, res) => {
  // check if post exists
  const post = await Post.findById(req.params.postId);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const comment = await Comment.findById(req.params.commentId);

  res.status(200).json(comment);
});

const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  // check text
  const { text } = req.body;

  if (!text) {
    res.status(400);
    throw new Error("body text is required for comment");
  }

  if (comment.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedComment);
});

const deletComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  // check text
  const { text } = req.body;

  if (!text) {
    res.status(400);
    throw new Error("body text is required for comment");
  }

  if (comment.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await comment.remove();

  res.status(200).json({
    success: true,
  });
});

module.exports = {
  getAllPosts,
  getAuthorPosts,
  createPost,
  getSinglePost,
  updatePost,
  deletePost,
  getPostComments,
  createPostComment,
  getSinglePostComment,
  updateComment,
  deletComment,
};
