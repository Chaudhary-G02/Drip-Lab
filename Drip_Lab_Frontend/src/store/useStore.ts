import {create} from 'zustand';
import axios from 'axios';

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