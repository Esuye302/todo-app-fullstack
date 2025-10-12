
// This component receives THREE props from its parent (TodoList)
const TodoItem = ({ todo, onToggle, onDelete }) => {
  // FUNCTION 1: Handle checkbox toggle
  const handleToggle = () => {
    // Call parent's function with todo ID and new completed status
    onToggle(todo.id, !todo.completed);
  };

  // FUNCTION 2: Handle delete button
  const handleDelete = () => {
    // Call parent's function with todo ID to delete
    onDelete(todo.id);
  };

  // RENDER: How this todo looks
  return (
    <div
      className={`flex items-center justify-between p-4 border rounded-lg mb-2 ${
        // Dynamic styling based on completion status
        todo.completed ? "bg-gray-50" : "bg-white"
      }`}
    >
      {/* LEFT SIDE: Checkbox + Todo Content */}
      <div className="flex items-center space-x-3 flex-1">
        {/* Checkbox for completion status */}
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
        />

        {/* Todo Content */}
        <div className="flex-1">
          <h3
            className={`font-medium ${
              // Strike-through text if completed
              todo.completed ? "line-through text-gray-500" : "text-gray-900"
            }`}
          >
            {todo.title}
          </h3>
          {/* Show description only if it exists */}
          {todo.description && (
            <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Delete Button */}
      <button
        onClick={handleDelete}
        className="text-red-500 hover:text-red-700 ml-4 px-3 py-1 border border-red-300 rounded hover:bg-red-50"
      >
        Delete
      </button>
    </div>
  );
};

export default TodoItem;
