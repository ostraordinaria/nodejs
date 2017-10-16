var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    Dog = require("./models/dog"),
    Comment = require("./models/comment"),
    seed = require("./seeds");


//add mongoose and connect to pawadoption db.
//it will check if the selected db is available.
//if it's not available then it will create a new one.
mongoose.connect('mongodb://localhost/pawadoption', {
    useMongoClient: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//seed db
seed();

//passport setting
app.use(require("express-session")({
    secret: "secret key",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// var Dog = mongoose.model("Dog", dogSchema);

app.get("/", function(req, res) {
    res.render("home");
})

//dogs
app.get("/dogs", function(req, res) {
    //get all dogs from db.
    Dog.find({}, function(error, dogsList) {
        if (error) {
            console.log(error);
        } else {

            res.render("dogs/dogs", { dogs: dogsList });
        }
    })
})

app.get("/dogs/add", function(req, res) {
    res.render("dogs/adddogs");
})

app.get("/dogs/:id", function(req, res) {
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

app.post("/dogs", function(req, res) {
    //create new data to db
    req.body.dog.description = req.sanitize(req.body.dog.description);
    Dog.create(req.body.dog, function(error, createdDog) {
        if (error) {
            console.log(error);
        } else {
            res.redirect("/dogs/dogs");
        }
    })
})

app.get("/dogs/:id/edit", function(req, res) {
    //find by id
    Dog.findById(req.params.id, function(error, theDog) {
        if (error) {
            console.log(error);
            res.redirect("/dogs");
        } else {
            //render the edit page for the dog
            res.render("dogs/edit", { dog: theDog });
            // console.log(req.params.id);
        }
    });
})

app.put("/dogs/:id", function(req, res) {
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

app.delete("/dogs/:id", function(req, res) {
    Dog.findByIdAndRemove(req.params.id, function(error) {
        if (error) {
            res.redirect("/dogs");
        } else {
            res.redirect("/dogs");
        }
    })
    // res.send("deleted");
})

//comments
app.get("/dogs/:id/comments/new", function(req, res) {
    Dog.findById(req.params.id, function(error, dog) {
        if (error) {
            console.log(error);
        } else {
            res.render("comments/new", { dog: dog });
        }
    })
})

app.post("/dogs/:id/comments", function(req, res) {
    Dog.findById(req.params.id, function(error, dog) {
        if (error) {
            console.log(error);
            res.redirect("/dogs")
        } else {
            Comment.create(req.body.comment, function(error, comment) {
                if (error) {
                    console.log(error);
                } else {
                    dog.comments.push(comment);
                    dog.save();
                    res.redirect("/dogs/" + dog._id);
                }
            })
        }
    })
})

//account
app.get("/register", function(req, res) {
    res.render("register");
})

app.post("/register", function(req, res) {
    var user = new User({ username: req.body.username });
    User.register(user, req.body.password, function(error, user) {
        if (error) {
            console.log(error);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/dogs");
        });
    });
})

app.get("/login", function(req, res) {
    res.render("login");
})

app.post("/login", passport.authenticate("local", {
        successRedirect: "/dogs",
        failRedirect: "/login"
    }), function(req, res) {

});

app.get("/logout", function(){
    req.logout();
    res.redirect("/dogs");
})

app.listen(3000, function() {
    console.log("Server has started");
});