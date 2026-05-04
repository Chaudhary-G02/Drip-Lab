import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from "./pages/Dashboard";
import Closet from './pages/Closet';
import AddItem from "./pages/AddItem";
import StylistLab from "./pages/StylistLab";
import Lookbook from "./pages/Lookbook";

function App() {
    return (
        <Router>
            <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans">
                <Navbar />

                {/* The Routing Switchboard */}
                <main className="flex-1 pt-16">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/Closet" element={<Closet />} />
                        <Route path="/add-item" element={<AddItem />} />
                        <Route path="/stylist-lab" element={<StylistLab />} />
                        <Route path="/lookbook" element={<Lookbook />} />
                    </Routes>
                </main>

                <footer className="w-full text-center py-10 text-[10px] text-gray-300 uppercase tracking-[0.4em]">
                    Drip-Lab Terminal | Status: <span className="text-green-400 font-bold">Online</span>
                </footer>
            </div>
        </Router>
    );
}

export default App;