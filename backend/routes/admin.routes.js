import express from "express";
import verifyToken from "../middlewares/auth.js";
import verifyAdmin from "../middlewares/role.middleware.js";
import getAllUsersController from "../controllers/getAllUsersController .js";
import { loginController } from "../controllers/auth.controller.js";
const router = express.Router();

router.get("/users", verifyToken, verifyAdmin, getAllUsersController);
export default router;
