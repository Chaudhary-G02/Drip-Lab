import {create} from 'zustand';
import axios from 'axios';
declare global {
    interface Window {
        Clerk: any,
    }
}
axios.interceptors.request.use(async (config) => {
    if (window.Clerk && window.Clerk.session) {
        const token = await window.Clerk.session.getToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {return Promise.reject(error);
});

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

interface DripState {
    items: Item[];
    outfits: Outfit[];
    isLoading: boolean;
    error: string | null;

    fetchItems: () => Promise<void>;
    fetchOutfits: () => Promise<void>;
}

export const useStore = create<DripState>((set) => ({
    items: [],
    outfits: [],
    isLoading: false,
    error: null,

    fetchItems: async () => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.get('http://localhost:5000/api/items');
            set({items: response.data, isLoading: false});
        } catch (error: any) {
            set({error: error.message, isLoading: false});
        }
    },

    fetchOutfits: async () => {
        set ({isLoading: true, error: null});
        try {
            const response = await axios.get('http://localhost:5000/api/outfits');
            set({outfits: response.data, isLoading: false});
        } catch (error: any) {
            set({error: error.message, isLoading: false});
        }
    }
}));