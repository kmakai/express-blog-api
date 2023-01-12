const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// POST Register user
router.post("/", userController.registerUser);

// POST Login user
router.post("/login", userController.loginUser);

module.exports = router;
