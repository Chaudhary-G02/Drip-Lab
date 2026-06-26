import {Link, NavLink} from 'react-router-dom';
import * as React from 'react';
import { SignedIn, SignedOut, UserButton} from "@clerk/clerk-react";

const Navbar: React.FC = () => {
    const linkStyles =({ isActive }: {isActive: boolean}) =>
        `font-semibold uppercase text-xs tracking-widest transition-colors ${ 
            isActive ? 'text-primary' : 'text-gray-400 hover:text-primary'
        }`;

    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm flex items-center justify-between px-6 py-4">
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
                <SignedIn>
                    <UserButton afterSignOutUrl="/" appearance={{elements: {userButtonPopoverFooter: "hidden"}}} />
                </SignedIn>
                <SignedOut>
                    <Link to="/sign-in" className="bg-primary text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-blue-900 transition-all">
                        Sign In
                    </Link>
                </SignedOut>
            </div>
        </nav>
    );
};
export default Navbar;