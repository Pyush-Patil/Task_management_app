
import { useEffect, useState } from "react";
import "./App.css";
import { socket } from "./socket";

const API_URL = "http://localhost:5000/api";
const columns = ["todo", "inProgress", "review", "done"];

const emptyTaskForm = {
  title: "",
  description: "",
  priority: "medium",
  dueDate: "",
  assignedTo: ""
};

function App() {
  const [boardId, setBoardId] = useState("");
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [boardForm, setBoardForm] = useState({ title: "", createdBy: "" });
  const [memberInput, setMemberInput] = useState("");
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editForm, setEditForm] = useState(emptyTaskForm);
  const [message, setMessage] = useState("");

  async function fetchBoardData(currentBoardId) {
    if (!currentBoardId) {
      setTasks([]);
      setBoard(null);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/boards/${currentBoardId}`);
      const data = await response.json();

      if (response.ok) {
        setBoard(data.board);
        setTasks(data.tasks || []);
      } else {
        setMessage(data.message || "Board not found");
        setTasks([]);
        setBoard(null);
      }
    } catch (error) {
      setMessage("Could not load board data");
    }
  }

  useEffect(() => {
    socket.connect();

    socket.on("task_created", () => {
      if (boardId) fetchBoardData(boardId);
    });

    socket.on("task_updated", () => {
      if (boardId) fetchBoardData(boardId);
    });

    socket.on("task_deleted", () => {
      if (boardId) fetchBoardData(boardId);
    });

    socket.on("task_moved", () => {
      if (boardId) fetchBoardData(boardId);
    });

    return () => {
      socket.off("task_created");
      socket.off("task_updated");
      socket.off("task_deleted");
      socket.off("task_moved");
      socket.disconnect();
    };
  }, [boardId]);

  useEffect(() => {
    if (boardId) {
      fetchBoardData(boardId);
      socket.emit("join_board", { boardID: boardId, member: "User" });
    }
  }, [boardId]);

  async function createBoard(event) {
    event.preventDefault();

    if (!boardForm.title || !boardForm.createdBy) {
      setMessage("Board title and createdBy are required");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/boards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(boardForm)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Board creation failed");
        return;
      }

      setBoardId(data.board._id);
      setBoard(data.board);
      setBoardForm({ title: "", createdBy: "" });
      setMessage("Board created successfully");
      fetchBoardData(data.board._id);
    } catch (error) {
      setMessage("Something went wrong while creating the board.");
    }
  }

  async function addMember() {
    if (!boardId || !memberInput.trim()) {
      setMessage("Please enter a member name");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/boards/${boardId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member: memberInput })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Member could not be added");
        return;
      }

      setMemberInput("");
      setMessage("Member added successfully");
      fetchBoardData(boardId);
    } catch (error) {
      setMessage("Member add failed");
    }
  }

  async function addTask(event) {
    event.preventDefault();

    if (!boardId || !taskForm.title.trim()) {
      setMessage("Board and task title are required");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...taskForm,
          board: boardId,
          status: "todo"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Task could not be created");
        return;
      }

      setTaskForm(emptyTaskForm);
      setMessage("Task created successfully");
      fetchBoardData(boardId);
    } catch (error) {
      setMessage("Task creation failed");
    }
  }

  async function moveTask(taskId, status) {
    const position = tasks.filter(task => task.status === status).length + 1;

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}/move`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, position })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Task move failed");
        return;
      }

      setMessage("Task moved successfully");
      fetchBoardData(boardId);
    } catch (error) {
      setMessage("Could not move task");
    }
  }

  function startEdit(task) {
    setSelectedTask(task._id);
    setEditForm({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "medium",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      assignedTo: task.assignedTo || ""
    });
  }

  async function saveEdit(event) {
    event.preventDefault();

    if (!selectedTask) return;

    try {
      const response = await fetch(`${API_URL}/tasks/${selectedTask}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Task update failed");
        return;
      }

      setSelectedTask(null);
      setEditForm(emptyTaskForm);
      setMessage("Task updated successfully");
      fetchBoardData(boardId);
    } catch (error) {
      setMessage("Task update failed");
    }
  }

  async function deleteTask(taskId) {
    const confirmDelete = window.confirm("Delete this task?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Delete failed");
        return;
      }

      setMessage("Task deleted successfully");
      fetchBoardData(boardId);
    } catch (error) {
      setMessage("Delete failed");
    }
  }

  function formatStatus(status) {
    if (status === "inProgress") return "In Progress";
    if (status === "review") return "Review";
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  return (
    <div className="app">
      <header>
        <h2>TaskBoard</h2>
        <span>Simple team board</span>
      </header>

      <main className="container">
        <section className="panel">
          <h3>Create Board</h3>
          <form onSubmit={createBoard} className="board-form">
            <input
              type="text"
              placeholder="Board title"
              value={boardForm.title}
              onChange={e => setBoardForm({ ...boardForm, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Created by"
              value={boardForm.createdBy}
              onChange={e => setBoardForm({ ...boardForm, createdBy: e.target.value })}
            />
            <button type="submit">Create Board</button>
          </form>
        </section>

        <section className="panel">
          <h3>Board Details</h3>
          <div className="board-info">
            <input
              type="text"
              placeholder="Board ID"
              value={boardId}
              onChange={e => setBoardId(e.target.value)}
            />
            <button type="button" onClick={() => fetchBoardData(boardId)}>Open Board</button>
          </div>

          {board && (
            <div className="board-meta">
              <p><strong>Title:</strong> {board.title}</p>
              <p><strong>Created by:</strong> {board.createdBy}</p>
              <div className="member-box">
                <input
                  type="text"
                  placeholder="Add member"
                  value={memberInput}
                  onChange={e => setMemberInput(e.target.value)}
                />
                <button type="button" onClick={addMember}>Add Member</button>
              </div>
              <div className="member-list">
                {board.members && board.members.length > 0 ? (
                  board.members.map((member, index) => (
                    <span key={index}>{member}</span>
                  ))
                ) : (
                  <small>No members yet</small>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="panel">
          <h3>Add Task</h3>
          <form onSubmit={addTask} className="task-form">
            <input
              type="text"
              placeholder="Task title"
              value={taskForm.title}
              onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={taskForm.description}
              onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
            />
            <div className="task-row">
              <select
                value={taskForm.priority}
                onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <input
                type="date"
                value={taskForm.dueDate}
                onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              />
            </div>

            <input
              type="text"
              placeholder="Assigned to"
              value={taskForm.assignedTo}
              onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
            />

            <button type="submit">Create Task</button>
          </form>
        </section>

        {message && <p className="message">{message}</p>}

        {boardId && (
          <section className="kanban">
            {columns.map(status => (
              <div
                className="column"
                key={status}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  const taskId = e.dataTransfer.getData("taskId");
                  if (taskId) moveTask(taskId, status);
                }}
              >
                <h3>{formatStatus(status)}</h3>

                {tasks.filter(task => task.status === status).length === 0 ? (
                  <div className="empty-column">No tasks here</div>
                ) : (
                  tasks
                    .filter(task => task.status === status)
                    .map(task => (
                      <div
                        className="task-card"
                        key={task._id}
                        draggable
                        onDragStart={e => e.dataTransfer.setData("taskId", task._id)}
                      >
                        <h4>{task.title}</h4>
                        <p>{task.description || "No description"}</p>
                        <small>Priority: {task.priority || "medium"}</small>
                        <small>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}</small>
                        <small>Assigned: {task.assignedTo || "Unassigned"}</small>

                        <div className="task-actions">
                          <button type="button" onClick={() => startEdit(task)}>Edit</button>
                          <button type="button" className="danger" onClick={() => deleteTask(task._id)}>Delete</button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            ))}
          </section>
        )}

        {selectedTask && (
          <div className="modal">
            <div className="modal-box">
              <h3>Edit Task</h3>
              <form onSubmit={saveEdit} className="task-form">
                <input
                  type="text"
                  placeholder="Task title"
                  value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                />
                <textarea
                  placeholder="Description"
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                />

                <div className="task-row">
                  <select
                    value={editForm.priority}
                    onChange={e => setEditForm({ ...editForm, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>

                  <input
                    type="date"
                    value={editForm.dueDate}
                    onChange={e => setEditForm({ ...editForm, dueDate: e.target.value })}
                  />
                </div>

                <input
                  type="text"
                  placeholder="Assigned to"
                  value={editForm.assignedTo}
                  onChange={e => setEditForm({ ...editForm, assignedTo: e.target.value })}
                />

                <div className="task-actions">
                  <button type="submit">Save Changes</button>
                  <button type="button" className="secondary" onClick={() => setSelectedTask(null)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
