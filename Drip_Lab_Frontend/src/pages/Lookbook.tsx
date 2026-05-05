import React, {useState, useEffect} from 'react';
import axios from 'axios';
import OutfitModal from "../components/OutfitModal";

const Lookbook: React.FC = () => {
    const [outfits, setOutfits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOutfit, setSelectedOutfit] = useState<any>(null);

    useEffect(() => {
        const fetchOutfits = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/outfits');
                console.log("Lookbook Data Received:", response.data);
                setOutfits(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching looks:", error);
                setLoading(false);
            }
        };
        fetchOutfits();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this look from your collection?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/outfits/${id}`);
            setOutfits(prev => prev.filter(outfit => outfit._id !== id));
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete the outfit. Please try again.");
        }
    }

    const [searchQuery, setSearchQuery] = useState('');
    const filteredOutfits = outfits.filter(outfit =>
    outfit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    outfit.items.some((item: any) => item.nametoLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="max-w-7xl mx-auto px-10 py-20">
            <div className="mb-12">
                <h2 className="text-4xl font-black text-primary italic uppercase tracking-tighter">My Lookbook</h2>
                <p className="text-gray-400 text-sm tracking-widest mt-2 uppercase">
                    {loading ? "Accessing Archives..." : `${outfits.length} Curated Looks`}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {outfits.map((outfit) => (
                    <div key={outfit._id} className="bg-white rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="font-black text-lg text-primary italic uppercase tracking-tight">{outfit.name}</h3>
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                {new Date(outfit.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        {/* Delete Button */}
                        <button
                        onClick={() => handleDelete(outfit._id)}
                        className="p-1 -mr-2 text-gray-300 hover:text-red-500 transition-colors"
                        title="Delete Look"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>

                        <div className="mb-10 relative max-w-md">
                            <input
                            type="text"
                            placeholder="SEARCH YOUR ARCHIVES..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                            />
                            <span className="absolute right-6 top-4 opacity-20">🔍</span>
                        </div>

                        {/* Outfit Preview Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {outfit.items.slice(0, 4).map((item: any) => (
                                <div key={item._id} className="h-32 bg-slate-50 rounded-2xl overflow-hidden border border-gray-50 ">
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                ))}
                        </div>

                        <button
                            onClick={() => {
                                console.log("Detail Button Clicked for:", outfit.name);
                                setSelectedOutfit(outfit);
                            }}
                            className="w-full py-4 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:bg-primary hover:text-white transition-all">
                            View Full Details
                        </button>
                    </div>
                ))}
            </div>

            {selectedOutfit && (
                <OutfitModal outfit={selectedOutfit} onClose={() => setSelectedOutfit(null)}
                />
            )}

            {outfits.length === 0 && !loading &&(
                <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No looks saved yet.</p>
                </div>
            )}
        </div>
    );
};

export default Lookbook;