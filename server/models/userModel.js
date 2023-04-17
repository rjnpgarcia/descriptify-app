const mongoose = require("mongoose");

const sttFileSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  transcript: {
    type: String,
  },
  audioFile: {
    type: String,
  },
});

const ttsFileSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  transcript: {
    type: String,
  },
  audioFile: {
    type: String,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  sttFiles: [sttFileSchema],
  ttsFiles: [ttsFileSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
