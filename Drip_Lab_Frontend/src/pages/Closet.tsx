import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClothingCard from '../components/ClothingCard';
import {Navigate, useNavigate} from "react-router-dom";

const Closet: React.FC = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGender, setSelectedGender] = useState('All');

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to remove this item?")) {
            try {
                await axios.delete(`http://localhost:5000/api/items/${id}`);
                setItems(prevItems => prevItems.filter(item => item._id !== id));
            } catch (error) {
                console.error("Delete failed:", error);
                alert(("Could not delete item."));
            }
        }
    };

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/items');
                setItems(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching closet:", error);
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const filteredItems = selectedGender === 'All'
        ? items
        : items.filter(item => item.gender === selectedGender);

    const filteredOptions = ['All', 'Men', 'Women', 'Unisex'];

    return (
        <div className="max-w-7xl mx-auto px-10 py-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div>
                    <h2 className="text-4xl font-black text-primary italic uppercase tracking-tighter">My Closet</h2>
                    <p className="text-gray-400 text-sm tracking-widest mt-2 uppercase">
                        {loading ? "Scanning Vault..." : `${filteredItems.length} Items Displayed`}
                    </p>
                </div>

                {/* The Filter Tabs */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                    {filteredOptions.map((option) => (
                        <button
                            key={option}
                            onClick={() => setSelectedGender(option)}
                            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                                selectedGender === option
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => navigate('/add-item')}
                    className="bg-primary text-white px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-blue-900 transition-all shadow-xl active:sclae:95"
                >
                    + Add New Item
                </button>
            </div>

            {/* The Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredItems.map((item) => (
                    <ClothingCard key={item._id}
                                  id={item._id}
                                  name={item.name}
                                  category={item.category}
                                  imageUrl={item.imageUrl}
                                  onDelete={handleDelete}
                    />
                ))}
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 && !loading && (
                <div className="text-center py-24 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No {selectedGender} items
                        found</p>
                    <button
                        onClick={() => setSelectedGender('All')}
                        className="mt-4 text-primary font-black text-xs uppercase underline"
                    >
                        View All Items
                    </button>
                </div>
            )}
        </div>
    );
};

export default Closet;