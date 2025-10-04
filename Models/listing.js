const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");
const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    url: String,
    fileName: String,
  },
  price: Number,
  location: String,
  country: String,
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
  geometry: {
    type: {
      type: String,
      enum: ["Point"], 
      requird: true,
    },
    coordinates: {
      type: [Number],
      requires: true,
    },
  },
  category:{
    type:String,
    enum:["Trending","Lodge","Iconic Cities","Mountain-city","Beaches","Amazing Pools","Castles","Camping","Towers","Boats"],
    required:true
  }
});
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
