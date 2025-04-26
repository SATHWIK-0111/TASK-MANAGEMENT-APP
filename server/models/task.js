const mongoose  = require("mongoose")

const taskSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["pending","in-progress","completed"],
        default:"pending",
        required:true,
    },
    deadline:{
        type:Date,
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required:true
    }
});

const tasklistmodel = mongoose.model("Tasks",taskSchema);

module.exports=tasklistmodel;