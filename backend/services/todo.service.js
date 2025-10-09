// services/todo.service.js
import query from "../config/db.js";

export const createTodoService = async (userId, todoData) => {
  const { title, description } = todoData;
  const result = await query(
    "INSERT INTO todos (title, description, user_id) VALUES (?, ?, ?)",
    [title, description, userId]
  );
  return { id: result.insertId, title, description, user_id: userId };
};

export const getTodosService = async (userId) => {
  const rows = await query("SELECT * FROM todos WHERE user_id = ?", [userId]);
  return rows;
};

export const getTodoByIdService = async (userId, todoId) => {
  const rows = await query(
    "SELECT * FROM todos WHERE id = ? AND user_id = ?",
    [todoId, userId]
  );
  return rows[0]; // return single todo
};

export const updateTodoService = async (userId, todoId, data) => {
  const { title, description, completed } = data;
  await query(
    "UPDATE todos SET title = ?, description = ?, completed = ? WHERE id = ? AND user_id = ?",
    [title, description, completed, todoId, userId]
  );
  return { id: todoId, ...data };
};

export const deleteTodoService = async (userId, todoId) => {
  await query("DELETE FROM todos WHERE id = ? AND user_id = ?", [
    todoId,
    userId,
  ]);
  return { message: "Todo deleted successfully" };
};
