const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const errorMiddleware = require("./middleware/error");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Config
dotenv.config({ path: "config/config.env" });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

const uploadNewCsv = require("./routes/newCsvUploadRoute");

app.use("/api/v1", uploadNewCsv);

//Middleware for errors
app.use(errorMiddleware);

module.exports = app;
