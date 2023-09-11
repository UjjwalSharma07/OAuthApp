const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId:{
        type:String
    },
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email:{
        type: String, 
    },
    profileUrl:{
        type:String,
    },
},{timestamps:true})

module.exports = mongoose.model("UserDetails",UserSchema)

