const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/wrapAsync");
const { listingSchema, schemaVal } = require("../utils/schemaVal");
const ExpressError = require("../utils/expressErrors");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner } = require("../middleware");

//Validation For Schema
const validateListing = (req, res, next) => {
  const joiResult = listingSchema.validate(req.body);
  const { error } = listingSchema.validate(req.body);
  if (error) {
    return next(new ExpressError(400, error.details[0].message));
  }
  next();
};

//Index Route
router.get(
  "/",
  asyncWrap(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
router.get(
  "/:id",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let srchListing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!srchListing) {
      req.flash("error", "Listing doesn't exist");
      res.redirect("/listings");
    }
    res.render("listings/show", { srchListing });
  })
);

//POST ROUTES
//Create Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  asyncWrap(async (req, res, next) => {
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "New Listing Created!!");
    res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let srchListing = await Listing.findById(id);
    res.render("listings/edit", { srchListing });
  })
);

//PUT ROUTES
//Put Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
  })
);

//DELETE ROUTE
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

module.exports = router;
