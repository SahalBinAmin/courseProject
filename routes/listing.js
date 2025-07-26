const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/wrapAsync");
const { listingSchema, schemaVal } = require("../utils/schemaVal");
const ExpressError = require("../utils/expressErrors");
const Listing = require("../models/listing");

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
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
router.get(
  "/:id",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let srchListing = await Listing.findById(id).populate("reviews");
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
  validateListing,
  asyncWrap(async (req, res, next) => {
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    req.flash("success", "New Listing Created!!");
    res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",
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
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
  })
);

//DELETE ROUTE
router.delete(
  "/:id",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

module.exports = router;
