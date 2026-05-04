import {Link, NavLink} from 'react-router-dom';
import * as React from 'react';

const Navbar: React.FC = () => {
    const linkStyles =({ isActive }: {isActive: boolean}) =>
        `font-semibold uppercase text-xs tracking-widest transition-colors ${ 
            isActive ? 'text-primary' : 'text-gray-400 hover:text-primary'
        }`;

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
                <NavLink to="/" className={linkStyles}>
                    Dashboard
                </NavLink>
                <NavLink to="/closet" className={linkStyles}>
                    Closet
                </NavLink>
                <NavLink to="/stylist-lab" className={linkStyles}>
                    StylistLab
                </NavLink>
                <NavLink to="/lookbook" className={linkStyles}>
                    Lookbook
                </NavLink>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
                <button className="bg-slate-100 text-primary px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                    My Account
                </button>
            </div>
        </nav>
    );
};
export default Navbar;