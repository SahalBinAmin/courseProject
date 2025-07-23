const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const asyncWrap = require("./utils/wrapAsync");
const ExpressError = require("./utils/expressErrors");
const { error } = require("console");
const { valid, schemaVal } = require("./utils/schemaVal");
const Review = require("./models/review");
const listings = require("./routes/listing");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderLand";
async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(`Error occured while connecting db ${err}`);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.send("Home Path");
});

//Validation For Review
const validateReview = (req, res, next) => {
  const joiResult = schemaVal.validate(req.body);
  const { error } = schemaVal.validate(req.body);
  if (error) {
    return next(new ExpressError(400, error.details[0].message));
  }
  next();
};

app.use("/listings", listings);

//REVIEW ROUTES

//REVIEW ROUTE
app.post(
  "/listings/:id/reviews",
  validateReview,
  asyncWrap(async (req, res) => {
    let rListing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    rListing.reviews.push(newReview);
    await newReview.save();
    await rListing.save();
    console.log("Review Saved");
    res.redirect(`/listings/${rListing._id}`);
  })
);

//DELETE REVIEW ROUTE
app.delete(
  "/listings/:id/review/:rId",
  asyncWrap(async (req, res) => {
    let { id, rId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: rId } });
    await Review.findByIdAndDelete(rId);
    res.redirect(`/listings/${id}`);
    console.log("review deleted");
  })
);

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error.ejs", { err });
});

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
