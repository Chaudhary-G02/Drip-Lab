import { ClerkExpressRequireAuth} from "@clerk/clerk-sdk-node";
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

// @ts-ignore
const API_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000';

dotenv.config();
console.log("__________________________________");
console.log("Loaded Keys:", Object.keys(process.env).filter(key => key.includes('API') || key.includes('Key')));
const geminikey = process.env.GEMINI_API_KEY;
console.log("Checking API Key...", geminikey ? "Key Found" : "Key Missing");
console.log("___________________________________");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ['http://localhost:5173', 'https://drip-lab-frontend.vercel.app'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.get('/api/health', (req: Request, res: Response) => {
    res.json({
        message: "Drip-Lab API is Live!",
        status: "Healthy"
    });
});
app.use('/api', ClerkExpressRequireAuth());

const genAI = new GoogleGenerativeAI(geminikey || "");
const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

app.post('/api/ai/recommend', async (req: any, res: Response) => {
    try {
        const {scenario, location} = req.body;
        const userId = req.auth.userId;
        console.log("🤖 AI Request - Scenario:", scenario, "|Location:", location || "Not provided");
        const closetItems = await Item.find({userId}).select('name category gender color style _id');
        if (!closetItems.length) {
            return res.status(400).json({error: "Your Closet is empty. Add items first!"});
        }
        let weatherContext = "Unknown weather conditions. Assume a mild, general climate.";
        if (location) {
            try {
                console.log(`🌤️ Fetching weather for ${location}...`);
                const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`);
                if (weatherRes.ok) {
                    const weatherData = await weatherRes.json();
                    const temp = weatherData.main.temp;
                    const condition = weatherData.weather[0].description;
                    weatherContext = `${temp}°C (${Math.round((temp * 9 / 5) + 32)}°F) and ${condition}.`;
                    console.log("Weather fetched:", weatherContext);
                } else {
                    console.log("Weather API error. Proceeding without weather context.");
                }
            } catch (err) {
                console.error("Failed to fetch weather:", err);
            }
        }

        const prompt = `
        Context: You are a professional, high-end fashion stylist.
        User's Closet: ${JSON.stringify(closetItems)}
        Task Details: 
        - Scenario: "${scenario}"
        - Current Weather Context: ${weatherContext}
        Instructions:
        Pick 2-4 items from the User's Closet that perfectly match the Scenario AND the Weather Context.
        Make sure not to suggest heavy coats for hot weather or shorts for freezing weather. 
        Ensure the style and colors coordinate well.
        Requirement: Return ONLY a JSON object. No markdown formatting. No conversational text.
        Structure: 
        { "reasoning": "Explain why these items work for thr scenario and the weather",
                       "selectedIds:["id1", "id2"]
        }  
        `;

        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
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

app.post('/api/items', upload.single('image'), async (req: any, res: Response) => {
    try {
        let {name, category, gender} = req.body;

        if (!req.file || !req.file.buffer) {
            return res.status(400).json({error: "Image upload failed."});
        }
        console.log("✂️ Removing background...");

        const originalBase64 = req.file.buffer.toString('base64');
        const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {'X-Api-Key': process.env.REMOVE_BG_API_KEY as string, 'Content-Type': 'application/json'},
            body: JSON.stringify({
                image_file_b64: originalBase64,
                size: 'auto'
            })
        });
        if (!removeBgResponse.ok) {
            const errText = await removeBgResponse.text();
            console.error("Remove.bg error:", errText);
            throw new Error("Failed to remove background.");
        }
        const noBgArrayBuffer = await removeBgResponse.arrayBuffer();
        const noBgBuffer = Buffer.from(noBgArrayBuffer);
        const noBgBase64 = noBgBuffer.toString('base64');
        console.log("☁️ Uploading transparent image to Cloudinary...");

        const imageUrl: string = await new Promise((resolve,reject) => {
            const stream = cloudinary.uploader.upload_stream({folder: 'drip_lab_closet', format: 'png'},
                (error, result) => {
                    if (result) resolve(result.secure_url);
                    else reject(error);
                }
            );
            stream.end(noBgBuffer);
        });

        let aiColor = undefined;
        let aiStyle = undefined;

        try {
            console.log("🧠 Analyzing transparent image with Gemini Vision...");

            const prompt = `Analyze this clothing item. Return ONLY a JSON object with the following keys. No markdown formatting, just the raw JSON.
        {"category": "Choose one: Tops, Bottoms, Outerwear, Shoes, Accessories",
        "color": "Primary color (e.g., navy Blue, Heather Grey, Black, Red)",
        "style": "Style vibe (e.g., Casual, Streetwear, Formal, Athletic, Vintage)"}`;

            const result = await model.generateContent([prompt,
                {
                    inlineData: {
                        data: noBgBase64,
                        mimeType: req.file.mimetype || 'image/png'
                    }
                }
            ]);

            const responseText = await result.response.text();
            console.log("Raw Vision Response:", responseText);
            const firstBracket = responseText.indexOf('{');
            const lastBracket = responseText.lastIndexOf('}');
            if (firstBracket !== -1 && lastBracket !== -1) {
                const jsonString = responseText.substring(firstBracket, lastBracket + 1);
                const aiTags = JSON.parse(jsonString);
                if (!category || category === '') {
                    category = aiTags.category;
                }
                aiColor = aiTags.color;
                aiStyle = aiTags.style;

                if (!name || name === '') {
                    name = `${aiColor} ${category} - ${aiStyle}`;
                }
            }
        } catch (aiError) {
            console.error("AI Auto-Tagging failed, falling back to manual tags:", aiError);
        }
        const newItem = new Item({
            userId: req.auth.userId,
            name: name || "Unnamed Item",
            category: category || 'Accessories',
            gender: gender || 'Unisex',
            imageUrl,
            color: aiColor,
            style: aiStyle
        });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error: any) {
        console.error("Upload error:", error.message);
        res.status(500).json({error: error.message});
    }
});

app.get('/api/items', async (req: any, res: Response) => {
    try {
        const userId= req.auth.userId;
        console.log(`Querying clothes database for user: ${userId}`);
        const items = await Item.find({userId: userId
        }).sort({ createdAt: -1 });
        console.log(`Successfully dispatched ${items.length} wardrobe items back to client.`);
        res.json(items);
    } catch (error: any) {
        console.error("Database query exception encountered:", error.message);
        res.status(500).json({error: "Failed to fetch items."});
    }
});

app.delete('/api/items/:id', async (req: any, res: Response) => {
    try {
        const userId = req.auth.userId;
        const deleteItem = await Item.findOneAndDelete({ _id: req.params.id, userId});
        if (!deleteItem) {
            return res.status(404).json({ error: "Item not found or unauthorized" });
        }
        if (deleteItem) {
            const urlParts = deleteItem.imageUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];
            const publicId = `drip_lab_closet/${fileName.split('.')[0]}`;
            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted image from Cloudinary: ${publicId}`);
        }
        res.json({ message: "Item deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete item" });
    }
});

app.post('/api/outfits', async (req: any, res: Response) => {
    try {
        const { name, itemIds } = req.body;
        const userId = req.auth.userId;

        const newOutfit = new Outfit({
            userId,
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

app.get('/api/outfits', async (req: any, res: Response) => {
    try {
        const userId  = req.auth.userId;
        const outfits = await Outfit.find({userId: userId
        }).populate('items').sort({ createdAt: -1});
        console.log(`Sending ${outfits.length} outfits to frontend`);
        res.json(outfits);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch outfits"});
    }
})

app.patch('/api/outfits/:id/feedback', async (req: any, res: Response) => {
    try {
        const {feedback} = req.body;
        const userId = req.auth.userId;
        if (!['like', 'dislike', 'none'].includes(feedback)) {
            return res.status(400).json({error: "Invalid feedback value."});
        }
        const updatedOutfit = await Outfit.findOneAndUpdate(
            { _id: req.params.id, userId },
            {feedback},
            {new: true}
        ).populate('items');
        if (!updatedOutfit) {
            return res.status(404).json({error: "Outfit not found or unauthorized."});
        }
        res.json(updatedOutfit);
    } catch (error: any) {
        console.error("Feedback Error:", error.message);
        res.status(500).json({error: "Failed to save feedback."});
    }
});

app.delete('/api/outfits/:id', async (req: any, res: Response) => {
    try {
        const userId = req.auth.userId;
        const deleteOutfit = await Outfit.findOneAndDelete(req.params.id);

        if (!deleteOutfit) {
            return res.status(404).json({ error: "Outfit not found" });
        }

        console.log(`🗑️Deleted Outfit: ${req.params.id}`);
        res.json({message: "Outfit deleted successfully."});
    } catch (error: any) {
        res.status(500).json({error: "Failed to delete Outfit"});
    }
});

app.get('/api/stats', async (req: any, res: Response) => {
    try {
        const userId = req.auth.userId;
        console.log(`Compiling dashboard analytics metrics for user: ${userId}`);
        const totalItems = await Item.countDocuments({userId: userId
        });
        const totalOutfits = await Outfit.countDocuments({userId: userId
        });

        res.json({
            totalItems,
            totalOutfits,
            favouriteBrand:"Coming Soon",
            mostWornColor: "Coming Soon"
        });
    } catch (error: any) {
        console.error("Stats Engine Failure:", error.message);
        res.status(500).json({ error: "Failed to fetch stats",
            details: error.message
        });
    }
});

app.use((err: any, req: any, res: Response, next: any) => {
    if (err.message === 'Unauthenticated') {
        return res.status(401).json({error: "Unauthorized: Invalid or missing clerk token."});
    }
    console.error(err.stack);
    res.status(500).json({error: "Internal Server Error"});
})

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