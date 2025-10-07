import expres from 'express';
import { configDotenv } from 'dotenv';
configDotenv();
import authRoutes from './routes/auth.routes.js';
const PORT = process.env.PORT || 5000;
const app = expres();
app.use(expres.json());
import dotenv from "dotenv";
dotenv.config();



app.use('/api/auth', authRoutes);


app.listen(PORT, console.log(`server running on http://localhost:${PORT}`));