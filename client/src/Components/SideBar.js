import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function SideBar({ userRole }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        Cookies.remove('email');
        window.location.href = '/login';
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <>
            <button
                className="md:hidden p-4 focus:outline-none"
                onClick={toggleSidebar}
            >
                <svg
                    className="w-6 h-6 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
            <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out bg-gradient-to-br from-slate-700 to-cyan-400 text-white w-64 flex flex-col`}>
                <div className="p-4 text-center font-bold text-2xl border-b border-gray-700">
                    {userRole === 'admin' ? 'Admin Panel' : 'User Panel'}
                </div>
                <div className="flex-grow p-4">
                    <nav className="flex flex-col space-y-4">
                        <Link onClick={handleLinkClick} className="hover:bg-gray-700 p-2 font-bold text-gray-400 rounded">
                            Home
                        </Link>
                        {userRole === 'admin' ? (
                            <>
                                <Link onClick={handleLinkClick} className="hover:bg-gray-700 p-2 font-bold text-gray-400 rounded">
                                    Manage Templates
                                </Link>
                                <Link onClick={handleLinkClick} className="hover:bg-gray-700 p-2 font-bold text-gray-400 rounded">
                                    User Details
                                </Link>
                            </>
                        ) : (
                            <Link onClick={handleLinkClick} className="hover:bg-gray-700 p-2 font-bold text-gray-400 rounded">
                                Saved Templates
                            </Link>
                        )}
                        <Link onClick={handleLinkClick} className="hover:bg-gray-700 p-2 font-bold text-gray-400 rounded">
                            Settings
                        </Link>
                        <button className="hover:bg-gray-700 text-left p-2 font-bold text-gray-400 rounded" onClick={handleLogout}>
                            Logout
                        </button>
                    </nav>
                </div>
            </div>
        </>
    );
}
