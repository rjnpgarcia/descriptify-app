const multer = require("multer");
const { check, validationResult } = require("express-validator");
const User = require("../models/userModel");
const path = require("path");
const fs = require("fs");

const SERVER_PATH = process.env.SERVER_PATH;

// Sanitize request
const validationFileName = [check("name").trim().isEmpty().escape()];

// Create a directory for storing the uploaded files
const uploadDirectory = path.join(SERVER_PATH, "uploads/saveFiles");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

// Set up the multer middleware to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploadFile = multer({ storage: storage }).single("audioFile");

// Save file to user
const saveFileController = async (req, res) => {
  const { id } = req.params;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ error: `Invalid file name input ${errors}` });
  }

  uploadFile(req, res, async (err) => {
    if (err) {
      return res.json({ error: `Error uploading file. Please try again.` });
    }

    try {
      const { path: filePath } = req.file;
      const user = await User.findById(id);
      if (!user) {
        return res.json({ error: "User not found. Please login." });
      }

      if (!req.body.name) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
            return res.json({ error: `Error deleteing ${fileName}` });
          }
        });
        return res.json({ error: `Please enter a file name` });
      }

      const fileDataStt = {
        name: req.body.name,
        transcript: req.body.transcript,
        audioFile: filePath,
      };
      const fileDataTts = {
        name: req.body.name,
        transcript: req.body.transcript,
        audioFile: filePath,
        wordData: req.body.wordData,
      };
      if (req.body.stt) {
        // Check if file name already exists in STT
        const existingFileIndex = user.sttFiles.findIndex(
          (file) => file.name === req.body.name
        );
        if (existingFileIndex !== -1) {
          user.sttFiles[existingFileIndex] = fileDataStt;
        } else {
          // Save STT data
          user.sttFiles.push(fileDataStt);
        }
      } else if (req.body.tts) {
        // Check if file name already exists in TTS
        const existingFileIndex = user.ttsFiles.findIndex(
          (file) => file.name === req.body.name
        );
        if (existingFileIndex !== -1) {
          user.ttsFiles[existingFileIndex] = fileDataTts;
        } else {
          // Save TTS data
          user.ttsFiles.push(fileDataTts);
        }
      } else {
        // No data to save
        return res.json({ error: "Missing STT or TTS data" });
      }

      await user.save();

      res.json({ success: `Files successfully saved` });
    } catch (err) {
      console.error(err);
      res.json({ error: `Save failed. Please try again.` });
    }
  });
};

// Get user saved files controller
const getFilesController = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.json({ error: "User not found. Please login." });
    }

    const sttFiles = user.sttFiles;
    const ttsFiles = user.ttsFiles;

    res.json({ sttFiles, ttsFiles });
  } catch (error) {
    console.error(error);
    res.json({ error: "Failed gathering files. Please try again." });
  }
};

// Delete a saved file
const deleteFileController = async (req, res) => {
  const { id, type, fileName } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.json({ error: "User not found. Please login." });
    }

    const fileList = type === "stt" ? user.sttFiles : user.ttsFiles;
    const fileIndex = fileList.findIndex((file) => file.name === fileName);
    if (fileIndex === -1) {
      return res.json({ error: `${fileName} not found` });
    }
    const fileToDelete = fileList[fileIndex];
    fs.unlink(fileToDelete.audioFile, (err) => {
      if (err) {
        console.error(err);
        return res.json({ error: `Error deleteing ${fileName}` });
      }
      fileList.splice(fileIndex, 1);
      user.save().then(() => {
        const updatedUserFiles = type === "stt" ? user.sttFiles : user.ttsFiles;
        return res.json({
          success: `File "${fileName}" successfully deleted`,
          updatedUserFiles,
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.json({ error: "Delete failed. Please try again." });
  }
};

const getOneFileController = async (req, res) => {
  const { id, type, fileName } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.json({ error: "User not found. Please login." });
    }

    const fileList = type === "stt" ? user.sttFiles : user.ttsFiles;

    const files = fileList.find((file) => file.name === fileName);
    if (type === "tts") {
      res.json({ transcript: files.transcript, wordData: files.wordData });
    } else {
      res.json(files.transcript);
    }
  } catch (error) {
    console.error(error);
    res.json({ error: `Open "${fileName}" failed. Please try again` });
  }
};

const getAudioController = async (req, res) => {
  const { id, type, audio } = req.params;
  try {
    const audioPath = path.join(
      SERVER_PATH,
      `uploads/saveFiles/${audio + "-" + type + "-" + id}.mp3`
    );
    res.sendFile(audioPath);
  } catch (error) {
    console.error(error);
    res.json({ error: "File not found" });
  }
};

const downloadDocsController = async (req, res) => {
  const docsPath = path.join(SERVER_PATH, "docs/DescriptifyAppDocs.pdf");
  if (fs.existsSync(docsPath)) {
    const stat = fs.statSync(docsPath);
    res.setHeader("Content-length", stat.size);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=DescriptifyAppDocs.pdf"
    );

    const fileStream = fs.createReadStream(docsPath);
    fileStream.pipe(res);
  } else {
    res.status(404).send("File not found");
  }
};

module.exports = {
  getAudioController,
  getOneFileController,
  deleteFileController,
  getFilesController,
  saveFileController,
  validationFileName,
  downloadDocsController,
};
