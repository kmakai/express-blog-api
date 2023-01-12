const express = require("express");
const router = express.Router();

// GET get all posts
router.get("/", (req, res) => {
  res.send("Get all posts");
});

// POST create a new post
router.post("/", (req, res) => {
  res.send("create a post");
});

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
