// components/TodoList.jsx
import { useState, useEffect } from "react";
import todoService  from "../services/todoService";
import AddTodo from "./AddTodo";
import TodoItem from "./TodoItem"; // ⭐ IMPORT our new component

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  // EXISTING: Fetch todos function
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const todosData = await todoService.getTodos();
  
      setTodos(todosData);
    } catch (err) {
      setError("Failed to fetch todos");
      console.error("Error fetching todos:", err);
    } finally {
      setLoading(false);
    }
  };

  // EXISTING: Add todo function
  const handleAddTodo = async (newTodo) => {
    try {
      const createdTodo = await todoService.createTodo(newTodo);
      setTodos((prev) => [...prev, createdTodo]);
    } catch (err) {
      setError("Failed to add todo");
      console.error("Error adding todo:", err);
    }
  };

  // ⭐ NEW FUNCTION 1: Handle Todo Toggle (Update)
  const handleToggleTodo = async (id, completed) => {
    try {
      // STEP 1: Optimistic UI Update (immediate visual feedback)
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed } : todo
        )
      );

      // STEP 2: Send to Backend (in background)
      await todoService.toggleTodo(id, completed);

      console.log("Todo updated successfully!");
    } catch (err) {
      setError("Failed to update todo");
      console.error("Error updating todo:", err);

      // STEP 3: If API fails, revert by re-fetching from backend
      fetchTodos();
    }
  };

  // ⭐ NEW FUNCTION 2: Handle Todo Delete
  const handleDeleteTodo = async (id) => {
    try {
      // STEP 1: Optimistic UI Update (remove immediately)
      setTodos((prev) => prev.filter((todo) => todo.id !== id));

      // STEP 2: Send to Backend (in background)
      await todoService.deleteTodo(id);

      console.log("Todo deleted successfully!");
    } catch (err) {
      setError("Failed to delete todo");
      console.error("Error deleting todo:", err);

      // STEP 3: If API fails, revert by re-fetching
      fetchTodos();
    }
  };

  // RENDER function (UPDATED to use TodoItem)
  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-4">Loading todos...</div>;
    }

    if (error) {
      return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    return (
      <>
        <AddTodo onAddTodo={handleAddTodo} />

        {todos.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No todos yet. Add your first task above!
          </p>
        ) : (
          <div className="space-y-2">
            {/* ⭐ UPDATE: Use TodoItem instead of direct div */}
            {todos.map((todo) => (
              <TodoItem  
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
              />
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Todo List</h2>
      {renderContent()}
    </div>
  );
};

export default TodoList;
