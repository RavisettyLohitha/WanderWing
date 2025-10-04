const express = require("express");
const Router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const { storage } = require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({ storage });

Router.route("/")
  .get(WrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    WrapAsync(listingController.createListing)
  );

//New Route
Router.get("/new", isLoggedIn, listingController.renderNewForm);

Router.route("/:id")
  .get(WrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    WrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, WrapAsync(listingController.destroyListing));

//Edit Route

Router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  WrapAsync(listingController.renderEditForm)
);

module.exports = Router;
