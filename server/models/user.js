const mongoose  = require("mongoose")

const registerSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        hash:true,
    }
})

const usermodel = mongoose.model("Users",registerSchema);

module.exports=usermodel;