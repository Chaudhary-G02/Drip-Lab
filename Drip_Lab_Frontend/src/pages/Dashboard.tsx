import React, {useState, useEffect} from 'react';
import axios from "axios";
import { DripButton} from "../components/DripButton";
import { Link } from "react-router-dom";
import DashboardStats from "../components/DashboardStats";

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({totalItems: 0, totalOutfits: 0});

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/stats');
                setStats({
                    totalItems: response.data.totalItems || 0, totalOutfits: response.data.totalOutfits || 0
                });
            } catch (error) {
                console.error("Dashboard sync failed:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="flex h-[calc(100vh-5rem)] w-full overflow-hidden">
            {/* LEFT SIDE: The Terminal */}
            <div className="w-1/2 p-16 flex flex-col justify-center bg-slate-50 overflow-y-auto no-scrollbar">
                <div className="mb-12">
                    <h1 className="text-6xl font-black italic text-primary tracking-tighter uppercase">Drip Lab</h1>
                    <p className="text-sm font-bold text-gray-400 tracking-[0.3rem] uppercase mt-2">Stylist Terminal
                        V1.0</p>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-10">
                    <div
                        className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-center transition-all hover:shadow-md hover:-translate-y-1">
                        <span
                            className="bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full self-start mb-4">Vault Volume</span>
                        <h2 className="text-7xl font-black text-slate-800 tracking-tighter">{stats.totalItems}</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Pieces in
                            Closet</p>
                    </div>
                    <div
                        className="bg-white p-8 rounded-[2.5rem] shadow-sm border-slate-100 flex flex-col justify-center transition-all hover:shadow-md hover:-translate-y-1">
                        <span
                            className="bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-widest px-4p py-2 rounded-full self-start mb-4">Curation Index</span>
                        <h2 className="text-7xl font-black text-slate-800 tracking-tighter">{stats.totalOutfits}</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Saved Lookbook
                            Outfits</p>
                    </div>
                    <div
                        className="col-span-2 bg-primary p-8 rounded-[2.5rem] text-white shadow-lg flex flex-col justify-center relative overflow-hidden group">
                        {/* Decorative background circle */}
                        <div
                            className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-4 z-10">Recent
                            Activity</h3>
                        <p className="text-sm italic font-medium opacity-80 z-10">Waiting for styling requests...</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <Link to='/closet'
                          className="w-full bg-primary text-white py-5 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-900 transition-all shadow-sm hover:shadow-md">
                        Access Digital Closet
                    </Link>
                    <Link to='/stylist-lab'
                          className="w-full bg-white text-primary border-2 border-slate-100 py-5 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.2em] hover:border-primary hover:bg-slate-50 transition-all shadow-sm hover:shadow-md">
                        Open Stylist Lab
                    </Link>
                    <Link to='/lookbook'
                          className="w-fullbg-primary text-white py-5 roundded-2xl text-center txt-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-900 transition-all shadow-sm hover:shadow-md">
                        View Lookbook
                    </Link>
                </div>
            </div>
            {/* RIGHT SIDE: The Hero Visual */}
            <div className="w-1/2 relative bg-slate-200 shadow-inner">
                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
                     alt="Drip Lab Wardrobe"
                     className="w-full h-full object"
                />
                <div
                    className="absolute inset-0 bg-gradient-to-tr from-primary/90 via-primary/40 to-transparent mix-blend-multiply"></div>
                <div
                    className="absolute bottom-16 right-16 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[2.5rem] animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <p className="text-white font-black italic tracking-widest text-4xl uppercase">Elevate</p>
                    <p className="txt-white/80 text-xs font-bold tracking-[0.4em] uppercase mt-2">Your Digital
                        Aesthetic</p>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;