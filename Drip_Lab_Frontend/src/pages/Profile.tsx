import React,{useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const Profile = () => {
    const [stats, setStats] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/api/stats')
            .then(res => {
                console.log("RAW FROM SERVER:", res.data);
                setStats(res.data);
            })
        .catch(err => console.log("Stats Error:", err));
    }, []);

    if (!stats) return <div className="p-10 text-center font-bold">Initializing Terminal...</div>;

    return (
         <div className="min-h-screen bg-slate-50 p-8">
             <div className="max-w-5xl mx-auto">
                 {/* The Header Section */}
                 <div className="text-center mb-12">
                     <h1 className="text-5xl font-black text-[#000080] italic tracking-tighter">DRIP LAB</h1>
                     <p className="text-slate-400 font-bold tracking-[0.2em] text-sm mt-2">STYLIST TERMINAL V1.0</p>
                 </div>

                 {/* Stats Cards Row */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                     {/* Vault Volume */}
                     <div className="bg-white p-8 rounded-[30px] shadow-sm border border-slate-100 relative overflow-hidden">
                         <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Vault Volume</span>
                         <h2 className="text-6xl font-black text-slate-800 mt-4">{stats.totalItems}</h2>
                         <p className="text-slate-400 font-bold text-xs uppercase mt-2">Pieces in Closet</p>
                     </div>

                     {/* Curation Index */}
                     <div className="bg-white p-8 rounded-[30px] shadow-sm border border-slate-100">
                         <span className="bg-purple-100 text-purple-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Curation Index</span>
                         <h2 className="text-6xl font-black text-slate-800 mt-4">{stats.totalOutfits}</h2>
                         <p className="text-slate-400 font-bold text-xs uppercase mt-2">Saved Lookbook Outfit</p>
                     </div>

                     {/* Recent Activity Card */}
                     <div className="bg-[#000080] p-8 rounded-[30px] text-white shadow-lg">
                         <span className="text-blue-300 text-[10px] font-black uppercase tracking-widest">Recent Activity</span>
                         {stats.latestLook ? (
                             <div className="mt-4">
                                 <h3 className="text-2xl font-black italic uppercase leading-tight">
                                     {stats.latestLook.name.replace('Look','')} <br/> W...LOOK
                                 </h3>
                                 <p className="text-blue-400 text-[10px] font-bold mt-4 uppercase tracking-widest">
                                     Last Curated: {new Date(stats.latestLook.createdAt).toLocaleString()}
                                 </p>
                             </div>
                         ) : (
                             <p className="mt-4 text-blue-300 italic">No activity recorded.</p>
                         )}
                     </div>
                 </div>

                 {/* Action Buttons Layer */}
                 <div className="flex flex-col gap-4 max-w-md mx-auto">
                     <button
                     onClick={() => navigate('/closet')}
                     className="bg-[#000080] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-900 transition-all shadow-md"
                     >
                         Access Digital Closet
                     </button>
                     <button
                     onClick={() => navigate('/stylist-lab')}
                     className="bg-white text-[#000080] border-2 border-slate-100 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                     >
                         Open Stylist Lab
                     </button>
                     <button
                     onClick={() => navigate('/lookbook')}
                     className="bg-[#000080] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-900 transition-all shadow-md"
                     >
                         View Lookbook
                     </button>
                 </div>
             </div>
         </div>
    );
};

export default Profile;
