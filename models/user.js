const mongoose = require("mongoose")

const schema = mongoose.Schema({
    username:{
        type : String,
        required : true,
    },
    email:{
        type : String,
        required : true,
        unique : true,
    },
    password:{
        type : String,
        required : true,
    },
    phonenumber:{
        type : String,
        required : true,
    },
    name:{
        type : String,
        required : true,
    },
    role:{
        type : String,
        enum : ["ADMIN", "USER"],
        default : 'USER',
        required : true,
    },

}, {Timestamp: true } )

const model = mongoose.model ( 'User' , schema ) ; 
module.exports = model ; 
