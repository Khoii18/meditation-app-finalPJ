import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json("No token");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json("No token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(403).json("Invalid token");
  }
};

export const verifyAdmin = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const user = await User.findById(req.user.id);
      if (user && user.role === "admin") {
        next();
      } else {
        res.status(403).json("You are not allowed to do that!");
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  });
};

export const verifyAdminOrCoach = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const user = await User.findById(req.user.id);
      if (user && (user.role === "admin" || user.role === "coach")) {
        next();
      } else {
        res.status(403).json("Access denied. Admin or Coach required!");
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  });
};