import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PuffLoader from 'react-spinners/PuffLoader';
import { FaStar } from 'react-icons/fa';

export default function UserAccount() {
    const [isOpen, setIsOpen] = useState(false);
    const url = "https://resume-builder-server-ea28.onrender.com";
    const [profileMenu, setProfileMenu] = useState(true);
    const [savedTemplateMenu, setSavedTemplateMenu] = useState(false);
    const [settingsMenu, setSettingsMenu] = useState(false);
    const [cookieVal] = useState(Cookies.get('email'));
    const [userDetails, setUserDetails] = useState('');
    const [starredTemplate, setStarredTemplate] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleProfilePictureChange = (e) => {
        setProfilePicture(e.target.files[0]);
        setPreviewImage(URL.createObjectURL(e.target.files[0]));
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    const handleLogout = () => {
        Cookies.remove('email');
        window.location.href = '/login';
    };

    const user = async () => {
        try {
            await axios.post(`${url}/userAccount`, { cookieVal })
                .then(res => {
                    setUserDetails(res.data);
                }).catch(e => {
                    toast.error("Something went wrong!");
                });
        } catch (e) {
            toast.error("Something went wrong!");
        }
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('email', cookieVal);
        formData.append('name', userDetails.name);
        formData.append('phone', userDetails.phone);
        formData.append('city', userDetails.city);
        formData.append('country', userDetails.country);
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        try {
            const response = await axios.post(`${url}/updateAccount`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                toast.success('Profile updated successfully!');
                setUserDetails(response.data);
                setEditMode(false);
            } else {
                toast.error('Failed to update profile.');
            }
        } catch (error) {
            toast.error('Something went wrong!');
        }
    };

    const getStarredTemplates = async () => {
        try {
            await axios.post(`${url}/getStarredTemplates`, { cookieVal })
                .then(res => {
                    setStarredTemplate(res.data);
                }).catch(e => {
                    toast.error("Something went wrong!")
                });
        } catch (e) {
            toast.error("Something went wrong!")
        };
    };


    useEffect(() => {
        user();
    }, [cookieVal]);

    return (
        <div className="flex flex-col md:flex-row min-h-screen font-raleway">
            <button className="md:hidden p-4 focus:outline-none" onClick={toggleSidebar}>
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
            <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out bg-gradient-to-br from-slate-700 to-cyan-400 text-white w-64 flex flex-col z-50`}>
                <a href='/' className="p-4 text-center font-bold text-2xl font-cursive border-b border-gray-700">
                    CV.io
                </a>
                <div className="flex-grow p-4">
                    <nav className="flex flex-col space-y-4">
                        <Link onClick={() => { handleLinkClick(); setProfileMenu(true); setSavedTemplateMenu(false); setSettingsMenu(false); }} className="hover:bg-gray-700 p-2 font-bold text-gray-400 rounded">
                            Home
                        </Link>
                        <Link onClick={() => { handleLinkClick(); getStarredTemplates(); setProfileMenu(false); setSavedTemplateMenu(true); setSettingsMenu(false); }} className="hover:bg-gray-700 p-2 font-bold text-gray-400 rounded">
                            Starred Templates
                        </Link>
                        <Link onClick={() => { handleLinkClick(); setProfileMenu(false); setSavedTemplateMenu(false); setSettingsMenu(true); }} className="hover:bg-gray-700 p-2 font-bold text-gray-400 rounded">
                            Settings
                        </Link>
                        <button className="hover:bg-gray-700 text-left p-2 font-bold text-gray-400 rounded" onClick={handleLogout}>
                            Logout
                        </button>
                    </nav>
                </div>
            </div>
            {profileMenu && (
                <div className="flex flex-grow bg-cover bg-center opacity-70" style={{ backgroundImage: `url('https://www.davidkowalski.nl/gallery/wp-content/uploads/2021/11/free-background-images-for-resumes.jpg')` }}>
                    <div className="w-full flex items-center justify-center bg-gradient-to-br from-gray-500 to-zinc-800 opacity-90 p-4 rounded-md">
                        <h1 className="lg:w-1/2 text-4xl font-bold bg-gradient-to-br from-gray-500 to-white bg-clip-text text-transparent uppercase">Welcome, {userDetails.name}!</h1>
                        <div className='w-1/2'>
                        </div>
                    </div>
                </div>
            )}
            {savedTemplateMenu && (
                <div className="flex-grow p-4 bg-gradient-to-br from-gray-400 to-zinc-700">
                    <h1 className="text-3xl font-bold font-raleway text-gray-100 uppercase">Starred Templates</h1>
                    <div className='col-span-12 lg:col-span-8 2xl:col-span-9 p-2 w-full py-10'>
                        <div className='w-full h-full grid grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-4'>
                            {starredTemplate.length > 0 ? (
                                starredTemplate.map(template => (
                                    <div key={template._id} className='w-full lg:h-[420px] rounded-md overflow-hidden border shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg relative'>
                                        <img src={`${url}/${template.template.imageUrl}`} alt={template.template.title} className='w-full h-full object-cover' />
                                        <div className='absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-transparent cursor-pointer opacity-100 transition-opacity duration-300'>
                                            <FaStar className='text-xl text-cyan-700' />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className='flex w-full h-full items-center justify-center'>
                                    <div className='flex flex-col w-full items-center justify-center gap-5'>
                                        <PuffLoader color='#498FCD' size={40} />
                                        <p className='text-xl capitalize font-bold text-cyan-600 text-center'>Error on Fetching Template</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {settingsMenu && (
                <div className="flex-grow p-4 opacity-70" style={{ backgroundImage: `url('https://www.davidkowalski.nl/gallery/wp-content/uploads/2021/11/free-background-images-for-resumes.jpg')` }}>
                    <h1 className="text-3xl font-bold font-raleway text-gray-900 uppercase">Settings</h1>
                    <div className='mt-10 p-8 lg:flex w-full max-w-full bg-gradient-to-br from-gray-300 to-zinc-800 opacity-100 rounded-lg'>
                        <div className="lg:w-1/2">
                            <ul className="divide-y divide-gray-200">
                                <li className='w-full py-4 flex items-end justify-between border-b'>
                                    <div className='flex'>
                                        {previewImage ? (
                                            <img className="rounded-full object-cover w-16 h-16 border" src={previewImage} alt="Profile" />
                                        ) : (
                                            <img className="rounded-full object-cover w-16 h-16 border" src={`${url}/${userDetails.profilePictureUrl}`} alt="Profile" />
                                        )}
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <label className="w-32 h-8 rounded-md border flex justify-center items-center cursor-pointer ml-2 font-bold text-sm text-gray-900">Upload Photo
                                            <input
                                                type="file"
                                                onChange={handleProfilePictureChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </li>
                                <li className="py-4">
                                    <div className="flex justify-between">
                                        <span className="font-bold">Name:</span>
                                        {editMode ? (
                                            <input type="text" name="name" value={userDetails.name} onChange={handleChange} className="text-sm ml-2 w-1/2 outline-cyan-700 border rounded p-2 bg-transparent" />
                                        ) : (
                                            <span className="ml-2">{userDetails.name}</span>
                                        )}
                                    </div>
                                </li>
                                <li className="py-4">
                                    <div className="flex justify-between">
                                        <span className="font-bold">E-mail:</span>
                                        {editMode ? (
                                            <input type="email" name="email" value={userDetails.email} onChange={handleChange} className="text-sm ml-2 w-1/2 outline-cyan-700 border rounded p-2 bg-transparent" />
                                        ) : (
                                            <span className="ml-2">{userDetails.email}</span>
                                        )}
                                    </div>
                                </li>
                                <li className="py-4">
                                    <div className="flex justify-between">
                                        <span className="font-bold">Contact:</span>
                                        {editMode ? (
                                            <input type="text" name="phone" value={userDetails.phone} onChange={handleChange} className="text-sm ml-2 w-1/2 outline-cyan-700 border rounded p-2 bg-transparent" />
                                        ) : (
                                            <span className="ml-2">{userDetails.phone}</span>
                                        )}
                                    </div>
                                </li>
                                <li className="py-4">
                                    <div className="flex justify-between">
                                        <span className="font-bold">City:</span>
                                        {editMode ? (
                                            <input type="text" name="city" value={userDetails.city} onChange={handleChange} className="text-sm ml-2 w-1/2 outline-cyan-700 border rounded p-2 bg-transparent" />
                                        ) : (
                                            <span className="ml-2">{userDetails.city}</span>
                                        )}
                                    </div>
                                </li>
                                <li className="py-4">
                                    <div className="flex justify-between">
                                        <span className="font-bold">Country:</span>
                                        {editMode ? (
                                            <input type="text" name="country" value={userDetails.country} onChange={handleChange} className="text-sm ml-2 w-1/2 outline-cyan-700 border rounded p-2 bg-transparent" />
                                        ) : (
                                            <span className="ml-2">{userDetails.country}</span>
                                        )}
                                    </div>
                                </li>
                            </ul>
                            <div className="mt-4 text-end">
                                {editMode ? (
                                    <div>
                                        <button onClick={handleSave} className="mx-1 border bg-cyan-700 text-white font-bold px-5 py-1 rounded">Save</button>
                                        <button onClick={() => setEditMode(false)} className="mx-1 border text-gray-900 font-bold px-5 py-1 rounded">Cancel</button>
                                    </div>
                                ) : (
                                    <button onClick={() => setEditMode(true)} className="border text-gray-900 font-bold px-5 py-1 rounded">Edit</button>
                                )}
                            </div>
                        </div>
                        <div className='lg:w-1/2 rounded-md shadow-md m-3'>
                            <img className='rounded-md shadow-lg' src='https://cdn-images.zety.com/pages/creative_resume_templates_021.jpg' />
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    )
}
