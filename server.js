const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

// Set up view engine
app.set("view engine", "ejs");

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";

// Start server first, then connect to MongoDB
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Visit http://localhost:${port} to view the app`);
});

// Connect to MongoDB with better error handling (after server starts)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error.message);
      console.log("Server will continue without MongoDB connection");
    });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
  });
} else {
  console.log("No MONGODB_URI found, skipping database connection");
}

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));

const authController = require("./controllers/auth.js");
const musicController = require("./controllers/music.js");

// GET /
app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.use("/auth", authController);
app.use("/music", musicController);


