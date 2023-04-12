// Speech-to-Text API
const revai = require("revai-node-sdk");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
const { spawn } = require("child_process");
// Text-to-Speech API
const say = require("say");
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

// Speech-to-Text Controller
const speechToTextController = async (req, res) => {
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
    };

    let job;
    try {
      // REV AI API Local file Handler
      job = await client.submitJobLocalFile(filePath, jobOptions);

      console.log(`Job Id: ${job.id}`);
      console.log(`Status: ${job.status}`);
      console.log(`Created On: ${job.created_on}`);

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
      // Get words with timestamps
      // const wordsWithTimestamps = transcriptObject.monologues[0].elements.map(
      //   (element) => {
      //     return {
      //       word: element.value,
      //       startTime: element.ts,
      //       endTime: element.end_ts,
      //     };
      //   }
      // );
      const wordsWithTimestamps = transcriptObject.monologues.flatMap(
        (monologue) => {
          return monologue.elements.map((element) => {
            return {
              word: element.value,
              startTime: element.ts,
              endTime: element.end_ts,
            };
          });
        }
      );
      res.json(wordsWithTimestamps);

      // Delete audio file after transcription
      fs.unlinkSync(filePath);
      console.log("Success! Transcription is complete!");
    } catch (error) {
      if (filePath) {
        fs.unlinkSync(filePath);
      }
      console.error(error);
      res.status(500).json({ error: "Transcription failed. Server issue." });
    }
  });
};

// Text-to-speech controller
const textToSpeechController = (req, res) => {
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
  } catch (error) {
    console.log(error);
  }
};

///// Trim audio controller for STT
// Audio trimmer function
const trimAudio = (inputFilePath, startTime, endTime, outputFile) => {
  return new Promise((resolve, reject) => {
    // Create a command line to trim the audio and output to temporary file
    console.log(inputFilePath);
    const ffmpegCommand = ffmpeg(inputFilePath)
      .audioFilter(
        `aselect='not(between(t,${startTime},${
          endTime !== null ? endTime : ""
        }))',asetpts=N/SR/TB`
      )
      .output(outputFile)
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        reject(new Error(`ffmpeg error: ${err.message}`));
      });

    const ffmpegProcess = spawn(ffmpegPath, ffmpegCommand._getArguments());

    ffmpegProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`ffmpeg exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
};

const trimAudioController = async (req, res) => {
  uploadAudio(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Error uploading file" });
    }
    const { path: filePath } = req.file;
    // const { startTime, endTime } = req.query;
    const startTime = parseFloat(req.body.startTime);
    const endTime = parseFloat(req.body.endTime);
    console.log(startTime, endTime);
    // Trim audio file using startTime and endTime values
    try {
      const outputFile = path.join(
        __dirname,
        `../uploads/temp/removed_${Date.now()}.mp3`
      );
      await trimAudio(filePath, startTime, endTime, outputFile);

      res.set({
        "Content-Type": "audio/mpeg",
      });
      res.sendFile(outputFile, () => {
        fs.unlink(filePath, (err) => {
          if (err)
            console.log(`Error deleting temporary file ${filePath}: ${err}`);
        });
        fs.unlink(outputFile, (err) => {
          if (err)
            console.log(`Error deleting temporary file ${filePath}: ${err}`);
        });
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Error trimming audio file" });
    }
  });
};

///// Trim audio controller for overdub
// Text-to-speech function
const textToSpeech = async (text, outputFilePath) => {
  return new Promise((resolve, reject) => {
    say.export(text, null, 1, outputFilePath, (err) => {
      if (err) {
        reject(new Error(`Error exporting TTS audio ${err.message}`));
      } else {
        resolve();
      }
    });
  });
};

// Get duration of audio
const getAudioDuration = async (filePath) => {
  return new Promise((resolve, reject) => {
    const ffprobeProcess = spawn(ffprobePath, [
      "-i",
      filePath,
      "-show_entries",
      "format=duration",
      "-v",
      "quiet",
      "-of",
      "csv=p=0",
    ]);

    let duration = "";

    ffprobeProcess.stdout.on("data", (data) => {
      duration += data.toString();
    });

    ffprobeProcess.stderr.on("data", (data) => {
      console.error(data.toString());
      reject(new Error("Error getting audio duration"));
    });

    ffprobeProcess.on("close", (code) => {
      if (code === 0) {
        duration = duration.trim();
        resolve(parseFloat(duration));
      } else {
        reject(new Error(`ffprobe exited with code ${code}`));
      }
    });
  });
};

// Overdub Controller
const overdubController = async (req, res) => {
  uploadAudio(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Error uploading file" });
    }
    try {
      const { path: filePath } = req.file;
      const startTime = parseFloat(req.body.startTime);
      const endTime = parseFloat(req.body.endTime);
      const overdubWord = req.body.overdubWord;

      // Trim the audio file to remove the part containing the word that will be replaced
      const trimmedFilePath = path.join(
        __dirname,
        "../uploads/temp/trimmed.mp3"
      );
      await trimAudio(filePath, startTime, endTime, trimmedFilePath);

      // Convert the overdub word to an audio file using the TTS
      const ttsFilePath = path.join(__dirname, "../uploads/temp/tts-temp.mp3");

      await textToSpeech(overdubWord, ttsFilePath);
      // Split the trimmed audio file into two parts
      const part1FilePath = path.join(__dirname, "../uploads/temp/part1.mp3");
      const part2FilePath = path.join(__dirname, "../uploads/temp/part2.mp3");
      const part1Duration = startTime;
      await trimAudio(trimmedFilePath, 0, part1Duration, part2FilePath);
      console.log(part1Duration);

      const part2Duration = await getAudioDuration(trimmedFilePath).then(
        (duration) => duration - endTime
      );
      console.log(part2Duration);
      await trimAudio(
        trimmedFilePath,
        startTime,
        startTime + part2Duration,
        part1FilePath
      );
      // await Promise.all([
      // ]);
      // await trimAudio(trimmedFilePath, 0, part1Duration, part1FilePath);
      // await trimAudio(
      //   trimmedFilePath,
      //   endTime,
      //   endTime + part2Duration,
      //   part2FilePath
      // );

      // Merge the audio files
      const outputFilePath = path.join(__dirname, "../uploads/temp/output.mp3");

      await new Promise((resolve, reject) => {
        const concatProcess = spawn(ffmpegPath, [
          "-i",
          part1FilePath,
          "-i",
          ttsFilePath,
          "-i",
          part2FilePath,
          "-filter_complex",
          "[0:a][1:a][2:a]concat=n=3:v=0:a=1[out]",
          "-map",
          "[out]",
          "-ac",
          "2",
          "-ar",
          "44100",
          "-b:a",
          "192k",
          "-y",
          outputFilePath,
        ]);
        concatProcess.on("error", (err) => {
          reject(err);
        });

        concatProcess.on("exit", (code) => {
          if (code === 0) {
            // Send the concatenated audio file to the frontend
            res.set({
              "Content-Type": "audio/mpeg",
            });
            res.sendFile(outputFilePath);
            resolve();
          } else {
            reject(new Error(`ffmpeg exited with code ${code}`));
          }
        });
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(`Error overdubbing audio`);
    }
  });
};

module.exports = {
  speechToTextController,
  textToSpeechController,
  trimAudioController,
  overdubController,
};
