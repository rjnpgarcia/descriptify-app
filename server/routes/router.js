// Controllers
const { transcribeAudio } = require("../controllers/transcribeController");
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
    .route("/api/transcribestt")
    // Speech-to-text transcription through API
    .post(transcribeAudio);

  // Text-to-Speech endpoints
  app
    .route("/api/transcribetts")
    // GET method TTS
    .get((req, res) => {
      res.send("Text-to-speech GET endpoint");
    })
    // POST method TTS
    .post((req, res) => {
      res.send("Text-to-speech POST endpoint");
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
