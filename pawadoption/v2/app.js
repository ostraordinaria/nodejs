var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

//add mongoose and connect to pawadoption db.
//it will check if the selected db is available.
//if it's not available then it will create a new one.
mongoose.connect('mongodb://localhost/pawadoption', {
    useMongoClient: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

//setting up schema
var dogSchema = new mongoose.Schema({
    name: String,
    breed: String,
    description: String,
    image: String
});

var Dog = mongoose.model("Dog", dogSchema);

//create new dog and save it to db
// Dog.create({
//     name: "Holly",
//     breed: "Yorkshire Terrier",
//     description: "Holly is an active and lovely dog. She is very caring towards kids and other dogs.",
//     image: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Holly_the_Yorkshire_Terrier.jpg"
// }, function(error, dog) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log("Friend added");
//         console.log(dog);
//     }
// });
// Dog.create({
//     name: "Rocky Dawg",
//     breed: "German Shepherd",
//     description: "Rocky is an large medium sized dog. He is very active and running a lot. He likes to meet a new friend.",
//     image: "http://www.publicdomainpictures.net/pictures/30000/velka/rocky-dawg.jpg"
// }, function(error, dog) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log("Friend added");
//         console.log(dog);
//     }
// });

// var dogs = [
//     { name: "Rocky Dawg", breed: "German Shepherd", image:"http://www.publicdomainpictures.net/pictures/30000/velka/rocky-dawg.jpg" },
//     { name: "Holly", breed: "Yorkshire Terrier", image:"https://upload.wikimedia.org/wikipedia/commons/b/bf/Holly_the_Yorkshire_Terrier.jpg" },
//         { name: "Rocky Dawg", breed: "German Shepherd", image:"http://www.publicdomainpictures.net/pictures/30000/velka/rocky-dawg.jpg" },
//     { name: "Holly", breed: "Yorkshire Terrier", image:"https://upload.wikimedia.org/wikipedia/commons/b/bf/Holly_the_Yorkshire_Terrier.jpg" },
//         { name: "Rocky Dawg", breed: "German Shepherd", image:"http://www.publicdomainpictures.net/pictures/30000/velka/rocky-dawg.jpg" },
//     { name: "Holly", breed: "Yorkshire Terrier", image:"https://upload.wikimedia.org/wikipedia/commons/b/bf/Holly_the_Yorkshire_Terrier.jpg" },
// ];

app.get("/", function(req, res) {
    res.render("home");
})

app.get("/dogs", function(req, res) {
    //get all dogs from db.
    Dog.find({}, function(error, dogsList) {
        if (error) {
            console.log(error);
        } else {

            res.render("dogs", { dogs: dogsList});
        }
    })
})

app.get("/dogs/add", function(req, res) {
    res.render("adddogs");
})

app.get("/dogs/:id", function(req, res) {
    //find by id
    Dog.findById(req.params.id, function(error, theDog) {
        if (error) {
            console.log(error);
        } else {
            //render the page for some dog
            res.render("details", { dog: theDog });
        }

    });
})

app.post("/dogs", function(req, res) {
    //get data from form
    // var name = req.body.name;
    // var breed = req.body.breed;
    // var image = req.body.image;
    // var desc = req.body.description;
    // var newDog = { name: name, breed: breed, image: image, description: desc };
    //create new data to db
    Dog.create(req.body.dog, function(error, createdDog) {
        if (error) {
            console.log(error);
        } else {
            res.redirect("dogs");
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
            res.render("edit", { dog: theDog });
                        // console.log(req.params.id);
        }
    });
})

app.put("/dogs/:id", function(req, res) {
    // //get data from form
    // var name = req.body.name;
    // var breed = req.body.breed;
    // var image = req.body.image;
    // var desc = req.body.description;
    // var newDog = { name: name, breed: breed, image: image, description: desc };
    // //create new data to db
    // Dog.update(newDog, function(error, createdDog) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         res.redirect("dogs");
    //     }
    // })

    Dog.findByIdAndUpdate(req.params.id, req.body.dog, function(error, updatedDog){
        if(error){
            res.redirect("/dogs");
        }
        else{
            console.log(req.body.dog);
            res.redirect("/dogs/" + req.params.id);
        }
    })

    // res.send("update");
})

app.delete("/dogs/:id", function(req, res){
    Dog.findByIdAndRemove(req.params.id, function(error){
        if(error){
            res.redirect("/dogs");
        } else {
            res.redirect("/dogs");
        }
    })
    // res.send("deleted");
})

app.listen(3000, function() {
    console.log("Server has started");
});