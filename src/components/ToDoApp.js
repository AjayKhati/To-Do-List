import React, { useState, useEffect } from "react";

const TodoApp = () => {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("tasks"));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    const trimmed = input.trim().replace(/^./, c => c.toUpperCase());
    if (!trimmed) return alert("Task cannot be empty.");
    if (tasks.some(t => t.text === trimmed)) return alert("Task already exists.");

    setTasks([{ id: Date.now(), text: trimmed, completed: false }, ...tasks]);
    setInput("");
  };

  const toggleComplete = (id) =>
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const handleDelete = (id) => setTasks(tasks.filter(t => t.id !== id));

  const handleSort = () => {
    const sorted = [...tasks].sort((a, b) =>
      sortAsc ? a.text.localeCompare(b.text) : b.text.localeCompare(a.text)
    );
    setTasks(sorted);
    setSortAsc(!sortAsc);
  };

  const filteredTasks = tasks.filter(t =>
    filter === "completed" ? t.completed :
    filter === "active" ? !t.completed : true
  );

  return (
    <div className="todo-container">
      <h1 className="header">To-Do App</h1>
      <div className="input-group">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAddTask()}
          placeholder="Add your to-do task..."
        />
        <button onClick={handleAddTask}>+</button>
      </div>

      <div className="filters">
        <div>
          {["all", "active", "completed"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? "active" : ""}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={handleSort}>Sort {sortAsc ? "↓" : "↑"}</button>
      </div>

      <ul className="task-list">
        {filteredTasks.length === 0 ? (
          <li className="empty">No tasks to show</li>
        ) : (
          filteredTasks.map(task => (
            <li key={task.id} className="task-item">
              <div className="task-content">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                />
                <span className={task.completed ? "done" : ""}>{task.text}</span>
              </div>
              <button onClick={() => handleDelete(task.id)}>✕</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TodoApp;
