import React, {useState, useEffect} from 'react';
import axios from 'axios';

const Lookbook: React.FC = () => {
    const [outfits, setOutfits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-lg text-primary italic uppercase">{outfit.name}</h3>
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                {new Date(outfit.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        {/* Outfit Preview Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {outfit.items.slice(0, 4).map((item: any) => (
                                <div key={item._id} className="h-32 bg-slate-50 rounded-2xl overflow-hidden border border-gray-50 ">
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                ))}
                        </div>

                        <button className="w-full py-4 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:bg-primary hover:text-white transition-all">
                            View Full Details
                        </button>
                    </div>
                ))}
            </div>

            {outfits.length === 0 && !loading &&(
                <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No looks saved yet.</p>
                </div>
            )}
        </div>
    );
};

export default Lookbook;