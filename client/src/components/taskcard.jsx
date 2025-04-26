import './components.css';

function TaskCard({ title, desc, onDelete, onUpdate }) {
  return (
    <div className="task-list-modification">
      <h2 className="task-title">{title}</h2>
      <p className="task-desc">{desc}</p>
      <div className="task-actions">
        <button 
          aria-label="delete-task-button" 
          onClick={onDelete}
          className="delete-btn"
        >
          Delete
        </button>
        <button 
          aria-label="update-task-button" 
          onClick={onUpdate}
          className="update-btn"
        >
          Update
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
