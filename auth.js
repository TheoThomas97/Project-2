const bcrypt = require("bcrypt");

const User = require("../models/user.js");

const express = require("express");
const router = express.Router();

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.send("Username already taken. <a href='/auth/sign-up'>Try again</a>");
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.send("Password and Confirm Password must match. <a href='/auth/sign-up'>Try again</a>");
    }
    if (req.body.password.length < 6) {
      return res.send("Password must be at least 6 characters long. <a href='/auth/sign-up'>Try again</a>");
    }
    
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    const user = await User.create(req.body);
    res.send(`Thanks for signing up ${user.username}! <a href='/'>Go to Home</a>`);
  } catch (error) {
    console.error(error);
    res.send("Something went wrong. Please try again. <a href='/auth/sign-up'>Back to Sign Up</a>");
  }
});

module.exports = router;


