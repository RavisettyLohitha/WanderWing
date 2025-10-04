const express = require("express");
const Router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/WrapAsync.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//REVIEW
//Post Review Route

Router.post(
  "/",
  isLoggedIn,
  validateReview,
  WrapAsync(reviewController.createReview)
);

//REVIEW
//DELETE REVIEW ROUTE
Router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  WrapAsync(reviewController.destroyReview)
);

module.exports = Router;
