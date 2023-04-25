# Descriptify App

A Transcription app that has Speech-to-Text and Text-to-Speech feature <br />

## Features:

**Speech-to-Text**

- Record audio for transcription
- Import audio file for transcription
- Downloadable transcribed audio and text
- Remove audio to start a new recording for transcription
- Clickable Transcription texts and waveform regions to remove or overdub text and audio
- Drag and click an empty waveform area to be able to remove or overdub a part of an audio.
- Word highlights of the transcription as spoken.
- Redo and undo functionality
- Open, save, and overwrite files.
- Automatically transcribe after every changes made.
- Note: Recorded audio must be more than 2 seconds of length for transcription

**Text-to-Speech**

- Input text to convert into Speech transcription
- Word highlights of the transcribed text as spoken
- Redo and Undo text input
- Downloadable transcribed text and audio
- Import text file for Speech transcription
- Open, save, and overwrite files

**Login and Register User**

- Register User account with validations
- Login User account with validations
- Logged in user shown in app
- Update user profile
- Logout user
- Delete account with all the saved files

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`API_KEY`
`DB_USER`
`DB_PASS`
`PORT`
and AWS credentials for AWS POLLY

## Run Locally

Install dependencies

```bash
  npm install
```

Start the server

```bash
  cd server
```

```bash
  npm start
```

## Authors

- [@rjnpgarcia](https://www.github.com/rjnpgarcia)
  [![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rjnpgarcia)
