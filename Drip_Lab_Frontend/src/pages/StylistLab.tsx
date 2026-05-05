import React, { useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const StylistLab: React.FC = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [outfitName, setOutfitName] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [scenario, setScenario] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const[aiReasoning, setAiReasoning] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/items');
                setItems(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching items:", error);
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const handleAISuggestion = async () => {
        if (!scenario) return alert("Enter a scenario for the AI!");
        setIsGenerating(true);
        try {
            const response = await axios.post('http://localhost:5000/api/ai/recommend',{scenario});
            const {reasoning, selectedIds} = response.data;

            const suggestedItems = items.filter(i => selectedIds.includes(i._id));
            setSelectedItems(suggestedItems);
            setAiReasoning(reasoning);
            setOutfitName(`${scenario.slice(0, 15)}...Look`);
        } catch (error) {
            console.error("AI Error:", error);
            alert("The Stylist is busy. Try again later.");
        } finally {
            setIsGenerating(false);
        }
    };

    const toggleItemSelection = (item: any) => {
        if (selectedItems.find(i => i._id === item._id)) {
            setSelectedItems(selectedItems.filter(i => i._id !== item._id));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const handleSaveOutfit = async () => {
        if (!outfitName) return alert("Give your drip a name!");
        if (selectedItems.length < 2) return alert("An outfit needs at least 2 items!");

        try {
            await axios.post('http://localhost:5000/api/outfits', {
                name: outfitName,
                itemIds: selectedItems.map(i => i._id)
            });
            alert("Outfit saved to your collection!");
            navigate('/closet');
        } catch (error) {
            console.error("Save failed:", error);
        }
    };

    const categories = ['All', 'Tops', 'Bottoms', 'Outerwear','Shoes'];
    const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(i => i.category === activeCategory);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden pt-16">
            {/* LEFT SIDE: The Wardrobe Section */}
            <div className="w-1/2 border-r border-slate-200 bg-white flex flex-col">
                <div className="p-8 pb-4">
                    <h2 className="text-3xl font-black italic uppercase text-primary tracking-tighter">Wardrobe</h2>
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
                        {categories.map(cat => (
                            <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 grid grid-cols-2 gap-4">
                    {filteredItems.map(item => (
                        <div
                        key={item._id}
                        onClick={() => toggleItemSelection(item)}
                        className={`relative group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all ${selectedItems.find(i => i._id === item._id) ? 'border-primary shadow-lg scale-[0.98]' : 'border-transparent opacity-80 hover:opacity-100'}`}
                        >
                            <img src={item.imageUrl} alt={item.name} className="h-48 w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                <p className="text-white text-[10px] font-bold uppercase tracking-widest">{item.name}</p>
                            </div>
                            {selectedItems.find(i => i._id === item._id) && (
                                <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT SIDE: AI Canvas */}
            <div className="flex-1 p-12 flex flex-col bg-slate-50">
                <div className="bg-white p-6 rounded-[2.5rem] shadow-sm mb-8 border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary text-white p-3 rounded-2xl animate-pulse">
                            <span className="text-xl">🤖</span>
                        </div>
                        <input
                        type="text"
                        placeholder="TELL THE AI YOUR SCENARIO (e.g. College fest...)"
                        value={scenario}
                        onChange={(e) => setScenario(e.target.value)}
                        className="flex-1 bg-slate-50 rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                            onClick={handleAISuggestion}
                        disabled={isGenerating}
                        className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-900 disabled:opacity-50 transition-all"
                        >
                            {isGenerating ? "Reasoning..." : "Generate Look"}
                        </button>
                    </div>
                    {aiReasoning && (
                        <p className="mt-4 px-4 text-[10px] font-bold text-blue-500 uppercase italic tracking-wider">
                            AI Reasoning: {aiReasoning}
                        </p>
                    )}
                </div>

                <div className="flex justify-between items-center mb-6">
                    <input
                    type="text"
                    placeholder="NAME YOUR LOOK..."
                    value={outfitName}
                    onChange={(e) => setOutfitName(e.target.value)}
                    className="bg-transparent text-xl font-black italic uppercase text-primary outline-none border-b-2 border-primary/20 w-1/2"
                    />
                    <button
                    onClick={handleSaveOutfit}
                    className="bg-white border-2 border-primary text-primary px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all"
                    >
                        Save Look to Atlas
                    </button>
                </div>

                <div className="flex-1 bg-white rounded-[3rem] shadow-inner border border-slate-100 relative flex flex-wrap items-center justify-center p-10 gap-6 overflow-y-auto">
                    {selectedItems.length === 0 ? (
                        <div className="text-center opacity-20">
                            <span className="text-8xl">🧥</span>
                            <p className="font-black uppercase tracking-[0.5em] mt-4">Select items to start styling</p>
                        </div>
                    ) : (
                        selectedItems.map(item => (
                            <div key={item._id} className="w-48 bg-slate-50 p-2 rounded-2xl shadow-sm border border-slate-100 relative group animate-in fade-in zoom-in duration-300">
                                <img src={item.imageUrl} alt={item.name} className="h-48 w-full object-cover rounded-xl" />
                                <button onClick={(e) => {e.stopPropagation(); toggleItemSelection(item); }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default StylistLab;