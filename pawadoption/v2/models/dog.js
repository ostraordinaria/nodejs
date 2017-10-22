var mongoose = require("mongoose");

//setting up schema
var dogSchema = new mongoose.Schema({
    name: String,
    breed: String,
    description: String,
    image: String,
    age: Number,
    createdBy:{
    	id: {
    		type: mongoose.Schema.Types.ObjectId,
    		ref: "User"
    	},
    	username: String
    },
    createdOn: {
    	type: Date, default: Date.now
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});
module.exports = mongoose.model("Dog", dogSchema);