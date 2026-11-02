
import TaskItem from "./TaskItem.jsx";

function TaskList({
    tasks,
    filter,
    setFilter,
    onUpdateTask,
    onDeleteTask,
    busyTaskId
}) {
    const filteredTasks = filter === "all"
        ? tasks
        : tasks.filter(task => task.status === filter);

    return (
        <div className="task-list-section">
            <div className="list-header">
                <h2>My Tasks ({filteredTasks.length})</h2>

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    aria-label="Filter tasks by status"
                >
                    <option value="all">All Tasks</option>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>

            {filteredTasks.length === 0 ? (
                <p className="empty-message">
                    No tasks found. Create a new task!
                </p>
            ) : (
                <div className="tasks-container">
                    {filteredTasks.map(task => (
                        <TaskItem
                            key={task._id}
                            task={task}
                            onUpdateTask={onUpdateTask}
                            onDeleteTask={onDeleteTask}
                            isBusy={busyTaskId === task._id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default TaskList;
