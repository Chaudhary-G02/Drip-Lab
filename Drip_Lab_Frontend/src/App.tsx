import { DripButton } from "./components/DripButton";
import Navbar from "./components/Navbar";

function App() {
    const handleAction = (feature: string) => {
        console.log(`${feature} clicked!`);
    };
    return (
        <div className="min-h-screen w-full bg-slate-50 flex flex-col font-brand">
            {/* The Navbar */}
            <Navbar/>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 pt-28">
                {/* Brand Header */}
                <div className="text-center mb-12">
                    <h1 className="text-primary text-7xl font-black italic tracking-tighter">
                        DRIP LAB
                    </h1>
                    <p className="text-gray-400 mt-2 font-medium tracking-[0.3em] uppercase text-sm">
                        Stylist Terminal v1.0
                    </p>
                </div>

                {/* Buttons Grid */}
                <div className="w-full max-w-sm">
                    <DripButton
                        title="Access Digital Closet"
                        onPress={() => handleAction("Closet")}
                    />
                    <DripButton
                        title="Open Stylist Lab"
                        variant="accent"
                        onPress={() => handleAction("AI Lab")}
                    />
                </div>
            </main>

            {/* Status Footer */}
            <footer className="w-full text-center py-8 text-[10px] text-gray-300 uppercase tracking-widest">
                system Status: <span className="text-green-400 font-bold ">Online</span> | User: <span
                className="text-primary font-bold">Krish</span>
            </footer>
        </div>
    );
}

export default App;