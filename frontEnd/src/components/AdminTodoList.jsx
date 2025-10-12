// components/AdminTodoList.jsx
import { useState, useEffect } from "react";
import API from "../api/axios";

const AdminTodoList = () => {
  const [allTodos, setAllTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllTodos();
  }, []);

  const fetchAllTodos = async () => {
    try {
      setLoading(true);
      const response = await API.get("/admin/todos");
      setAllTodos(response.data.todos); // Note: your backend returns { todos }
    } catch (err) {
      setError("Failed to fetch todos");
      console.error("Error fetching all todos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await API.delete(`/admin/todos/${todoId}`);
      setAllTodos((prev) => prev.filter((todo) => todo.id !== todoId));
    } catch (err) {
      setError("Failed to delete todo");
      console.error("Error deleting todo:", err);
    }
  };

  if (loading)
    return <div className="text-center py-4">Loading all todos...</div>;
  if (error)
    return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        All Users' Todos
      </h2>
      <p className="text-gray-600 mb-6">
        Admin view - you can see and manage todos from all users
      </p>

      <div className="space-y-3">
        {allTodos.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No todos found in the system.
          </p>
        ) : (
          allTodos.map((todo) => (
            <div
              key={todo.id}
              className={`p-4 border rounded-lg ${
                todo.completed ? "bg-green-50" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3
                    className={`font-medium ${
                      todo.completed
                        ? "line-through text-gray-500"
                        : "text-gray-900"
                    }`}
                  >
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {todo.description}
                    </p>
                  )}
                  <div className="text-xs text-gray-500 mt-2 flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      User: {todo.user_email}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      Role: {todo.user_role}
                    </span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      Created: {new Date(todo.created_at).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded ${
                        todo.completed
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {todo.completed ? "Completed" : "Pending"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700 ml-4 px-3 py-1 border border-red-300 rounded hover:bg-red-50 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminTodoList;
