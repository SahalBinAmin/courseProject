const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  let rListing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  rListing.reviews.push(newReview);
  await newReview.save();
  await rListing.save();
  console.log("Review Saved");
  res.redirect(`/listings/${rListing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, rId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: rId } });
  await Review.findByIdAndDelete(rId);
  res.redirect(`/listings/${id}`);
};
