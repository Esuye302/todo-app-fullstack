import query from "../config/db.js";

export const getAllTodosService = async () => {
  
  const todos = await query(
    `SELECT todos.*, users.email 
     FROM todos 
     JOIN users ON todos.user_id = users.id`
  );
  return todos;
};
