const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/wrapAsync");
const { listingSchema, schemaVal } = require("../utils/schemaVal");
const ExpressError = require("../utils/expressErrors");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner } = require("../middleware");
const {
  index,
  renderNewForm,
  showListing,
  createListing,
  renderEditForm,
  updateListing,
  destroyListing,
} = require("../controllers/listing");

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
router.get("/", asyncWrap(index));

//New Route
router.get("/new", isLoggedIn, renderNewForm);

//Show Route
router.get("/:id", asyncWrap(showListing));

//POST ROUTES
//Create Route
router.post("/", isLoggedIn, validateListing, asyncWrap(createListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(renderEditForm));

//PUT Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  asyncWrap(updateListing)
);

//DELETE ROUTE
router.delete("/:id", isLoggedIn, isOwner, asyncWrap(destroyListing));

module.exports = router;
