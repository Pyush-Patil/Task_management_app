
const express = require("express");

const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require("../controller/taskController");

const router = express.Router();

// Create a new task
router.post("/", createTask);

// Get all tasks (filtering and sorting)
router.get("/", getTasks);

// Get a single task by ID
router.get("/:id", getTaskById);

// Update a task
router.put("/:id", updateTask);

// Delete a task
router.delete("/:id", deleteTask);

module.exports = router;
