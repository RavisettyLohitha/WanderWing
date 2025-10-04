const Listing = require("../Models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index = async (req, res) => {
  const { q, category } = req.query;
  let filter = {};

  if (q && q.trim() !== "") {
    filter.$or = [
      { location: { $regex: q, $options: "i" } },
      { title: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } },
    ];
  }

  // If category is set and not 'Trending', filter by category
  if (category && category.trim() !== "" && category !== "Trending") {
    filter.category = category;
  }
  // If category is 'Trending', do not filter by category (show all)
  const allListings = await Listing.find(filter);
  res.render("./listings/index", { allListings });
};
module.exports.renderNewForm = (req, res) => {
  console.log(req.user);
  res.render("./listings/new.ejs");
};
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing You Requested For Does Not Exist!");
    res.send("/listings");
  }
  console.log(listing);
  res.render("./listings/show.ejs", { listing });
};
module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  const newListing = new Listing(req.body.listing);
  console.log(req.user);
  newListing.owner = req.user._id;
  if (req.file) {
    newListing.image = { url: req.file.path, fileName: req.file.filename };
  } else if (req.body.listing.image && req.body.listing.image.url) {
    newListing.image = { url: req.body.listing.image.url, fileName: "" };
  } else {
    req.flash("error", "You must provide an image file or an URL");
    return res.redirect("/listings/new");
  }
  newListing.geometry = response.body.features[0].geometry;
  newListing.category = req.body.listing.category;
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing You Requested For Does Not Exist!");
    res.send("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("./listings/edit.ejs", { listing, originalImageUrl });
};
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let updatedListing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });
  if (req.body.listing.location) {
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();
    if (response.body.features.length) {
      updatedListing.geometry = response.body.features[0].geometry;
      await updatedListing.save();
    }
  }
  if (req.body.listing.image && req.body.listing.image.url) {
    updatedListing.image.url = req.body.listing.image.url;
    await updatedListing.save();
  }
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { url, filename };
    await updatedListing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
