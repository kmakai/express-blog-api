const express = require("express");
const router = express.Router();

// import auth middleware
const { protected } = require("../middleware/authMiddleware");

// Import post controllers
const postController = require("../controllers/postController");

// GET get all posts
router.get("/", postController.getAllPosts);

// GET All AUTHOR POSTS
router.get("/author", protected, postController.getAuthorPosts);

// POST create a new post
router.post("/", protected, postController.createPost);

// GET a single post
router.get("/:postId", postController.getSinglePost);

// PUT update a post
router.put("/:postId", protected, postController.updatePost);

// DELETE a post
router.delete("/:postId", protected, postController.deletePost);

/*  ROUTES FOR COMMENTS  */

// GET all comments for a post;
router.get("/:postId/comments", postController.getPostComments);

// POST a comment on a post
router.post("/:postId/comments", protected, postController.createPostComment);

// GET a single comment on a post
router.get(
  "/:postId/comments/:commentId",
  protected,
  postController.getSinglePostComment
);

// PUT update a single comment on a post
router.put(
  "/:postId/comments/:commentId",
  protected,
  postController.updateComment
);

// DELETE a single comment on a post
router.delete(
  "/:postId/comments/:commentId",
  protected,
  postController.deletComment
);

module.exports = router;
