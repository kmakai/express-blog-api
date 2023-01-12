const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { generateToken } = require("./helpers");

// Import User model and Author model
const User = require("../models/User");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please include all fields");
  }

  // Check if user exists;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create the new user in db
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // return user with token if created succesfully
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const user = await User.findOne({ email });
  const validPassword = await bcrypt.compare(password, user.password);

  if (user && validPassword) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

module.exports = {
  registerUser,
  loginUser,
};
