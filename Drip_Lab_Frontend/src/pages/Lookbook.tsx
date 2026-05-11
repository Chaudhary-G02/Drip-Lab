import React, {useState, useEffect} from 'react';
import axios from 'axios';
import OutfitModal from "../components/OutfitModal";
import {Item, useStore} from "../store/useStore";
import {motion, AnimatePresence} from "framer-motion";
import {Search} from 'lucide-react';

const Lookbook: React.FC = () => {
    const {outfits, isLoading, fetchOutfits} = useStore();
    const [selectedOutfit, setSelectedOutfit] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (outfits.length === 0) {
            fetchOutfits();
        }
    },[outfits.length, fetchOutfits]);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this look from your collection?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/outfits/${id}`);
           fetchOutfits();
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete the outfit. Please try again.");
        }
    }

   const filteredOutfits = outfits.filter(outfit =>
   outfit.name.toLowerCase().includes(searchQuery.toLowerCase()) || outfit.items.some((item: any) => item.name.toLowerCase().includes(searchQuery.toLowerCase())));

    return (
        <div className="max-w-7xl mx-auto px-10 py-20">
            {/* Header and Search Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div>
                    <h2 className="text-4xl font-black text-primary italic uppercase tracking-tighter">My Lookbook</h2>
                    <p className="text-gray-400 text-sm tracking-widest mt-2 uppercase">{isLoading ? "Accessing Archives..." : `${filteredOutfits.length} Curated Looks`}</p>
                </div>

            {/* Search Bar Position */}
            <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400"/>
                </div>
                <input
                type="text"
                placeholder="SEARCH ARCHIVES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 focus:ring-2 focus:ring-primary rounded-2xl text-sm font-bold uppercase tracking-wider transition-all outline-none shadow-sm"
                />
            </div>
            </div>

    {/* Lookbook Grid */}
    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence>
            {filteredOutfits.map((outfit) => (
                <motion.div
                key={outfit._id}
                layout
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, scale: 0.9}}
                transition={{duration: 0.3}}
                className="bg-white rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
                >
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="font-black text-lg text-primary italic uppercase tracking-tight">{outfit.name}</h3>
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                            {new Date(outfit.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>

                    {/* Delete Button */}
                    <button
                        onClick={() => handleDelete(outfit._id)}
                    className="p-1 -mr-2 text-gray-300 hover:text-red-500 transition-colors float-right relative z-10"
                        title="Delete Look">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 71-.867 12.142A2 2 0 0116.138 21H7.862a2 2  0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>

                    {/* Outfit Preview Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6 clear-both">
                        {outfit.items.slice(0,4).map((item) => (
                            <div key={item._id} className="h-32 bg-slate-50 rounded-2xl overflow-hidden border border-gray-50">
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                            </div>
                        ))}
                    </div>

                    <button
                    onClick={() => setSelectedOutfit(outfit)}
                    className="w-full py-4 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:bg-primary hover:text-white transition-all"
                    >
                        View Full Details
                    </button>
                </motion.div>
            ))}
        </AnimatePresence>
    </motion.div>

    {selectedOutfit && (
        <OutfitModal
            outfit={selectedOutfit}
            onClose={() => setSelectedOutfit(null)}
            />
    )}
    {filteredOutfits.length === 0 && !isLoading && (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                {searchQuery ? "No looks match your search" : "No looks saved yet."}
            </p>
        </div>
    )}
    </div>
  );
};

export default Lookbook;