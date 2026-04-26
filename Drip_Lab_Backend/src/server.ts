import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
        message: "Drip-Lab API is live!",
        status: "Healthy"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${ PORT }`);
});