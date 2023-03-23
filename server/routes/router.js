const bcrypt = require("bcrypt");
// Schema Model
const User = require("../models/userModel");
// Controllers
const { transcribeAudio } = require("../controllers/transcribeController");

// Route end points
const routes = (app) => {
  // Speech-to-text endpoints
  app
    .route("/api/transcribestt")
    // GET method STT
    .get((req, res) => {
      res.send("Speech-to-text GET endpoint");
    })
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
    .route("/login")
    // Login Endpoint
    .post(async (req, res) => {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.send("Invalid Email");
      }

      // Compare Password
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        return res.send("Password Invalid");
      }

      res.send("User Successfully logged in");
    });

  app
    .route("/register")
    // Register Endpoint
    .post(async (req, res) => {
      const { name, email, password } = req.body;
      console.log(name, email, password);
      try {
        // Check if user email exists
        const userExists = await User.findOne({ email });
        if (userExists) {
          return res.status(409).json({ message: "Email already exists" });
        }

        // Hash Password
        // const saltRounds = 10;
        // const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
          name,
          email,
          password: hashedPassword,
        });

        await user.save();
        res.send("User Successfully Registered");
      } catch (err) {
        console.error(err);
        res.status(500).send("Registration failed");
      }
    });
};

module.exports = routes;

// POST method STT
// .post(upload.single("audioFile"), async (req, res) => {
//   const { path: filePath } = req.file;
//   const jobOptions = {
//     metadata: "Testing for transcription",
//     skip_diarization: false,
//     skip_punctuation: false,
//     language: "en",
//     mediaFormat: "mp3",
//     // test_mode: true,
//   };

//   let job;
//   try {
//     job = await client.submitJobLocalFile(filePath, jobOptions);

//     console.log(`Job Id: ${job.id}`);
//     console.log(`Status: ${job.status}`);
//     console.log(`Created On: ${job.created_on}`);
//   } catch (error) {
//     console.error(error);
//   }
//   let jobDetails = await client.getJobDetails(job.id);
//   console.log(`Job ${job.id} is ${jobDetails.status}`);

//   // Checking: Poll job status
//   while (jobDetails.status == revai.JobStatus.InProgress) {
//     await new Promise((resolve) => setTimeout(resolve, 5000));
//     jobDetails = await client.getJobDetails(job.id);
//     console.log(`Job ${job.id} is ${jobDetails.status}`);
//   }

//   // Get transcription by object
//   const transcriptObject = await client.getTranscriptObject(job.id);
//   console.log(transcriptObject);
//   res.json(transcriptObject);

//   // Delete audio file after transcription
//   fs.unlinkSync(filePath);
//   console.log("Success! Transcription is complete!");
// });
