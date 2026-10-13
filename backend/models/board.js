const mongoose=require("mongoose")

const boardSchema=new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true
    },

    createdBy: {
      type: String,
      required: true
    },

    members: {
      type: [String],
      default: []
    }

},{timestamps:true})

const Board=mongoose.model("Board",boardSchema)
module.exports=Board