const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
            minlength: [1, "Title cannot be empty"]
        },

        description: {
            type: String,
            default: ""
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        },

        status: {
            type: String,
            enum: ["todo", "in_progress", "done"],
            default: "todo"
        },

        dueDate: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: true }
    }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;