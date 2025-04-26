import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Tasklist() {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [tasktime, setTasktime] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedTaskTime, setEditedTaskTime] = useState("");

  const navigate = useNavigate();
  const currentDateTime = new Date().toISOString().slice(0, 16);

  const getTokenHeader = () => {
    const token = localStorage.getItem("refreshToken");
    return {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
  };

  const sortTasksByDeadline = (tasks) => {
    return tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/fetchtasks", getTokenHeader());
      setTasks(sortTasksByDeadline(response.data));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!task.trim() || !description.trim() || !tasktime.trim()) return console.error("Empty task");
    const newTask = { title: task, description: description, deadline: tasktime };

    try {
      const response = await axios.post("http://localhost:5000/api/addtasks", newTask, getTokenHeader());
      setTasks((prev) => sortTasksByDeadline([...prev, response.data]));
      setTask("");
      setDescription("");
      setTasktime("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/deletetasks/${id}`, getTokenHeader());
      if (response.status === 200) {
        setTasks(tasks.filter((t) => t._id !== id));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditTask = (index) => {
    const task = tasks[index];
    setEditIndex(index);
    setEditedTask(task.title);
    setEditedDescription(task.description || "");
    setEditedTaskTime(task.deadline);
  };

  const handleSaveTask = async () => {
    const taskToEdit = tasks[editIndex];
    const updatedTask = {
      title: editedTask,
      description: editedDescription,
      deadline: editedTaskTime,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/updatetasks/${taskToEdit._id}`,
        updatedTask,
        getTokenHeader()
      );

      if (response.status === 200) {
        const updatedTasks = [...tasks];
        updatedTasks[editIndex] = { ...taskToEdit, ...updatedTask };
        setTasks(sortTasksByDeadline(updatedTasks));
        setEditIndex(null);
        setEditedTask("");
        setEditedDescription("");
        setEditedTaskTime("");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <div className="top">
        <h1>Task List</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="task-list-cont">
        <div className="tasks-list">
          {tasks.map((t, index) => (
            <div key={t._id} className="task-card">
              {editIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editedTask}
                    onChange={(e) => setEditedTask(e.target.value)}
                  />
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    placeholder="Edit description"
                  ></textarea>
                  <input
                    type="datetime-local"
                    value={editedTaskTime}
                    onChange={(e) => setEditedTaskTime(e.target.value)}
                    min={currentDateTime}
                  />
                  <button onClick={handleSaveTask}>Save</button>
                </>
              ) : (
                <>
                  <p><strong>Task:</strong> {t.title}</p>
                  {t.description && <p><strong>Description:</strong> {t.description}</p>}
                  <p><strong>Deadline:</strong> {new Date(t.deadline).toLocaleString()}</p>
                  <button onClick={() => handleEditTask(index)}>Edit</button>
                  <button onClick={() => handleDeleteTask(t._id)}>Delete</button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="task-list-input">
          <input
            type="text"
            placeholder="Add task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <input
            type="datetime-local"
            value={tasktime}
            onChange={(e) => setTasktime(e.target.value)}
            min={currentDateTime}
          />
          <button onClick={handleAddTask}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default Tasklist;
