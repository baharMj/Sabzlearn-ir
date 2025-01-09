const mongoose = require("mongoose")

const schema = mongoose.Schema({

    phone:{
        type : String,
        required : true,
    },

}, {Timestamp: true } )

const model = mongoose.model ( 'BanUser' , schema ) ; 
module.exports = model ; 
