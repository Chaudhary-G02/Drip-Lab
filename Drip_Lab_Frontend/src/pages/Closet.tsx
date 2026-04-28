import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClothingCard from '../components/ClothingCard';
import {Navigate, useNavigate} from "react-router-dom";

const Closet: React.FC = () => {
    const navigate = useNavigate();
    const [items, setItems] =useState<any[]>([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('https://localhost:5000/api/items');
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching closet:", error);
            }
        };
        fetchItems();
    }, []);

    return(
        <div className="max-w-7xl mx-auto px-10 py-20">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-4xl font-black text-primary italic uppercase tracking-tighter">My Closet</h2>
                    <p className="text-gray-400 text-sm tracking-widest mt-2 uppercase ">{items.length} Items Digitized</p>
                </div>
                <button onClick={() => navigate('/add-item')} className="...">
                    + Add New Item
                </button>
            </div>

            {/* The Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {items.map(item => (
                    <ClothingCard key={item.id} name={item.name} category={item.category} imageUrl={item.img} />
                ))}
            </div>
        </div>
    );
};

export default Closet;