import { getAllTodosService } from "../services/adminTodos.service.js";

export const getAllTodosController = async (req, res) => {
  try {
    const todos = await getAllTodosService();
    res.status(200).json({ todos });
  } catch (error) {
    console.error("Error fetching all todos:", error);
    res.status(500).json({ message: "Failed to get todos" });
  }
};
