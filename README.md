# Drip-Lab

## Overview
AI-powered personal stylist and digital wardrobe manager using Computer Vision for automated inventory ingestion and LLMs for context-aware outfit recommendations.
Basically, you upload your wardrobe and it uses AI to tell you exactly what to wear based on the weather & occassion.

## Features
**Your Digital Close:** Just upload a picture of all your clothes. The app will automatically remove the background and save it to become your live digital closet with a mind.

**Personal AI Stylist:** Tell the app where you're going and what's the occassion and it'll pick the perfect outfit for you using AI.

**Interactive Lookbook:** Save favourite AI-generated outfits and provide "Fire" or "Miss" feedback to train future styling recommendations.

## Known Bugs
**Animation Scaling:** Occasional layout shifts may occur during rapid state transitions on the Closet grid (mitigated by Framer Motion layout props).

**Chrome DevTools CSP:** A harmless Content Security Policy warning (.well-known/appspecific) may appear in the console due to Chrome extensions attempting to hook into the React app.

**Browser-Specific Layouts:** A minor, unexpected margin/spacing overflow is occasionally visible on the main application layout specifically when rendering in Google Chrome.

**Responsiveness:** The app is not responsive for mobile & small layouts. Furthermmore, the layouts do not use entire width on some screens.

## Tech Stack
#### Frontend:
React (Vite) with TypeScript

Tailwind CSS (Styling & Aesthetic)

Framer Motion (Micro-animations & Layout Transitions)

Zustand (Global State Management)

Axios (HTTP Client)

React Router DOM (Navigation)

Clerk (@clerk/clerk-react) for Authentication

#### Backend:
Node.js & Express

MongoDB & Mongoose (Database)

Clerk SDK (@clerk/clerk-sdk-node) for API Route Protection

Google Gemini API (LLM Styling Engine)

Cloudinary API (Image Hosting)

Remove.bg API (Background Removal)

OpenWeatherMap API (Contextual Weather Data)

## How to use?
1. Create an Account: Sign up using the secure Clerk portal on the homepage.
2. Digitize Your Closet: Navigate to the "Add Item" terminal. Upload a photo of a clothing piece, and the system will automatically process the image and extract metadata (category,color,style).
3. Open the Stylist Lab: Once your closet is stocked, head to the stylist Lab. Enter your city and the scenario (e.g., "Dinner date in the city"). The AI will fetch the local weather and generate a custom fit from your inventory.
4. Curate the Lookbook: Save outfits you love to your Lookbook, where you can easily view your curation index and provide feedback on the AI's styling choices.

## How to run locally 
1. Clone the repository: git clone https://github.com/Chaudhary-G02/Drip-Lab
2. Install dependencies: #In the frontend directory (npm install).  #In the backend directory (npm install)
3. Environment Configuration: Create a .env file in both frontend and backend directories. Frontend.env: VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key 

   Backend.env: CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   GEMINI_API_KEY=your_gemini_key
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   REMOVE_BG_API_KEY=your_removebg_key
   OPENWEATHER_API_KEY=your_openweathermap_key
   MONGO_URI=your_mongodb_connection_string
4. Run the Application: #Terminal 1 (Backend) npm run dev

    #Terminal 2 (Frontend) npm run dev

## AI Usage
Initial Setup: VS Code GitHub Copilot was utilized during the initial project scaffolding to resolve early web loading and configuration issues.

Troubleshooting & UI Bugs: Leveraged AI to debug the Closet's Delete button Axios logic, fix microscopic CSS grid rendering, and resolve Framer Motion layout animation bugs.

Complex Architecture: Assisted in scaffolding the multi-tenant architecture with Clerk middleware and securely filtering MongoDB queries for data isolation.

Help with README file structure and some of its content

## Future Plan 
Automated AI Preference Training: Pipe user "like/dislike" feedback directly back into the Gemini prompt context to heavily personalize future recommendations.

Social Sharing: Allow users to publish their Lookbook outfits to a public feed.

Mobile Application: Port the React frontend to React Native for native iOS and Android experiences.