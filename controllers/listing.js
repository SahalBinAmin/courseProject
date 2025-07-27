const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let srchListing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!srchListing) {
    req.flash("error", "Listing doesn't exist");
    res.redirect("/listings");
  }
  res.render("listings/show", { srchListing });
};

module.exports.createListing = async (req, res, next) => {
  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  await newlisting.save();
  req.flash("success", "New Listing Created!!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let srchListing = await Listing.findById(id);
  res.render("listings/edit", { srchListing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let delListing = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
};
