import express from 'express';
import { configDotenv } from 'dotenv';
configDotenv();
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import todoRoutes from './routes/todo.routes.js';
const PORT = process.env.PORT
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/todos", todoRoutes);
app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));