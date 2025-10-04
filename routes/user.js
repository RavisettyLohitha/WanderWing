const express = require("express");
const Router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

Router.route("/signup")
  .get(userController.renderSignupForm)
  .post(WrapAsync(userController.signup));

Router.route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );


//LOGOUT ROUTE
Router.get("/logout", userController.logout);
module.exports = Router;
