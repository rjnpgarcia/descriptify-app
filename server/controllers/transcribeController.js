const revai = require("revai-node-sdk");
const AWS = require("aws-sdk");
const { spawn } = require("child_process");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const stream = require("stream");
require("dotenv").config();

const SERVER_PATH = process.env.SERVER_PATH;

// REV AI Config
const ACCESS_TOKEN = process.env.REVAI_API_KEY;
const client = new revai.RevAiApiClient(ACCESS_TOKEN);

// AWS Config
const polly = new AWS.Polly({
  region: "ap-southeast-1",
});

// Create a directory for storing the uploaded files
const uploadDirectory = path.join(SERVER_PATH, "uploads");
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
      return res.json({ error: "Error uploading file" });
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
      let jobDetails = await client.getJobDetails(job.id);
      // Checking: Poll job status
      while (jobDetails.status == revai.JobStatus.InProgress) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        jobDetails = await client.getJobDetails(job.id);
      }
      // Get transcription by object
      const transcriptObject = await client.getTranscriptObject(job.id);
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
      res.json({ success: wordsWithTimestamps });
      // Delete audio file after transcription
      fs.unlinkSync(filePath);
    } catch (error) {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      console.error(error);
      if (error.details.status == 409) {
        return res.json({
          error: "Audio insufficient length to transcribe. Please try again.",
        });
      } else {
        return res.json({
          error: "Transcription Failed. Network issue. Please try again.",
        });
      }
    }
  });
};

// Text-to-speech controller
const textToSpeechController = async (req, res) => {
  try {
    const filePath = path.join(SERVER_PATH, "uploads/temp/tts.mp3");
    const text = req.body;
    // Voice is null to automatically set default voice as user's OS
    // Using AWS Polly
    const paramsAWS = {
      Text: text,
      OutputFormat: "mp3",
      VoiceId: "Joey",
    };

    // Synthesize speech with Polly
    const { AudioStream } = await polly.synthesizeSpeech(paramsAWS).promise();

    // Save audio file to path
    const audioReadableStream = stream.Readable.from(AudioStream);
    const fileStream = fs.createWriteStream(filePath);
    audioReadableStream.pipe(fileStream);
    fileStream.on("close", () => {
      res.set({
        "Content-Type": "audio/mpeg",
      });
      res.sendFile(filePath, () => {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting temporary file ${filePath}: ${err}`);
          }
        });
      });
    });
  } catch (error) {
    console.error(error);
  }
};

///// Trim audio controller for STT
// Audio trimmer function
const trimAudio = (inputFilePath, startTime, endTime, outputFile) => {
  return new Promise((resolve, reject) => {
    // Create a command line to trim the audio and output to temporary file
    const ffmpegCommand = `ffmpeg -i ${inputFilePath} -af "aselect='not(between(t,${startTime},${
      endTime !== null ? endTime : ""
    }))',asetpts=N/SR/TB" ${outputFile}`;
    const ffmpegProcess = spawn(ffmpegCommand, { shell: true });
    ffmpegProcess.on("error", (error) => {
      console.error(`Error starting ffmpeg: ${error.message}`);
      reject(error);
    });

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
    const outputFile = path.join(
      SERVER_PATH,
      `uploads/temp/removed_${Date.now()}.mp3`
    );
    // Trim audio file using startTime and endTime values
    try {
      await trimAudio(filePath, startTime, endTime, outputFile);

      res.set({
        "Content-Type": "audio/mpeg",
      });
      res.sendFile(outputFile, () => {
        fs.unlink(filePath, (err) => {
          if (err)
            console.error(`Error deleting temporary file ${filePath}: ${err}`);
        });
        fs.unlink(outputFile, (err) => {
          if (err)
            console.error(`Error deleting temporary file ${filePath}: ${err}`);
        });
      });
    } catch (error) {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      if (outputFile && fs.existsSync(outputFile)) {
        fs.unlinkSync(outputFile);
      }
      console.error(error.message);
      res.status(500).json({ message: "Error trimming audio file" });
    }
  });
};

///// Trim audio controller for overdub
// Text-to-speech function
const textToSpeech = async (text, outputFilePath) => {
  // Using AWS Polly
  const params = {
    Text: text,
    OutputFormat: "mp3",
    VoiceId: "Joey",
  };
  console.log(params);
  // Synthesize speech with Polly
  const { AudioStream } = await polly.synthesizeSpeech(params).promise();

  // Save audio file to path
  return new Promise((resolve, reject) => {
    const audioReadableStream = stream.Readable.from(AudioStream);
    const fileStream = fs.createWriteStream(outputFilePath);
    audioReadableStream.pipe(fileStream);
    fileStream.on("close", (err) => {
      if (err) {
        reject(new Error(`Error exporting TTS audio ${err.message}`));
      }
      resolve();
    });
  });
};

