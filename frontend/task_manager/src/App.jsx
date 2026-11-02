
import { useState, useEffect } from "react";

import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";

import {
    getTasks,
    createTask,
    updateTask,
    deleteTask
} from "./services/taskService.jsx";

import "./App.css";

function App() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");
    const [busyTaskId, setBusyTaskId] = useState(null);

    // Fetch tasks
    useEffect(() => {
        let isMounted = true;

        const fetchTasks = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getTasks();

                if (isMounted) {
                    setTasks(data);
                }
            } catch (error) {
                if (isMounted) {
                    setError(
                        error.response?.data?.message ||
                        "Failed to fetch tasks"
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchTasks();

        return () => {
            isMounted = false;
        };
    }, []);

    // Create task
    const handleAddTask = async (taskData) => {
        try {
            const newTask = await createTask(taskData);

            setTasks(prev => [newTask, ...prev]);
            setError("");

        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Failed to create task";

            throw new Error(message);
        }
    };

    // Update task
    const handleUpdateTask = async (id, updatedData) => {
        try {
            setBusyTaskId(id);
            setError("");

            const updatedTask = await updateTask(id, updatedData);

            setTasks(prev =>
                prev.map(task =>
                    task._id === id ? updatedTask : task
                )
            );

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update task"
            );
        } finally {
            setBusyTaskId(null);
        }
    };

    // Delete task
    const handleDeleteTask = async (id) => {
        try {
            setBusyTaskId(id);
            setError("");

            await deleteTask(id);

            setTasks(prev =>
                prev.filter(task => task._id !== id)
            );

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete task"
            );
        } finally {
            setBusyTaskId(null);
        }
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <div>
                    <h1>Task Manager</h1>
                    <p>Organize your work and stay productive.</p>
                </div>
            </header>

            <main className="main-content">
                <TaskForm onAddTask={handleAddTask} />

                {error && (
                    <div className="error-banner" role="alert">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="loading">
                        Loading tasks...
                    </div>
                ) : (
                    <TaskList
                        tasks={tasks}
                        filter={filter}
                        setFilter={setFilter}
                        onUpdateTask={handleUpdateTask}
                        onDeleteTask={handleDeleteTask}
                        busyTaskId={busyTaskId}
                    />
                )}
            </main>
        </div>
    );
}

export default App;
