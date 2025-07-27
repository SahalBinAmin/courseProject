const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/expressErrors");
const { listingSchema, schemaVal } = require("../utils/schemaVal");
const { isLoggedIn, isOwner, isReviewAuthor } = require("../middleware");
const { createReview, deleteReview } = require("../controllers/review");

//Validation For Review
const validateReview = (req, res, next) => {
  const joiResult = schemaVal.validate(req.body);
  const { error } = schemaVal.validate(req.body);
  if (error) {
    return next(new ExpressError(400, error.details[0].message));
  }
  next();
};

//REVIEW ROUTE
router.post("/reviews", isLoggedIn, validateReview, asyncWrap(createReview));

//DELETE REVIEW ROUTE
router.delete(
  "/review/:rId",
  isLoggedIn,
  isReviewAuthor,
  asyncWrap(deleteReview)
);

module.exports = router;
