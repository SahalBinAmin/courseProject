const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  location: String,
  country: String,
  price: Number,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

ListingSchema.post("findOneAndDelete", async (Listing) => {
  if (Listing) {
    await review.deleteMany({ _id: { $in: Listing.reviews } });
  }
});
const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
