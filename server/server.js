const express = require("express");
const bodyParser = require("body-parser");
// const revai = require("revai-node-sdk");
const cors = require("cors");
const routes = require("./routes/router.js");
require("dotenv").config();

// Express
const app = express();

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
