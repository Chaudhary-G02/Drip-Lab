import {useState } from "react";
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
import {useAuth} from "@clerk/clerk-react";
import axios from "axios";
import {useEffect} from "react";
import config from "tailwindcss/defaultConfig";

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    return (
        <>
        <SignedIn>{children}</SignedIn>
        <SignedOut><RedirectToSignIn /></SignedOut>
        </>
    );
};

const AxiosInterceptor = ({children}: {children: React.ReactNode}) => {
    const {getToken} = useAuth();
    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        const interceptor = axios.interceptors.request.use(async (config) => {
           const token = await getToken();
           if (token) {
               config.headers.Authorization = `Bearer ${token}`;
           } else {
               throw new axios.Cancel("Auth token not ready yet, cancelling ghost request.");
           }
           return config;
        });
        setIsReady(true);
        return () => axios.interceptors.response.eject(interceptor);
    }, [getToken]);
    if (!isReady) return null;
    return <>{children}</>;
};

function App() {
    return (
        <Router>
            <AxiosInterceptor>
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
            </AxiosInterceptor>
        </Router>
    );
}

export default App;