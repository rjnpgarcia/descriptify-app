const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const revai = require("revai-node-sdk");
const cors = require("cors");
const routes = require("./routes/router.js");
require("dotenv").config();

// Express
const app = express();

// Mongoose connection
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPass}@cluster0.fxildye.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB Atlas (descriptify-db)"))
  .catch((err) => console.log("Error connecting to MongoDB Atlas", err));

// ENV files
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Route end points
routes(app);

app.get("/", (req, res) => {
  res.send(`Node and express server running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`);
});
