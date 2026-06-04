import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp} from "@clerk/clerk-react";
import Navbar from './components/Navbar';
import Dashboard from "./pages/Dashboard";
import Closet from './pages/Closet';
import AddItem from "./pages/AddItem";
import StylistLab from "./pages/StylistLab";
import Lookbook from "./pages/Lookbook";
import Profile from "./pages/Profile";
import {Home} from "lucide-react";

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    return (
        <>
        <SignedIn>{children}</SignedIn>
        <SignedOut><RedirectToSignIn /></SignedOut>
        </>
    );
};

function App() {
    return (
        <Router>
            <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans">
                <Navbar />

                {/* The Routing Switchboard */}
                <main className="flex-1 pt-16 flex flex-col">
                <Routes>
                    <Route path="/sign-in/*" element={
                        <div className="flex-1 flex justify-center mt-20">
                            <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up"/>
                        </div>
                    } />
                    <Route path="/signup/*" element={
                        <div className="flex-1 flex justify-center items-center mt-20">
                            <SignUp routing="path" path="/sign-up" signInUrl="/sign-in"/>
                        </div>
                    } />
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/closet" element={<ProtectedRoute><Closet /></ProtectedRoute>} />
                    <Route path="/add-item" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
                    <Route path="/stylist-lab" element={<ProtectedRoute><StylistLab /></ProtectedRoute>} />
                    <Route path="/lookbook" element={<ProtectedRoute><Lookbook /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
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