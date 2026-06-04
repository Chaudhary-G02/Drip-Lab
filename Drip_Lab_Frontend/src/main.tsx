// @ts-nocheck
import  React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {ClerkProvider} from "@clerk/clerk-react";
import axios from "axios";

declare global {
    interface Window {
        Clerk: any,
    }
}
axios.interceptors.request.use(async (config) =>{
    if (window.Clerk && window.Clerk.session) {
        const token = await window.Clerk.session.getToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
const PUBLISHABLE_KEY = (import.meta as any).env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl={"/"}>
            <App />
        </ClerkProvider>
    </React.StrictMode>
)