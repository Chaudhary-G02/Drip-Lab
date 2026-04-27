import React, { useState } from 'react';
import axios from 'axios';
import {Navigate, useNavigate} from 'react-router-dom';

const AddItem: React.FC = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Tops');
    const [imageUrl, setImageUrl] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/items/test', {
                name,
                category,
                imageUrl
            });
            alert("Item added to your Digital Closet!");
            navigate('/closet');
        } catch (error) {
            console.error("Error adding item:", error);
            alert("Failed to connect to the server. Is your backend running?");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-black italic text-primary mb-6 uppercase tracking-tighter">Digitize Item</h2>

            <form onSubmit={handleSubmit} className="Space-y-6">
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Item Name</label>
                    <input
                    type="text"
                    className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="e.g. Oversized Black Hoodie"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Category</label>
                    <select
                    className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-primary outline-none"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    >
                        <option>Tops</option>
                        <option>Bottoms</option>
                        <option>Outerwear</option>
                        <option>Shoes</option>
                    </select>
                </div>

                <div>
                    <label
                    className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Image URL</label>
                    <input
                    type="text"
                    className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Paste image link here..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                    />
                </div>

                <button
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-blue-900 shadow-lg active:scale-95"
                >
                    Add to Closet
                </button>
            </form>
        </div>
    );
};

export default AddItem;