const User = require("../models/user");
const passport = require("passport");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.postSignup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({
      email,
      username,
    });
    const regUser = await User.register(newUser, password);
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
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.postLogin = async (req, res) => {
  req.flash("success", "Welcome back to wanderland");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "Logged-Out");
    res.redirect("/listings");
  });
};
