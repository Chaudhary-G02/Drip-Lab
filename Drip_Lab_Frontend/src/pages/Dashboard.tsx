import React, {useState, useEffect} from 'react';
import axios from "axios";
import { DripButton} from "../components/DripButton";
import { useNavigate } from "react-router-dom";
import DashboardStats from "../components/DashboardStats";

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Dashboard sync failed:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center pt-20 px-6">
            {/* Brand Header */}
            <div className="text-center mb-12">
                <h1 className="text-primary text-7xl font-black italic tracking-tighter">
                    DRIP LAB
                </h1>
                <p className="text-gray-400 mt-2 font-medium tracking-[0.3em] uppercase text-sm">
                    Stylist Terminal v1.0
                </p>
            </div>

            <div className="w-full mb-12">
                <DashboardStats stats={stats} />
            </div>

            {/* Main Controls */}
            <div className="w-full max-w-sm flex flex-col gap-4">
                <DripButton
                    title= "Access Digital Closet"
                    onPress={() => navigate('/Closet')}
                    />
                <DripButton
                    title = "Open Stylist Lab"
                    variant="accent"
                    onPress={() => navigate('/StylistLab')}
                    />
                <DripButton
                title = "View Lookbook"
                onPress={() => navigate('/Lookbook')}
                />
            </div>
        </div>
    );
};

export default Dashboard;