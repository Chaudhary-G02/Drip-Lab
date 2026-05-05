import React,{useEffect, useState} from 'react';
import axios from 'axios';

const Profile = () => {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error("Stats Error:", err));
    }, []);

    if (!stats) return <div className="p-10 text-center">Loading your Drip-Stats...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Closet Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Items Card */}
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <p className="text-blue-600 font-semibold uppercase text-xs tracking-widest">Total Inventory</p>
                    <h2 className="text-4xl font-black text-blue-900">{stats.totalItems} Items</h2>
                </div>
                {/* Total Outfits Card */}
                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                    <p className="text-purple-600 font-semibold uppercase text-xs tracking-widest">Created Looks</p>
                    <h2 className="text-4xl font-black text-purple-900">{stats.totalOutfits} Outfits</h2>
                </div>
            </div>
            {/* Latest AI Look Section */}
            {stats.latestLook && (
                <div className="mt-10 p-6 bg-slate-900 text-white rounded-3xl">
                    <h3 className="text-xl font-bold mb-4">Latest AI Recommendation</h3>
                    <p className="text-slate-400 italic">"{stats.latestLook.name}"</p>
                </div>
            )}
        </div>
    );
};

export default Profile;