// Get duration of audio
const getAudioDuration = async (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const ffprobeProcess = spawn("ffprobe", [
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
    } catch (err) {
      console.error(err);
    }
  });
};

const cleanTemp = (
  trimmedFilePath,
  part1FilePath,
  part2FilePath,
  outputFilePath,
  ttsFilePath
) => {
  if (trimmedFilePath && fs.existsSync(trimmedFilePath)) {
    fs.unlink(trimmedFilePath, (err) => {
      if (err) {
        console.error(`Error deleting temporary files: ${err}`);
      }
    });
  }
  if (part1FilePath && fs.existsSync(part1FilePath)) {
    fs.unlink(part1FilePath, (err) => {
      if (err) {
        console.error(`Error deleting temporary files: ${err}`);
      }
    });
  }
  if (part2FilePath && fs.existsSync(part2FilePath)) {
    fs.unlink(part2FilePath, (err) => {
      if (err) {
        console.error(`Error deleting temporary files: ${err}`);
      }
    });
  }
  if (outputFilePath && fs.existsSync(outputFilePath)) {
    fs.unlink(outputFilePath, (err) => {
      if (err) {
        console.error(`Error deleting temporary files: ${err}`);
      }
    });
  }
  if (ttsFilePath && fs.existsSync(ttsFilePath)) {
    fs.unlink(ttsFilePath, (err) => {
      if (err) {
        console.error(`Error deleting temporary files: ${err}`);
      }
    });
  }
};

// Overdub Controller
const overdubController = async (req, res) => {
  uploadAudio(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Error uploading file" });
    }
    const { path: filePath } = req.file;
    const ttsFilePath = path.join(SERVER_PATH, "uploads/temp/tts-temp.mp3");
    const part1FilePath = path.join(SERVER_PATH, "uploads/temp/part1.mp3");
    const part2FilePath = path.join(SERVER_PATH, "uploads/temp/part2.mp3");
    const outputFilePath = path.join(SERVER_PATH, "uploads/temp/output.mp3");
    const trimmedFilePath = path.join(SERVER_PATH, "uploads/temp/trimmed.mp3");
    try {
      const startTime = parseFloat(req.body.startTime);
      const endTime = parseFloat(req.body.endTime);
      const overdubWord = req.body.overdubWord;

      // Clean temp folder
      cleanTemp(
        trimmedFilePath,
        part1FilePath,
        part2FilePath,
        outputFilePath,
        trimmedFilePath
      );

      // Trim the audio file to remove the part containing the word that will be replaced
      await trimAudio(filePath, startTime, endTime, trimmedFilePath);

      // Convert the overdub word to an audio file using the TTS
      await textToSpeech(overdubWord, ttsFilePath);

      // Split the trimmed audio file into two parts
      const part1Duration = startTime;
      await trimAudio(trimmedFilePath, 0, part1Duration, part2FilePath);
      console.log(part1Duration);
      const part2Duration = await getAudioDuration(trimmedFilePath).then(
        (duration) => duration - endTime
      );
      await trimAudio(
        trimmedFilePath,
        startTime,
        startTime + part2Duration,
        part1FilePath
      );

      // Merge the audio files
      await new Promise((resolve, reject) => {
        const concatProcess = spawn("ffmpeg", [
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
            res.sendFile(outputFilePath, () => {
              fs.unlink(filePath, (err) => {
                if (err) {
                  console.error(`Error deleting temporary files: ${err}`);
                }
              });
              fs.unlink(trimmedFilePath, (err) => {
                if (err) {
                  console.error(`Error deleting temporary files: ${err}`);
                }
              });
              fs.unlink(ttsFilePath, (err) => {
                if (err) {
                  console.error(`Error deleting temporary files: ${err}`);
                }
              });
              fs.unlink(part1FilePath, (err) => {
                if (err) {
                  console.error(`Error deleting temporary files: ${err}`);
                }
              });
              fs.unlink(part2FilePath, (err) => {
                if (err) {
                  console.error(`Error deleting temporary files: ${err}`);
                }
              });
              fs.unlink(outputFilePath, (err) => {
                if (err) {
                  console.error(`Error deleting temporary files: ${err}`);
                }
              });
            });
            resolve();
          } else {
            reject(new Error(`ffmpeg exited with code ${code}`));
          }
        });
      });
    } catch (err) {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting temporary files: ${err}`);
          }
        });
      }
      cleanTemp(
        trimmedFilePath,
        part1FilePath,
        part2FilePath,
        outputFilePath,
        trimmedFilePath
      );
      console.error(err);
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
