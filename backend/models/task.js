const mongoose=require("mongoose")

const taskSchema=new mongoose.Schema({
    board:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Board",
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    priority:{
        type:String,
        enum:["low","medium","high"],
        default:"medium",
    },
    dueDate:{
        type:Date,
        required:true
    },
    assignedTo:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["todo","inProgress","review","done"],
        default:"todo"
    },
    position:{
        type:Number,
        default:0
    }
})

const Task=mongoose.model("task",taskSchema)
module.exports=Task