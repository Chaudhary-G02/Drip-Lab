import * as React from 'react';

const Navbar: React.FC = () => {
    return (
        <nav className="w-full h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 fixed top-0 z-50">
            {/* Brand Logo */}
            <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xs italic">DL</span>
            </div>
            <span className="text-primary font-black italic tracking-tighter text-xl">
              DRIP LAB
            </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
                <a href="#" className ="text-gray-500 hover:text-primary font-semibold transition-colors uppercase text-xs tracking-widest">Dashboard</a>
                <a href="#" className ="text-gray-500 hover:text-primary font-semibold transition-colors uppercase text-xs tracking-widest">Closet</a>
                <a href="#" className ="text-gray-500 hover:text-primary font-semibold transition-colors uppercase text-xs tracking-widest">Stylist Lab</a>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
                <button className="bg-slate-100 text-primary px-4 py-2 rounded-full text-xs uppercase tracking-wider hover:bg-accent transition-all">
                    My Account
                </button>
            </div>
        </nav>
    );
};
export default Navbar;