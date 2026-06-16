import {create} from 'zustand';
import axios from 'axios';
import DashboardStats from "../components/DashboardStats";

// @ts-ignore
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

declare global {
    interface Window {
        Clerk: any,
    }
}

export interface Item {
    _id : string;
    name: string;
    category: string;
    gender: string;
    imageUrl: string;
}

export interface Outfit {
    _id: string;
    name: string;
    items: Item[];
    createdAt?: string;
    reasoning?: string;
    feedback?: 'like' | 'dislike';
}

export  interface DashboardStats {
    totalItems: number;
    totalOutfits: number;
}

interface DripState {
    items: Item[];
    outfits: Outfit[];
    stats: DashboardStats | null;
    isLoading: boolean;
    error: string | null;

    fetchItems: (token: string) => Promise<void>;
    fetchOutfits: () => Promise<void>;
    fetchStats: () => Promise<void>;
}

export const useStore = create<DripState>((set, get ) => ({
    items: [],
    outfits: [],
    stats: null,
    isLoading: false,
    error: null,

    fetchItems: async () => {
        if (get().isLoading) return;

        set({isLoading: true, error: null});
        try {
            const response = await axios.get(`${API_URL}/api/items`);
            set({items: response.data, isLoading: false});
        } catch (error: any) {
            set({error: error.message, isLoading: false});
        }
    },

    fetchStats: async () => {
        try{
            const response = await axios.get(`${API_URL}/api/stats`,)
            set({stats: response.data});
        } catch (error: any) {
            console.error("Failed to update dashboard telemetry cache:", error.message);
        }
    },

    fetchOutfits: async () => {
        set ({isLoading: true, error: null});
        try {
            const response = await axios.get(`${API_URL}/api/outfits`);
            set({outfits: response.data, isLoading: false});
        } catch (error: any) {
            set({error: error.message, isLoading: false});
        }
    }
}));