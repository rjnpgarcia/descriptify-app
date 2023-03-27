const say = require("say");
const path = require("path");
// Controllers
const {
  speechToTextController,
} = require("../controllers/transcribeController");
const {
  loginController,
  registerController,
  updateUserController,
  deleteUserController,
  validationRegister,
  validationLogin,
  validationProfile,
} = require("../controllers/authController");

// Route end points
const routes = (app) => {
  // Speech-to-text endpoints
  app
    .route("/api/speechtotext")
    // Speech-to-text transcription through API
    .post(speechToTextController);

  // Text-to-Speech endpoints
  app
    .route("/api/texttospeech")
    // POST method TTS
    // .post(textToSpeechController);

    .post((req, res) => {
      try {
        const filePath = path.join(__dirname, "../uploads/tts.mp3");
        const text = req.body;
        console.log(text);
        // Voice is null to automatically set default voice as user's OS
        say.export(text, null, 1, filePath, (err) => {
          if (err) {
            return console.error(err);
          }
          res.set({
            "Content-Type": "audio/mpeg",
          });
          res.sendFile(filePath);
          console.log("Text Successfully transcribed!");
        });
        // .json({ success: "Transcription complete. Ready to play audio." });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Transcription failed. Server issue." });
      }
    });
  // User Login and Registration endpoints
  app
    .route("/api/login")
    // Login Endpoint
    .post(validationLogin, loginController);

  app
    .route("/api/register")
    // Register Endpoint
    .post(validationRegister, registerController);

  // For user profile
  app
    .route("/api/user/:id")
    // Update user profile
    .put(validationProfile, updateUserController)
    // Delete user
    .delete(deleteUserController);
};

module.exports = routes;
