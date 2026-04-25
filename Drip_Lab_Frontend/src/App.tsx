import Navbar from "./components/Navbar";
import Closet from './pages/Closet';

function App() {
    return (
        <div className="min-h-screen w-full bg-slate-50 flex flex-col">
            <Navbar />
            <main className="flex-1 pt-10">
                <Closet />
            </main>

            <footer className="w-full text-center py-8 text-[10px] text-gray-300 uppercase tracking-widest">
                Drip-Lab Terminal | Status: <span className="text-green-400 font-bold">Encrypted</span>
            </footer>
        </div>
    );
}

export default App;