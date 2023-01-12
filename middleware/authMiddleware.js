const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

// User Model import
const User = require("../models/User");

const protected = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers; // deconstruct authorization from request.

  let token;

  if (authorization && authorization.startsWith(Bearer)) {
    try {
      // get token from authoriztion header
      token = authorization.split(" ")[1];

      // Verify the token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // get user with token.
      req.user = await User.findById(decodedToken.id).select("-password");

      // pass to protected middleware
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  // refuse access if no token
  if (!token) {
    res.status(401);
    throw new Error("Not authorized");
  }
});

module.exports = { protected };
