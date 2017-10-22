var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root
router.get("/", function(req, res) {
    res.render("home");
})

//register
router.get("/register", function(req, res) {
    res.render("register");
})

//register process
router.post("/register", function(req, res) {
    var user = new User({ username: req.body.username });
    User.register(user, req.body.password, function(error, user) {
        if (error) {
            // console.log(error);
            res.flash("error", error.message);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.flash("welcome", "Welcome " + user.username)
                res.redirect("/dogs");
            });
        }
    });
})

//login
router.get("/login", function(req, res) {
    res.render("login");
})

//login process
router.post("/login", passport.authenticate("local", {
    // res.flash("login", "Signed in as " + req.user.username);
    successRedirect: "/dogs",
    failRedirect: "/login"
}), function(req, res) {});

//logout
router.get("/logout", function(req, res) {
    req.logout();
    res.flash("logout", "Successfully Logged Out");
    res.redirect("/dogs");
})

// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect("/login");
// }
module.exports = router;