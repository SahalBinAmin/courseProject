const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const {
  renderSignupForm,
  postSignup,
  renderLoginForm,
  postLogin,
  logout,
} = require("../controllers/user");

//Get Route For Signup
router.get("/signup", renderSignupForm);

//Post Route For Signup
router.post("/signup", wrapAsync(postSignup));

//Get Route For Login
router.get("/login", renderLoginForm);

//Post Route For Login
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  postLogin
);

//Get Route For
router.get("/logout", logout);

module.exports = router;
