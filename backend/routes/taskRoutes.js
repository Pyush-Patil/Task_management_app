const express = require("express");
const Task = require("../models/task");
const Board = require("../models/board");

const router = express.Router();

// Task Created
router.post("/", async (req, res) => {
    try {
        const { board, title, description, priority, dueDate, assignedTo, status } = req.body;

        if (!board || !title) {
            return res.status(400).json({ message: "Board and Title are required" });
        }

        const existingBoard = await Board.findById(board);
        if (!existingBoard) {
            return res.status(404).json({ message: "Board not found" });
        }

        const newTask = new Task({
            board,
            title,
            description,
            priority: priority || "medium",
            dueDate,
            assignedTo,
            status: status || "todo"
        });

        const savedTask = await newTask.save();

        const io = req.app.get("io");
        if (io) {
            io.to(savedTask.board.toString()).emit("task_created", savedTask);
        }

        return res.status(201).json({
            message: "Task created successfully",
            task: savedTask
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create task",
            error: error.message
        });
    }
});

// Move task
router.patch("/:taskID/move", async (req, res) => {
    const { taskID } = req.params;
    const { status, position } = req.body;

    if (!taskID || !status || position === undefined) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!["todo", "inProgress", "review", "done"].includes(status)) {
        return res.status(400).json({ message: "Invalid Status" });
    }

    if (position <= 0) {
        return res.status(400).json({ message: "Invalid Position" });
    }

    try {
        const task = await Task.findById(taskID);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.status = status;
        task.position = position;
        await task.save();

        const io = req.app.get("io");
        if (io) {
            io.to(task.board.toString()).emit("task_moved", task);
        }

        return res.status(200).json({ message: "Task moved successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Update task
router.patch("/:taskID", async (req, res) => {
    try {
        const { taskID } = req.params;
        if (!taskID) {
            return res.status(400).json({ message: "TaskID is required" });
        }

        const { title, description, priority, dueDate, assignedTo, status } = req.body;

        if (priority && !["low", "medium", "high"].includes(priority)) {
            return res.status(400).json({ message: "Priority can only be low, medium or high" });
        }

        if (status && !["todo", "inProgress", "review", "done"].includes(status)) {
            return res.status(400).json({ message: "Status is invalid" });
        }

        const allowedUpdates = {};
        if (title !== undefined) allowedUpdates.title = title;
        if (description !== undefined) allowedUpdates.description = description;
        if (priority !== undefined) allowedUpdates.priority = priority;
        if (dueDate !== undefined) allowedUpdates.dueDate = dueDate;
        if (assignedTo !== undefined) allowedUpdates.assignedTo = assignedTo;
        if (status !== undefined) allowedUpdates.status = status;

        const updatedTask = await Task.findByIdAndUpdate(
            taskID,
            allowedUpdates,
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        const io = req.app.get("io");
        if (io) {
            io.to(updatedTask.board.toString()).emit("task_updated", updatedTask);
        }

        return res.status(200).json({
            updatedTask,
            message: "Task updated successfully"
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Delete task
router.delete("/:taskID", async (req, res) => {
    try {
        const { taskID } = req.params;
        if (!taskID) {
            return res.status(404).json({ message: "TaskID not found" });
        }

        const deletedTask = await Task.findByIdAndDelete(taskID);
        if (!deletedTask) {
            return res.status(404).json({ message: "No Task found with this ID" });
        }

        const io = req.app.get("io");
        if (io) {
            io.to(deletedTask.board.toString()).emit("task_deleted", {
                taskID: deletedTask._id
            });
        }

        return res.status(200).json({ message: "Task Deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;