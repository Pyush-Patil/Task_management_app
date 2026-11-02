
function TaskItem({
    task,
    onUpdateTask,
    onDeleteTask,
    isBusy
}) {
    const handleStatusChange = (e) => {
        onUpdateTask(task._id, {
            status: e.target.value
        });
    };

    const handleDelete = () => {
        onDeleteTask(task._id);
    };

    return (
        <div className="task-card">
            <div className="task-details">
                <h3>{task.title}</h3>

                <p>
                    {task.description || "No description"}
                </p>

                <div className="task-meta">
                    <span className={`priority ${task.priority}`}>
                        {task.priority}
                    </span>

                    <span className="due-date">
                        Due: {
                            task.dueDate
                                ? new Date(task.dueDate).toLocaleDateString()
                                : "Not set"
                        }
                    </span>
                </div>
            </div>

            <div className="task-actions">
                <select
                    value={task.status}
                    onChange={handleStatusChange}
                    disabled={isBusy}
                    aria-label={`Status for ${task.title}`}
                >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>

                <button
                    type="button"
                    className="delete-btn"
                    onClick={handleDelete}
                    disabled={isBusy}
                >
                    {isBusy ? "Please wait..." : "Delete"}
                </button>
            </div>
        </div>
    );
}

export default TaskItem;
