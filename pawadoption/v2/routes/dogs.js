var express = require("express");
var router = express.Router();
var Dog = require("../models/dog");
var middleware = require("../middleware");


//dogs
router.get("/", function(req, res) {
    //get all dogs from db.
    Dog.find({}, function(error, dogsList) {
        if (error) {
            console.log(error);
        } else {

            res.render("dogs/dogs", { dogs: dogsList });
        }
    })
})

router.get("/add", middleware.isLoggedIn, function(req, res) {
    res.render("dogs/adddogs");
})

router.get("/:id", function(req, res) {
    //find by id
    Dog.findById(req.params.id).populate("comments").exec(function(error, theDog) {
        if (error) {
            console.log(error);
        } else {
            //render the page for some dog
            res.render("dogs/details", { dog: theDog });
        }
    });
})

router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.dog.name;
    var image = req.body.dog.image;
    var desc = req.sanitize(req.body.dog.description);;
    var breed = req.body.dog.breed;
    var age = req.body.dog.age;
    var createdBy = {
        id: req.user._id,
        username: req.user.username
    }
    var newDog = {
        name: name,
        image: image,
        description: desc,
        breed: breed,
        age: age,
        createdBy: createdBy
    };
    //create new data to db
    // req.body.dog.description = req.sanitize(req.body.dog.description);
    Dog.create(newDog, function(error, createdDog) {
        if (error) {
            console.log(error);
        } else {
            console.log(createdDog);
            res.redirect("/dogs");
        }
    })
})

router.get("/:id/edit", middleware.checkPawCreator, function(req, res) {
    //find by id
    Dog.findById(req.params.id, function(error, theDog) {
        // res.flash("error","You don't have permission to do that");
        res.render("dogs/edit", { dog: theDog });
    });
})

router.put("/:id", middleware.checkPawCreator, function(req, res) {
    req.body.dog.description = req.sanitize(req.body.dog.description);
    Dog.findByIdAndUpdate(req.params.id, req.body.dog, function(error, updatedDog) {
        if (error) {
            res.redirect("/dogs");
        } else {
            console.log(req.body.dog);
            res.redirect("/dogs/" + req.params.id);
        }
    })
    // res.send("update");
})

router.delete("/:id", middleware.checkPawCreator, function(req, res) {
    Dog.findByIdAndRemove(req.params.id, function(error) {
        if (error) {
            res.redirect("/dogs");
        } else {
            res.redirect("/dogs");
        }
    })
    // res.send("deleted");
})

// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect("/login");
// }

// function checkCreator(req, res, next) {
//     if (req.isAuthenticated()) {
//         Dog.findById(req.params.id, function(error, theDog) {
//             if (error) {
//                 console.log(error);
//                 res.redirect("back");
//             } else {
//                 if (theDog.createdBy.id.equals(req.user._id)) {
//                     next();
//                     // res.render("dogs/edit", { dog: theDog });
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