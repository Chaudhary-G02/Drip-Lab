import * as React from 'react';
import { DripButton} from "../components/DripButton";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

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

            {/* Main Controls */}
            <div className="w-full max-w-sm">
                <DripButton
                    title= "Access Digital Closet"
                    onPress={() => navigate('/Closet')}
                    />
                <DripButton
                    title = "Open Stylist Lab"
                    variant="accent"
                    onPress={() => console.log('AI Lab is locked')}
                    />
            </div>
        </div>
    );
};

export default Dashboard;