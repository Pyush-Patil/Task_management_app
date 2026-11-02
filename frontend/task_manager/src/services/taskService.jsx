
import axios from "axios";

const API = axios.create({
    baseURL:"http://localhost:5000"
});

// GET all tasks
export const getTasks = async (params = {}) => {
    const response = await API.get("/tasks", { params });
    return response.data.data;
};

// POST create task
export const createTask = async (taskData) => {
    const response = await API.post("/tasks", taskData);
    return response.data.data;
};

// PUT update task
export const updateTask = async (id, taskData) => {
    const response = await API.put(`/tasks/${id}`, taskData);
    return response.data.data;
};

// DELETE task
export const deleteTask = async (id) => {
    const response = await API.delete(`/tasks/${id}`);
    return response.data;
};
