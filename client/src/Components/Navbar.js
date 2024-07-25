import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Navbar() {
    const [cookieVal] = useState(Cookies.get('email'));
    const [userDetails, setUserDetails] = useState({ name: '', profilePictureUrl: '' });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const user = async () => {
        try {
            await axios.post("http://localhost:8000/userAccount", { cookieVal })
                .then(res => {
                    setUserDetails(res.data);
                }).catch(e => {
                    toast.error("Something went wrong!");
                });
        } catch (e) {
            toast.error("Something went wrong!");
        }
    };

    useEffect(() => {
        user();
    }, [cookieVal]);

    const defaultPicture = (
        <div className="bg-gradient-to-br from-zinc-400 to-white text-gray-700 text-3xl font-bold font-raleway rounded-full w-12 h-12 flex items-center justify-center">
            {userDetails.name.at(0)}
        </div>
    );

    const profilePicture = userDetails.profilePictureUrl ? (
        <img
            src={`http://localhost:8000/uploads/${userDetails.profilePictureUrl}`}
            alt="Profile"
            className="rounded-full w-12 h-12 object-cover"
        />
    ) : (
        defaultPicture
    );

    return (
        <header className="text-gray-900 bg-white shadow-md border-b">
            <div className="flex items-center justify-between p-5">
                <div>
                    <a href='/' className="bg-gradient-to-br from-slate-700 to-cyan-400 bg-clip-text text-transparent font-cursive font-bold text-2xl md:text-3xl cursor-pointer">
                        CV.io
                    </a>
                </div>
                <div className="hidden sm:flex items-center sm:w-1/2 md:w-1/3 lg:w-1/4 justify-evenly">
                    <Link to={"/templates"} className="bg-gradient-to-br from-slate-700 to-cyan-400 py-2 px-4 font-raleway cursor-pointer font-semibold rounded-lg text-white text-sm md:text-base">Create a Design</Link>
                    <Link to={"/login"} className="cursor-pointer font-bold text-sm md:text-base">
                        {profilePicture}
                    </Link>
                </div>
                <div className="sm:hidden">
                    <button className="bg-gradient-to-r from-fuchsia-500 to-sky-400 bg-clip-text" onClick={toggleMobileMenu}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </div>
            {isMobileMenuOpen && (
                <div className="sm:hidden border-t-2">
                    <Link to={"/templates"} className="block px-4 py-2 text-sm font-semibold bg-gradient-to-br from-slate-700 to-cyan-400 bg-clip-text text-transparent font-raleway">Create a Design</Link>
                    <Link to={"/login"} className="block px-4 py-2 text-sm font-bold bg-gradient-to-br from-slate-700 to-cyan-400 bg-clip-text text-transparent font-raleway">Profile</Link>
                </div>
            )}
            <ToastContainer />
        </header>
    )
}
