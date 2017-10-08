var express = require("express");
var app = express();
app.set("view engine", "ejs");

var dogs = [
    { name: "Rocky Dawg", breed: "German Shepherd", image:"http://www.publicdomainpictures.net/pictures/30000/velka/rocky-dawg.jpg" },
    { name: "Holly", breed: "Yorkshire Terrier", image:"https://upload.wikimedia.org/wikipedia/commons/b/bf/Holly_the_Yorkshire_Terrier.jpg" },
        { name: "Rocky Dawg", breed: "German Shepherd", image:"http://www.publicdomainpictures.net/pictures/30000/velka/rocky-dawg.jpg" },
    { name: "Holly", breed: "Yorkshire Terrier", image:"https://upload.wikimedia.org/wikipedia/commons/b/bf/Holly_the_Yorkshire_Terrier.jpg" },
        { name: "Rocky Dawg", breed: "German Shepherd", image:"http://www.publicdomainpictures.net/pictures/30000/velka/rocky-dawg.jpg" },
    { name: "Holly", breed: "Yorkshire Terrier", image:"https://upload.wikimedia.org/wikipedia/commons/b/bf/Holly_the_Yorkshire_Terrier.jpg" },
];

app.get("/", function(req, res) {
    res.render("home");
})

app.get("/dogs", function(req, res) {
    res.render("dogs", { dogs: dogs });
})

app.get("/dogs/add", function(req, res) {
    res.render("adddogs");
})

app.post("/dogs", function(req, res) {
    console.log(name);
    var name = req.body.name;
    var breed = req.body.breed;
    var newDog = { name: name, breed: breed };
    dogs.push(newDog);
    res.redirect("/dogs");
})

app.listen(3000, function() {
    console.log("Server has started");
});