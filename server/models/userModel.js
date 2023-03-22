const mongoose = require("mongoose");

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
});

const User = mongoose.model("User", userSchema);

module.exports = User;

// **** In case we need to save file **** //
//   savedJobs: {
//     speechToText: [
//       {
//         jobName: { type: String, required: true },
//         jobId: {
//           type: String,
//           required: true,
//         },
//         createdOn: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//     textToSpeech: [
//       {
//         jobName: {
//           type: String,
//           required: true,
//         },
//         jobId: {
//           type: String,
//           required: true,
//         },
//         createdOn: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//   },
