import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClothingCard from '../components/ClothingCard';
import {Navigate, useNavigate} from "react-router-dom";
import {useStore} from "../store/useStore";
import {motion, AnimatePresence} from 'framer-motion';
import {Search} from 'lucide-react';

const Closet: React.FC = () => {
    const navigate = useNavigate();
    const {items, isLoading, fetchItems} = useStore();
    const [selectedGender, setSelectedGender] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (items.length === 0) {
            fetchItems();
        }
    }, [items.length, fetchItems]);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to remove this item?")) {
            try {
                await axios.delete(`http://localhost:3000/items/${id}`);
                fetchItems();
            } catch (error) {
                console.error("Delete failed:", error);
                alert("Could not delete item.");
            }
        }
    };

    const filteredItems = items.filter(item => {
        const matchesGender = selectedGender === 'All' || item.gender === selectedGender;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesGender && matchesSearch;
    });

    const filteredOptions = ['All', 'Men', 'Women', 'Unisex'];

    return (
        <div className="max-w-7xl mx-auto px-10 py-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
                <div>
                    <h2 className="text-4xl font-black text-primary italic uppercase tracking-tighter">My Closet</h2>
                    <p className="text-gray-400 text-sm tracking-widest mt-2 uppercase">
                        {isLoading ? "Scanning Vault..." : `${filteredItems.length} Items Displayed`}
                    </p>
                </div>

                <button
                    onClick={() => navigate('/add-item')}
                    className="bg-primary text-white px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-blue-900 transition-all shadow-xl active:scale-95"
                >
                    + Add New Item
                </button>
            </div>

            {/* Filter & Search Bar Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
                {/* Search Input */}
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400"/>
                    </div>
                    <input
                        type="text"
                        placeholder="SEARCH CLOSET..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-100 border-transparent focus:bg-white focus:border-primary rounded-2xl text-sm font-bold uppercase tracking-wider transition-all outline-none"
                    />
                </div>

                {/* The Filter Tabs */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto">
                    {filteredOptions.map((option) => (
                        <button key={option}
                                onClick={() => setSelectedGender(option)}
                                className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                                    selectedGender === option ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* The Grid with Framer Motion */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence>
                    {filteredItems.map((item) => (
                        <motion.div
                            key={item._id}
                            layout
                            initial={{opacity: 0, scale: 0.9}}
                            animate={{opacity: 1, scale: 0.2}}
                            exit={{opacity: 0, scale: 0.9}}
                            transition={{duration: 0.2}}
                        >
                            <ClothingCard
                                id={item._id}
                                name={item.name}
                                category={item.category}
                                imageUrl={item.imageUrl}
                                onDelete={handleDelete}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredItems.length === 0 && !isLoading && (
                <div className="text-center py-24 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                        {searchQuery ? "No items match your search" : `No ${selectedGender} items found`}
                    </p>
                    <button
                        onClick={() => {
                            setSelectedGender('All');
                            setSearchQuery('');
                        }}
                        className="mt-4 text-primary font-black text-xs uppercase underline"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default Closet;