// controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// ✅ Signup (only admin should be created, or enforce role manually)
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // force admin role (since portal is only for admins)
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    return res.status(201).json({ message: "Admin created successfully", user });
  } catch (err) {
    console.error("❌ Error during signup:", err);
    return res.status(500).json({ message: "Failed to create admin" });
  }
};

// ✅ Login (only allow admin login)
exports.login = async (req, res) => {
   try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not registered. Please sign up first." });
    }

    // 2. Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password. Please try again." });
    }

    // 3. Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (err) {
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};

