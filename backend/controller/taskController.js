const Task=require("../models/task")

const allowedFields=[
     "title",
    "description",
    "priority",
    "status",
    "dueDate"
]

async function createTask(req,res,next){
    try
    {
    if(!req.body || typeof req.body!=="object"|| Array.isArray(req.body)
)
    {
        return res.status(400).json({ message: "Invalid request body" });
    }
    const invalidFields=Object.keys(req.body).filter(field=>!allowedFields.includes(field))
    
    if(invalidFields.length>0)
    {
         return res.status(400).json({
            message:"Invalid fields",
            field:invalidFields
         });
    }
    const task=await Task.create(req.body);
    res.status(201).json({
        message: "Task created successfully",
        data: task
    });
    }  
    catch(error)
    {
        return next(error);
    }
}

async function getTasks(req,res,next)
{
    try
    {
    const {status,sortBy,order="asc"}=req.query;
    const filter={}

    //validate status
    if(status)
    {
        if(!["todo", "in_progress", "done"].includes(status))
        {
             return res.status(400).json({
                message: "Invalid status filter"
            });
        }
        filter.status = status;
    }

    //validate sorting
    if(sortBy && !["dueDate", "priority"].includes(sortBy))
    {
        return res.status(400).json({
            message: "sortBy must be dueDate or priority"
        });
    }

    //validate order
    if(!["asc", "desc"].includes(order))
    {
         return res.status(400).json({
            message: "order must be asc or desc"
        });
    }

    //sort tasks
    const direction=order==="asc"?1:-1;
    if(sortBy==="dueDate")
    {
        const tasks=await Task.find(filter).sort({dueDate:direction})
        return res.status(200).json({data:tasks});
    }
    else if(sortBy==="priority")
    {
        const priorityRank = { low: 1, medium: 2, high: 3 };
        
        const tasks = await Task.find(filter).lean();

        tasks.sort((a, b) => {
        const difference = priorityRank[a.priority] - priorityRank[b.priority];
        return order === "asc" ? difference : -difference;
    });
        return res.status(200).json({ data: tasks });
    }
        
        const tasks = await Task.find(filter);
        return res.status(200).json({ data: tasks });
    }
    catch(error)
    {
        return next(error);
    }
}

async function getTaskById(req,res,next)
{
    try
    {

    const task = await Task.findById(req.params.id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.status(200).json({
        data: task
    });
    }
    catch(error)
    {
        return next(error);
    }

}

async function updateTask(req,res,next)
{

try
{
    if(!req.body || typeof req.body!=="object")
    {
        return res.status(400).json({ message: "Invalid request body" });
    }

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            message: "Provide at least one field to update"
        });
    }

    const invalidFields = Object.keys(req.body).filter(
    field => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
    return res.status(400).json({
        message: "Invalid fields",
        fields: invalidFields
    });}

    const task = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );
    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }
    res.status(200).json({
        message: "Task updated successfully",
        data: task
    });
}
catch(error)
{
    return next(error);
}
}

async function deleteTask(req,res,next)
{
    try
    {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
        }
        
        res.status(200).json({
        message: "Task deleted successfully"
        });
    }
    catch(error)
    {
        return next(error);
    }
}

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
};