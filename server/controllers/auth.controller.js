import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json("Missing required fields");
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json("Email already exists");
    }

    const hash = await bcrypt.hash(password, 10);

    const allowedRoles = ["user", "coach"];
    const userRole = allowedRoles.includes(role) ? role : "user";
    console.log(`[REGISTER] name=${name}, email=${email}, role received="${role}", role saved="${userRole}"`);

    const user = await User.create({
      email,
      password: hash,
      name,
      role: userRole
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json(userObj);

  } catch (err) {
    res.status(500).json(err.message);
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("Missing email or password");
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Wrong password");

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const userObj = user.toObject();
    delete userObj.password;

    res.json({ token, user: userObj });

  } catch (err) {
    res.status(500).json(err.message);
  }
};