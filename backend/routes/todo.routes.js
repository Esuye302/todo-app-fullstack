// routes/todo.routes.js
import express from "express";
import verifyToken from "../middlewares/auth.js";
import {
  createTodoController,
  getTodosController,
  getTodoByIdController,
  updateTodoController,
  deleteTodoController,
} from "../controllers/todo.controller.js";

const router = express.Router();

// all routes protected
router.use(verifyToken);

router.post("/", createTodoController);
router.get("/", getTodosController);
router.get("/:id", getTodoByIdController);
router.put("/:id", updateTodoController);
router.delete("/:id", deleteTodoController);

export default router;
