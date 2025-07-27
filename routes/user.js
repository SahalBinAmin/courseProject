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

router.route("/signup").get(renderSignupForm).post(wrapAsync(postSignup));

router
  .route("/login")
  .get(renderLoginForm)
  .post(
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
