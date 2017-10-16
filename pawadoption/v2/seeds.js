var mongoose = require("mongoose");
var Dog = require("./models/dog");
var Comment = require("./models/comment");

var sampleData = [{
        name: "Holly",
        breed: "Yorkshire Terrier",
        description: "Holly is an active and lovely dog. She is very caring toward kids and other dogs.",
        image: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Holly_the_Yorkshire_Terrier.jpg"
    },
    {
        name: "Rocky Dawg",
        breed: "German Shepherd",
        description: "Rocky is an large medium sized dog. He is very active and running a lot. He like to meets a new friend.",
        image: "http://www.publicdomainpictures.net/pictures/30000/velka/rocky-dawg.jpg"
    },
    {
        name: "Tucker",
        breed: "Pug",
        description: "He can curl his tongue and he is very funny. He love kids too.",
        image: "http://maxpixel.freegreatpicture.com/static/photo/1x/Tongue-Dog-Animals-Pugs-Cute-Lick-Pet-Pug-2555615.jpg"
    },
];

function seed() {

    //remove all doggo
    Dog.remove({}, function(error) {
        if (error) {
            console.log(error);
        } else {
            //remove all comments
            Comment.remove({}, function(error) {
                if (error) {
                    console.log(error);
                }
            });
            console.log("dogs and comment removed");
            //input all data to db
            sampleData.forEach(function(seed) {
                Dog.create(seed, function(error, dog) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Dog added");
                        //create comment
                        Comment.create({
                            name: "Steven",
                            message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo"
                        }, function(error, comment) {
                            if (error) {
                                console.log(error);
                            } else {
                                dog.comments.push(comment);
                                dog.save();
                                console.log("new comment created");
                            }
                        })
                    }
                })
            })
        }
    });
}

module.exports = seed;