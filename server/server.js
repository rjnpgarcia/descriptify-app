const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes/router.js");
const path = require("path");
require("dotenv").config();

// Express
const app = express();

// ENV variables
const PORT = process.env.PORT || 80;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

// Mongoose connection
mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPass}@cluster0.fxildye.mongodb.net/descriptify-app?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB Atlas (descriptify-db)"))
  .catch((err) => console.log("Error connecting to MongoDB Atlas", err));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cors());

// Route end points
routes(app);

const root = path.join(path.resolve(), "../", "client", "build");
app.use(express.static(root));
app.get("*", (req, res) => {
  res.sendFile("index.html", { root });
});

app.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`);
});
