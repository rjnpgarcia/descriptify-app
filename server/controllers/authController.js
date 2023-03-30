const bcrypt = require("bcrypt");
// Schema Model
const User = require("../models/userModel");
// Validator
const { check, validationResult } = require("express-validator");

const validationRegister = [
  check("name").trim().isLength({ min: 4 }).escape(),
  check("email").trim().isEmail().normalizeEmail(),
  check("password").isLength({ min: 4 }).escape(),
];

const validationLogin = [
  check("email").trim().isEmail().normalizeEmail(),
  check("password").escape(),
];

const validationProfile = [
  check("name").trim().escape(),
  check("password").escape(),
];

// Login user
const loginController = async (req, res) => {
  const { email, password } = req.body;

  // Check for validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ error: "Invalid user data input" });
  }
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }

    // Compare Password
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }

    const token = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    // User is authenticated. Return user details
    res.status(200).json({ success: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed. Server issue." });
  }
};

// Register new user
const registerController = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  try {
    // Check for validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ error: "Invalid user data input" });
    }
    // Check if user email exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Hash Password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(200).json({ success: `User ${name} successfully registered!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration Failed. Server issue." });
  }
};

// Update existing user profile
const updateUserController = async (req, res) => {
  // Check for validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ error: "Invalid user data input" });
  }
  try {
    const { name, password } = req.body;
    const user = await User.findById(req.params.id);
    // User does not exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //Update user data
    if (name) {
      user.name = name;
    }
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    console.log(user);

    const token = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    res
      .status(200)
      .json({ success: "Profile successfully updated", user: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Update failed. Server issue" });
  }
};

// Delete user
const deleteUserController = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    console.log(`${req.params.id} user successfully deleted`);
    res.status(200).json({ success: "success" });
  } catch {
    res.status(500).json({ error: "Delete user failed. Server issue" });
  }
};

module.exports = {
  loginController,
  registerController,
  updateUserController,
  deleteUserController,
  validationRegister,
  validationLogin,
  validationProfile,
};