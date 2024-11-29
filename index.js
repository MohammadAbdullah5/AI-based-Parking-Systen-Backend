const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
// Import routers
// Global error handler middleware
const globalErrorHandler = require("./middlewares/globalErrorHandler");
// const Review = require("./Models/Review");

dotenv.config();

const app = express();
// CORS options
const corsOptions = {
  origin: ["https://uetparking.vercel.app", "http://localhost:5173"], // List of allowed origins
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers

  credentials: true, // Enable credentials (if needed)
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
// Set up routes


// Global error handler
app.use(globalErrorHandler);

module.exports = app;
