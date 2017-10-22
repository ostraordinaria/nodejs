var Dog = require("../models/dog");
var Comment = require("../models/comment");

var middlewareObj = [];


middlewareObj.checkPawCreator = function(req, res, next) {
    if (req.isAuthenticated()) {
        Dog.findById(req.params.id, function(error, theDog) {
            if (error) {
                console.log(error);
                res.flash("error", "Paw print not found");
                res.redirect("back");
            } else {
                if (theDog.createdBy.id.equals(req.user._id)) {
                    next();
                    // res.render("dogs/edit", { dog: theDog });
                } else {
                    res.flash("error", "You don't have permission to do that");
                    res.redirect("/dogs");
                }
            }
        });
    } else {
        console.log("you need to login first");
        res.redirect("back");
    }
}

middlewareObj.checkCommentCreator = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.commentId, function(error, theComment) {
            if (error) {
                console.log(error);
                res.redirect("back");
            } else {
                if (theComment.name.id.equals(req.user._id)) {
                    next();
                } else {
                    res.flash("error", "You don't have permission to do that");
                    // console.log("you dont have permission to edit the page");
                    res.redirect("back");
                }
            }
        });
    } else {
        res.flash("error", "You have to log in first");
        // console.log("you need to login first");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.flash("error", ["Please Login Or Register First"]);
    res.redirect("/login");
}

module.exports = middlewareObj;