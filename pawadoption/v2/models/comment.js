var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    name: String,
    message: String
});

module.exports = mongoose.model("Comment", commentSchema);