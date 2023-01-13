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
router.get("/:id", (req, res) => {
  res.send("Get a post");
});

// PUT update a post
router.put("/:id", (req, res) => {
  res.send("update a post");
});

// DELETE a post
router.delete("/:id", (req, res) => {
  res.send("DELETE a post");
});

module.exports = router;
