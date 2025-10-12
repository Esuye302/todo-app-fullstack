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

// services/todo.service.js
export const updateTodoService = async (userId, todoId, data) => {
  const { title, description, completed } = data;
  
  // Build dynamic update query based on what fields are provided
  const updates = [];
  const values = [];
  
  if (title !== undefined) {
    updates.push("title = ?");
    values.push(title);
  }
  if (description !== undefined) {
    updates.push("description = ?");
    values.push(description);
  }
  if (completed !== undefined) {
    updates.push("completed = ?");
    values.push(completed);
  }
  
  if (updates.length === 0) {
    throw new Error("No fields to update");
  }
  
  // Add WHERE clause values
  values.push(todoId, userId);
  
  await query(
    `UPDATE todos SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
    values
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
