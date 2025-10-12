// services/todoService.js
import API from "../api/axios.js";

export const todoService = {
  // Get all todos for current user
  getTodos: async () => {
    const response = await API.get("/todos");
    
    return response.data;
  },

  // Create new todo
  createTodo: async (todoData) => {
    const response = await API.post("/todos", todoData);
    return response.data;
  },

  // Update todo
  updateTodo: async (id, todoData) => {
    const response = await API.put(`/todos/${id}`, todoData);
    return response.data;
  },

  // Delete todo
  deleteTodo: async (id) => {
    const response = await API.delete(`/todos/${id}`);
    return response.data;
  },

  // Toggle todo completion status
  toggleTodo: async (id, completed) => {
    const response = await API.put(`/todos/${id}`, { completed });
    return response.data;
  },
};
export default todoService;