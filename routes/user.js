const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

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
      req.login(regUser, (err) => {
        if (err) {
          next(err);
        }
        req.flash("success", `Welcome ${username}`);
        res.redirect("/listings");
      });
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
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome back to wanderland");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
);

//Get Route For
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "Logged-Out");
    res.redirect("/listings");
  });
});

module.exports = router;
