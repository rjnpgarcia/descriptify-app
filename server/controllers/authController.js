const bcrypt = require("bcrypt");
const fs = require("fs");
// Schema Model
const User = require("../models/userModel");
// Validator
const { check, validationResult } = require("express-validator");

// Sanitize request
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
    return res.json({ error: "Invalid user data input" });
  }
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "Invalid Email or Password" });
    }

    // Compare Password
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.json({ error: "Invalid Email or Password" });
    }

    const token = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    // User is authenticated. Return user details
    res.json({ success: token });
  } catch (error) {
    res.json({ error: "Login failed. Server issue." });
  }
};

// Register new user
const registerController = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check for validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const invalidFields = [];
      errors.array().forEach((error) => {
        invalidFields.push(error.param);
      });
      const errorMessage = `Invalid input value for: ${invalidFields.join(
        ", "
      )}`;
      return res.json({ error: errorMessage });
    }
    // Check if user email exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ error: "Email already exists" });
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

    const token = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    res.json({ success: `User ${name} successfully registered!`, token });
  } catch (err) {
    console.error(err);
    res.json({ error: "Registration Failed. Server issue." });
  }
};

// Update existing user profile
const updateUserController = async (req, res) => {
  // Check for validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ error: "Invalid user data input" });
  }
  try {
    const { name, password } = req.body;
    const user = await User.findById(req.params.id);
    // User does not exists
    if (!user) {
      return res.json({ error: "User not found" });
    }

    //Update user data
    if (name) {
      user.name = name;
    }
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();

    const token = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    res.json({ success: "Profile successfully updated", user: token });
  } catch (error) {
    res.json({ error: "Update failed. Server issue" });
  }
};

// Delete user
const deleteUserController = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const userData = user.toJSON();

    // Delete user's files in uploads/saveFiles folder
    userData.sttFiles.forEach((file) => {
      const filePath = `uploads/saveFiles/${file.name}-stt-${userData._id}.mp3`;
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    userData.ttsFiles.forEach((file) => {
      const filePath = `uploads/saveFiles/${file.name}-tts-${userData._id}.mp3`;
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // Delete user from database
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: "success" });
  } catch {
    res.json({ error: "Delete user failed. Server issue" });
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
