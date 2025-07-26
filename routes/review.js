const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/expressErrors");
const { listingSchema, schemaVal } = require("../utils/schemaVal");
const { isLoggedIn, isOwner, isReviewAuthor } = require("../middleware");

//Validation For Review
const validateReview = (req, res, next) => {
  const joiResult = schemaVal.validate(req.body);
  const { error } = schemaVal.validate(req.body);
  if (error) {
    return next(new ExpressError(400, error.details[0].message));
  }
  next();
};

//REVIEW ROUTES

//REVIEW ROUTE
router.post(
  "/reviews",
  isLoggedIn,
  validateReview,
  asyncWrap(async (req, res) => {
    let rListing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    rListing.reviews.push(newReview);
    await newReview.save();
    await rListing.save();
    console.log("Review Saved");
    res.redirect(`/listings/${rListing._id}`);
  })
);

//DELETE REVIEW ROUTE
router.delete(
  "/review/:rId",
  isLoggedIn,
  isReviewAuthor,
  asyncWrap(async (req, res) => {
    let { id, rId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: rId } });
    await Review.findByIdAndDelete(rId);
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
