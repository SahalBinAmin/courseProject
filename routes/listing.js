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

//Router.Route Implementation
router
  .route("/")
  .get(asyncWrap(index))
  .post(isLoggedIn, validateListing, asyncWrap(createListing));

//New Route
router.get("/new", isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(asyncWrap(showListing))
  .put(isLoggedIn, isOwner, validateListing, asyncWrap(updateListing))
  .delete(isLoggedIn, isOwner, asyncWrap(destroyListing));

//POST ROUTES

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(renderEditForm));

module.exports = router;
