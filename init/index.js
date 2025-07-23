const mongoose = require("mongoose");
const intData = require("./data");
const Listing = require("../models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderLand";
async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(`Error occured ${err}`);
  });

async function initDb() {
  await Listing.deleteMany({});
  await Listing.insertMany(intData.data);
  console.log("data was initialized");
}

initDb();
