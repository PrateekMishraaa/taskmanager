import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/auth/UserModel.js"; // Import the User model

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Get the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

      req.user = await User.findById(decoded.id).select("-password"); // Attach user to request

      if (!req.user) {
        return res.status(401).json({ message: "User not found!" });
      }

      next(); // Proceed to next middleware
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed!" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, please login!" });
  }
});
