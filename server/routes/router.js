// Controllers
const {
  speechToTextController,
  textToSpeechController,
  trimAudioController,
  overdubController,
  textToSpeechDataController,
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
const {
  deleteFileController,
  saveFileController,
  validationFileName,
  getFilesController,
  getOneFileController,
  getAudioController,
  downloadDocsController,
} = require("../controllers/fileController");
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

  // Text-to-speech data retriever
  app.route("/api/texttospeechdata").post(textToSpeechDataController);

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

  // For files
  app
    .route("/api/files/:id")
    .get(getFilesController)
    .post(validationFileName, saveFileController);

  // For user files
  app
    .route("/api/files/:id/:type/:fileName")
    .get(getOneFileController)
    .delete(deleteFileController);

  // Get audio
  app.route("/api/getaudio/:id/:type/:audio").get(getAudioController);

  // Get documentation
  app.route("/api/downloaddocs").get(downloadDocsController);
};

module.exports = routes;
