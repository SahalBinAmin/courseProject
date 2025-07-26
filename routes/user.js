const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

//Get Route For Signup
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

//Post Route For Signup
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({
        email,
        username,
      });
      const regUser = await User.register(newUser, password);
      console.log(regUser);
      req.flash("success", `Welcome ${username}`);
      res.redirect("/listings");
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })
);

//Get Route For Login
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

//Post Route For Login
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome back to wanderlust");
    res.redirect("listings");
  }
);

module.exports = router;
