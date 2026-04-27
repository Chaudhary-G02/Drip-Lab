import * as React from 'react';
import ClothingCard from '../components/ClothingCard';
import {Navigate, useNavigate} from "react-router-dom";

const Closet: React.FC = () => {
    const navigate = useNavigate();
    const myItems = [
        { id: 1, name: "Navy Trench", category: "Outerwear", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500" },
        { id: 2, name: "Classic White Tee", category: "Tops", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500" },
        { id: 3, name: "Indigo Denim", category: "Bottoms", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500" },
    ];

    return(
        <div className="max-w-7xl mx-auto px-10 py-20">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-4xl font-black text-primary italic uppercase tracking-tighter">My Closet</h2>
                    <p className="text-gray-400 text-sm tracking-widest mt-2 uppercase ">{myItems.length} Items Digitized</p>
                </div>
                <button onClick={() => navigate('/add-item')} className="...">
                    + Add New Item
                </button>
            </div>

            {/* The Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {myItems.map(item => (
                    <ClothingCard key={item.id} name={item.name} category={item.category} imageUrl={item.img} />
                ))}
            </div>
        </div>
    );
};

export default Closet;