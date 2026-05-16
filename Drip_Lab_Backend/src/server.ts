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

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

app.post('/api/ai/recommend', async (req: Request, res: Response) => {
    try {
        const {scenario, location} = req.body;
        console.log("🤖 AI Request - Scenario:", scenario, "|Location:", location || "Not provided");
        const closetItems = await Item.find().select('name category gender color style _id');
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

app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
        message: "Drip-Lab API is live!",
        status: "Healthy"
    });
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

        res.json({
            totalItems: itemCount,
            totalOutfits: outfitCount,
            latestLook: await Outfit.findOne().sort({ createdAt: -1 }).populate('items')
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