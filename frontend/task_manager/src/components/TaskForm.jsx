
import { useState } from "react";

const initialFormData = {
    title: "",
    description: "",
    priority: "medium",
    dueDate: ""
};

function TaskForm({ onAddTask }) {
    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setError("Task title is required");
            return;
        }

        try {
            setError("");
            setSubmitting(true);

            await onAddTask({
                ...formData,
                title: formData.title.trim(),
                dueDate: formData.dueDate || null
            });

            setFormData({ ...initialFormData });

        } catch (error) {
            setError(error.message || "Failed to create task");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="form-card">
            <h2>Create New Task</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title *</label>

                    <input
                        id="title"
                        type="text"
                        name="title"
                        placeholder="Enter task title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        maxLength={100}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>

                    <textarea
                        id="description"
                        name="description"
                        placeholder="Enter description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="priority">Priority</label>

                        <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="dueDate">Due Date</label>

                        <input
                            id="dueDate"
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {error && (
                    <p className="error-message" role="alert">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    className="primary-btn"
                    disabled={submitting}
                >
                    {submitting ? "Adding..." : "Add Task"}
                </button>
            </form>
        </div>
    );
}

export default TaskForm;
