const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlocalmongoose = require("passport-local-mongoose");


// passportlocalmongoose will auto implement username, password, salting, hashing, so dont need to write here explicitly..
const userSchema = new Schema({
    email : {
        type : String,
        required : true
    }
});


userSchema.plugin(passportlocalmongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;
