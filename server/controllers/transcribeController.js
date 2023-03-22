const revai = require("revai-node-sdk");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// REV AI Config
const ACCESS_TOKEN = process.env.REVAI_API_KEY;
const client = new revai.RevAiApiClient(ACCESS_TOKEN);

// Create a directory for storing the uploaded files
const uploadDirectory = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

// Set up the multer middleware to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const uploadAudio = multer({ storage: storage }).single("audioFile");

const transcribeAudio = async (req, res) => {
  uploadAudio(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Error uploading file" });
    }
    const { path: filePath } = req.file;
    const jobOptions = {
      metadata: "Testing for transcription",
      skip_diarization: false,
      skip_punctuation: false,
      language: "en",
      mediaFormat: "mp3",
      // test_mode: true,
    };

    let job;
    try {
      job = await client.submitJobLocalFile(filePath, jobOptions);

      console.log(`Job Id: ${job.id}`);
      console.log(`Status: ${job.status}`);
      console.log(`Created On: ${job.created_on}`);
    } catch (error) {
      console.error(error);
    }
    let jobDetails = await client.getJobDetails(job.id);
    console.log(`Job ${job.id} is ${jobDetails.status}`);

    // Checking: Poll job status
    while (jobDetails.status == revai.JobStatus.InProgress) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      jobDetails = await client.getJobDetails(job.id);
      console.log(`Job ${job.id} is ${jobDetails.status}`);
    }

    // Get transcription by object
    const transcriptObject = await client.getTranscriptObject(job.id);
    console.log(transcriptObject);
    res.json(transcriptObject);

    // Delete audio file after transcription
    fs.unlinkSync(filePath);
    console.log("Success! Transcription is complete!");
  });
};

module.exports = { transcribeAudio };
