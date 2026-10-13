const express=require("express")
const Board=require("../models/board")
const Task=require("../models/task")
const router=express.Router()

router.post("/",async(req,res)=>{
    try{
        const {title,createdBy,members}=req.body
        if(!title || !createdBy){
            return res.status(400).json({message:"All fields are required"})
        }
        const board=await Board.create({
            title,
            createdBy,
            members,
        })
        return res.status(201).json({board,message:"Board created successfully"})
    }
    catch(error)
    {
        return res.status(500).json({message:"Internal Server error"})
    }
})

router.post("/:boardID/members",async(req,res)=>{
    try{
    const {boardID}=req.params
    const {member}=req.body
    if (!member) {
    return res.status(400).json({ message: "Member is required" });
}
    const board=await Board.findById(boardID)
    if(!board){
        return res.status(404).json({message:"No board found with this ID"})
    }
    const already_exists=board.members.includes(member)
    if(already_exists){
        return res.status(400).json({message:"member already exists"})
    }
    board.members.push(member)
    await board.save()
    return res.status(201).json({board,message:"member added to the board"})
    }
    catch(error)
    {
        return res.status(500).json({message:"Internal Server error"})
    }
})

router.get("/:boardID",async(req,res)=>{
    try{
    const {boardID}=req.params
    const board=await Board.findById(boardID)
    if(!board){
        return res.status(404).json({message:"no board found with this ID"})
    }
    const tasks=await Task.find({board:boardID})
    if(tasks.length===0){
        return res.status(404).json({message:"no task found with this boardID"})
    }
    return res.status(200).json({board,tasks,message:"Board fethched successfully"})
    }
    catch(error){
      return res.status(500).json({message:"Internal Server Error"})
    }
})

module.exports=router
