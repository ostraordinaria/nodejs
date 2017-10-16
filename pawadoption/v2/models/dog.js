var mongoose = require("mongoose");

//setting up schema
var dogSchema = new mongoose.Schema({
    name: String,
    breed: String,
    description: String,
    image: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});
module.exports = mongoose.model("Dog", dogSchema);