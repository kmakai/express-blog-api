const express = require("express");
const router = express.Router();

// import auth middleware
const { protected } = require("../middleware/authMiddleware");

// Import post controllers
const postController = require("../controllers/postController");

// GET get all posts
router.get("/", postController.getAllPosts);

// POST create a new post
router.post("/", protected, postController.createPost);

// GET a single post
router.get("/:postId", protected, postController.getSinglePost);

// PUT update a post
router.put("/:postId", protected, postController.updatePost);

// DELETE a post
router.delete("/:postId", protected, postController.deletePost);

module.exports = router;
