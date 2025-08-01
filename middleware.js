const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged-In!!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currentUser._id)) {
    req.flash(
      "error",
      "You don't have the permissions since you aren't the owner"
    );
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, rId } = req.params;
  let review = await Review.findById(rId);
  if (!review.author.equals(res.locals.currentUser._id)) {
    req.flash(
      "error",
      "You don't have the permissions since you aren't the owner"
    );
    return res.redirect(`/listings/${id}`);
  }
  next();
};
