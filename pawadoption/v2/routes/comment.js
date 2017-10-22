var express = require("express");
var router = express.Router({ mergeParams: true });
var Dog = require("../models/dog");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//new
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Dog.findById(req.params.id, function(error, dog) {
        if (error) {
            console.log(error);
        } else {
            res.render("comments/new", { dog: dog });
        }
    })
})

//create
router.post("/", middleware.isLoggedIn, function(req, res) {
    Dog.findById(req.params.id, function(error, dog) {
        if (error) {
            console.log(error);
            res.redirect("/dogs")
        } else {
            Comment.create(req.body.comment, function(error, comment) {
                if (error) {
                    res.flash("error", "Something went wrong");
                    console.log(error);
                } else {
                    comment.name.id = req.user._id;
                    comment.name.username = req.user.username;
                    comment.save();
                    dog.comments.push(comment);
                    dog.save();
                    res.flash("success", "Successfully added comment");
                    res.redirect("/dogs/" + dog._id);
                }
            })
        }
    })
})

router.get("/:commentId/edit", middleware.checkCommentCreator, function(req, res) {
    Comment.findById(req.params.commentId, function(error, theComment) {
        if (error) {
            console.log(error);
        } else {
            console.log(req.params.id);
            res.render("comments/edit", { dog: req.params.id, comment: theComment });
        }
    })
})

router.put("/:commentId", middleware.checkCommentCreator, function(req,res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(error, updatedComment) {
        if(error) {
            res.redirect("back");
        } else {
            res.redirect("/dogs/" + req.params.id)
        }
    })
})

router.delete("/:commentId", middleware.checkCommentCreator, function(req,res){
    Comment.findByIdAndRemove(req.params.commentId, function(error){
        if(error){
            res.redirect("back");
        } else {
            // res.flash("success", "Comment Deleted");
            res.redirect("/dogs/" + req.params.id);
        }
    })
    // res.send("you are here");
})

//middleware
// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect("/login");
// }

// function checkCommentCreator(req, res, next) {
//     if (req.isAuthenticated()) {
//         Comment.findById(req.params.commentId, function(error, theComment) {
//             if (error) {
//                 console.log(error);
//                 res.redirect("back");
//             } else {
//                 if (theComment.name.id.equals(req.user._id)) {
//                     next();
//                 } else {
//                     console.log("you dont have permission to edit the page");
//                     res.redirect("back");
//                 }
//             }
//         });
//     } else {
//         console.log("you need to login first");
//         res.redirect("back");
//     }
// }

module.exports = router;