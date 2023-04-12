// Controllers
const {
  speechToTextController,
  textToSpeechController,
  trimAudioController,
  overdubController,
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
    .post(textToSpeechController);

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

  // For STT word audio delete
  app.route("/api/trimaudio").post(trimAudioController);

  // For STT word overdub
  app.route("/api/overdub").post(overdubController);
};

module.exports = routes;
