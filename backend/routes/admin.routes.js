import express from "express";
import verifyToken from "../middlewares/auth.js";
import verifyAdmin from "../middlewares/role.middleware.js";
import getAllUsersController from "../controllers/getAllUsersController .js";
import { getAllTodosController } from "../controllers/adminTodos.controller.js";

const router = express.Router();
router.get("/todos", verifyToken, verifyAdmin, getAllTodosController);
router.get("/users", verifyToken, verifyAdmin, getAllUsersController);
export default router;
