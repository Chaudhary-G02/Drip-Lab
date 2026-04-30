import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import  multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from "multer-storage-cloudinary";
import connectDB from './config/db';
import Item from './models/Item';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'drip_lab_closet',
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        };
    },
});

const upload = multer({ storage: storage });

app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
        message: "Drip-Lab API is live!",
        status: "Healthy"
    });
});

app.post('/api/items', upload.single('image'), async (req: any, res: Response) => {
    try {
        const {name, category, gender} = req.body;
        const imageUrl = req.file ? req.file.path : '';

        if (!imageUrl) {
            return res.status(400).json({error: "Image upload failed."});
        }

        const newItem = new Item({
            name,
            category,
            gender: gender || 'Unisex',
            imageUrl
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error: any)  {
    console.error("Upload Error:", error.message);
    res.status(500).json({error: error.message});
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

app.delete('/api/items/:id', async (req, res) => {
    try {
        const deleteItem = await Item.findByIdAndDelete(req.params.id);
        if (!deleteItem) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.json({ message: "Item deleted successfully." });
        } catch (error) {
        res.status(500).json({ error: "Failed to delete item" });
    }
});

connectDB()
    .then(() => {
        app.listen(PORT, () => {
      console.log(`Database Connected & Server running at http://localhost:${PORT}`);
    });
})
.catch((err) => {
    console.error("Database connection failed. Server not started.", err);
    process.exit(1);
});