import express, {Request, response, Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import  multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from "multer-storage-cloudinary";
import connectDB from './config/db';
import Item from './models/Item';
import Outfit from './models/Outfit';
import {GoogleGenerativeAI} from "@google/generative-ai";

dotenv.config();
console.log("__________________________________");
console.log("Loaded Keys:", Object.keys(process.env).filter(key => key.includes('API') || key.includes('Key')));
const geminikey = process.env.GEMINI_API_KEY;
console.log("Checking API Key...", geminikey ? "Key Found" : "Key Missing");
console.log("___________________________________");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(geminikey || "");
const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});

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

app.post('/api/ai/recommend', async (req: Request, res: Response) => {
    try {
        const {scenario} = req.body;
        console.log("AI Request for Scenario:", scenario);
        const closetItems = await Item.find().select('name category gender _id');
        if (!closetItems.length) {
            return res.status(400).json({error: "Your Closet is empty. Add items first!"});
        }
        const prompt = `
        Context: You are a professional fashion stylist.
        User's Closet: ${JSON.stringify(closetItems)}
        Task: Pick 2-4 items for this scenario: "${scenario}"
        Requirement: Return ONLY a JSON object. No conversational text.
        Structure:
        {
        "reasoning": "string",
        "selectedIds": ["id1", "id2"]
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();
        console.log("AI Raw Response:", responseText);

        if (!responseText) {
            throw new Error("Gemini returned an empty response.");
        }
        const firstBracket = responseText.indexOf('{');
        const lastBracket = responseText.lastIndexOf('}');

        if (firstBracket === -1 || lastBracket === -1) {
            console.error("No JSON found in response:", responseText);
            return res.status(500).json({error: "AI response was not in a valid format."});
        }

        const jsonString = responseText.substring(firstBracket, lastBracket + 1);

        try {
            const recommendation = JSON.parse(jsonString);
            res.json(recommendation);
        } catch (parseError) {
            console.error("JSON Parse Error:", jsonString);
            res.status(500).json({error: "AI failed to generate suggestion."});
        }
    } catch (error: any) {
        console.error("AI Stylist Error:", error.message);
        res.status(500).json({error: "AI failed to generate suggestion."});
    }
});

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
    } catch (error: any) {
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

app.post('/api/outfits', async (req: Request, res: Response) => {
    try {
        const { name, itemIds } = req.body;
        console.log("Saving Outfit:", {name, itemIds});

        const newOutfit = new Outfit({
            name,
            items: itemIds
        });

        const savedOutfit = await newOutfit.save();
        if (savedOutfit) {
            console.log("Confirmed: Outfit saved to Atlas with ID:", savedOutfit._id);
        }
        const populatedOutfit = await savedOutfit.populate('items');
        res.status(201).json(populatedOutfit);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/outfits', async (req, res) => {
    try {
        const outfits = await Outfit.find().populate('items').sort({ createdAt: -1});
        console.log(`Sending ${outfits.length} outfits to frontend`);
        res.json(outfits);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch outfits"});
    }
})

app.delete('/api/outfits/:id', async (req: Request, res: Response) => {
    try {
        const deleteOutfit = await Outfit.findByIdAndDelete(req.params.id);

        if (!deleteOutfit) {
            return res.status(404).json({ error: "Outfit not found" });
        }

        console.log(`🗑️Deleted Outfit: ${req.params.id}`);
        res.json({message: "Outfit deleted successfully."});
    } catch (error: any) {
        res.status(500).json({error: "Failed to delete Outfit"});
    }
});

app.get('/api/stats', async (req: Request, res: Response) => {
    try {
        const itemCount = await Item.countDocuments();
        const outfitCount = await Outfit.countDocuments();
        const latestOutfit = await Outfit.findOne()
            .sort({ createdAt: -1 })
            .populate('items');
        res.json({
            totalItems: itemCount,
            totalOutfits: outfitCount,
            latestLook: latestOutfit
        });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch stats" });
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