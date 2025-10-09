// controllers/todo.controller.js
import {
  createTodoService,
  getTodosService,
  getTodoByIdService,
  updateTodoService,
  deleteTodoService,
} from "../services/todo.service.js";

export const createTodoController = async (req, res) => {
 


  try {
    const userId = req.user.id;
    const todo = await createTodoService(userId, req.body);
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTodosController = async (req, res) => {
  try {
    const userId = req.user.id;
    const todos = await getTodosService(userId);
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTodoByIdController = async (req, res) => {
  try {
    const userId = req.user.id;
    const todoId = req.params.id;
    const todo = await getTodoByIdService(userId, todoId);
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTodoController = async (req, res) => {
  try {
    const userId = req.user.id;
    const todoId = req.params.id;
    const updated = await updateTodoService(userId, todoId, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTodoController = async (req, res) => {
  try {
    const userId = req.user.id;
    const todoId = req.params.id;
    const result = await deleteTodoService(userId, todoId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
