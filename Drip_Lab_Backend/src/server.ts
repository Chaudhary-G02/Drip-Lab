import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import Item from './models/Item';

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


app.post('/api/items/test', async (req, res) => {
    try {
        const {name, category, gender, imageUrl, brand} = req.body;
        console.log("Received Data:", {name, category,  gender });

        const newItem = new Item({
            name,
            category,
            gender: gender || 'Unisex',
            imageUrl,
            brand
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error: any) {
        console.error("Mongoose Error:", error.message);
        res.status(500).json({error: error.message });
    }
});

app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch items" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${ PORT }`);
});