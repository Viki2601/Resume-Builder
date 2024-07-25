import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import axios from 'axios';
import PuffLoader from "react-spinners/PuffLoader";
import { Link } from 'react-router-dom';
import { FaFile, FaTrash, FaUpload, FaUser } from 'react-icons/fa';
import Graph from './Graph';
import GraphUsers from './GraphUsers';


export default function AdminAccount() {
    const [cookieVal] = useState(Cookies.get('email'));
    const [isOpen, setIsOpen] = useState(false);
    const [profileMenu, setProfileMenu] = useState(true);
    const [manageTemplateMenu, setManageTemplateMenu] = useState(false);
    const [settingsMenu, setSettingsMenu] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [templates, setTemplates] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [graphData, setGraphData] = useState([]);
    const [userGraphData, setUserGraphData] = useState([]);
    const [allUsers, setAllUsers] = useState("")
    const [formData, setFormData] = useState({
        title: "",
        imageUrl: null,
        tags: ""
    });

    const initialTags = [
        "Software Engineer", "Front-end Developer", "Back-end Developer", "Full-stack Developer", "Web Developer", "UI/UX Designer",
        "Graphic Designer", "Data Scientist", "Product Manager", "Project Manager", "Business Analyst", "Marketing Manager",
        "Sales Representative", "Customer Service Representative", "HR Manager", "Financial Analyst", "Content Writer",
        "Teacher/Educator", "Healthcare Professional", "Legal Counsel"
    ];

    const [imageAsset, setImageAsset] = useState({
        isImageLoading: false,
        uri: null,
        progress: 0
    });

    const [adminDetails, setAdminDetails] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        country: ''
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdminDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevRec) => ({ ...prevRec, [name]: value }));
    };


    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && isAllowed(file)) {
            setImageAsset((prevAsset) => ({
                ...prevAsset,
                isImageLoading: true,
                uri: URL.createObjectURL(file),
                progress: 100
            }));
            setImageAsset((prevAsset) => ({
                ...prevAsset,
                isImageLoading: false,
                uri: URL.createObjectURL(file),
            }));
            setFormData((prevData) => ({ ...prevData, imageUrl: file }));
        } else {
            toast.info("Invalid File Format");
        }
    };

    const handleProfilePictureChange = (e) => {
        setProfilePicture(e.target.files[0]);
        setPreviewImage(URL.createObjectURL(e.target.files[0]));
    };

    const handleSelectedTags = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(selected => selected !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };


    const isAllowed = (file) => {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        return allowedTypes.includes(file.type);
    };


    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };


    const handleLinkClick = () => {
        setIsOpen(false);
    };


    const deleteUploadImage = () => {
        setImageAsset({ isImageLoading: false, uri: null, progress: 0 });
    };


    const handleLogout = () => {
        Cookies.remove('email');
        window.location.href = '/login';
    };


    const admin = async () => {
        try {
            await axios.post("http://localhost:8000/userAccount", { cookieVal })
                .then(res => {
                    setAdminDetails(res.data);
                }).catch(e => {
                    toast.error("Something went wrong!");
                });
        } catch (e) {
            toast.error("Something went wrong!");
        };
    };


    const getAllUsers = async () => {
        try {
            await axios.post("http://localhost:8000/getAllUsers")
                .then(res => {
                    setAllUsers(res.data);
                }).catch(e => {
                    toast.error("Something went wrong!");
                });
        } catch (e) {
            toast.error("Something went wrong!");
        };
    };


    const handleSave = async () => {
        const formData = new FormData();
        formData.append('email', cookieVal);
        formData.append('name', adminDetails.name);
        formData.append('phone', adminDetails.phone);
        formData.append('city', adminDetails.city);
        formData.append('country', adminDetails.country);
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        try {
            const response = await axios.post('http://localhost:8000/updateAccount', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                toast.success('Profile updated successfully!');
                setAdminDetails(response.data);
                setEditMode(false);
            } else {
                toast.error('Failed to update profile.');
            }
        } catch (error) {
            toast.error('Something went wrong!');
        }
    };


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const uploadTemplate = new FormData();
        uploadTemplate.append("title", formData.title);
        uploadTemplate.append("imageUrl", formData.imageUrl);
        uploadTemplate.append("tags", JSON.stringify(selectedTags));
        try {
            const res = await axios.post("http://localhost:8000/upload", uploadTemplate, { headers: { "Content-Type": "multipart/form-data" } });
            if (res.status === 201) {
                getAllTemplates();
                setSelectedTags([]);
                setFormData({ title: "", imageUrl: null, tags: "" });
                setImageAsset({ isImageLoading: false, uri: null, progress: 0 });
            }
            toast.success("Template uploaded successfully");
        } catch (e) {
            toast.error("Oops! Failed to upload template");
        };
    };


    const getAllTemplates = async () => {
        try {
            const res = await axios.post("http://localhost:8000/getAllTemplates");
            setTemplates(res.data);
        } catch (e) {
            console.log(e);
        };
    };


    const deleteTemplate = async (id) => {
        try {
            console.log("called")
            const res = await axios.delete(`http://localhost:8000/deleteTemplateById/${id}`);
            if (res.status === 200) {
                getAllTemplates();
                toast.success("Template deleted successfully");
            }
        } catch (e) {
            console.log(e);
            toast.error("Failed to delete template");
        }
    };


    const fetchGraphData = async () => {
        try {
            const res = await axios.get("http://localhost:8000/graphData");
            setGraphData(res.data);
        } catch (e) {
            console.log(e)
            toast.error("Something went wrong!");
        }
    };

    const fetchUserGraphData = async () => {
        try {
            const res = await axios.get("http://localhost:8000/userGraphData");
            setUserGraphData(res.data);
        } catch (e) {
            console.log(e)
            toast.error("Something went wrong!");
        }
    };


    useEffect(() => {
        admin();
        getAllUsers();
        getAllTemplates();
        fetchGraphData();
        fetchUserGraphData();
    }, [cookieVal]);


    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Toggle button for view changes */}
            <button className="md:hidden p-4 focus:outline-none" onClick={toggleSidebar}>
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>

            {/* Sidebar view menu selection fields */}
            <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out bg-gradient-to-br from-slate-700 to-cyan-400 text-white w-64 flex flex-col z-50`}>
                <a href='/' className="p-4 text-center font-bold text-2xl font-cursive border-b border-gray-700">
                    CV.io
                </a>
                <div className="flex-grow p-4">
                    <nav className="flex flex-col space-y-4">
                        <Link onClick={() => { handleLinkClick(); setProfileMenu(true); setManageTemplateMenu(false); setSettingsMenu(false); }} className="hover:bg-gray-700 p-2 font-bold text-gray-400 rounded">
                            Home
                        </Link>
                        <Link onClick={() => { handleLinkClick(); setProfileMenu(false); setManageTemplateMenu(true); setSettingsMenu(false); }} className="hover:bg-gray-700 p-2 font-bold text-gray-400 rounded">
                            Manage Templates
                        </Link>
                        <Link onClick={() => { handleLinkClick(); setProfileMenu(false); setManageTemplateMenu(false); setSettingsMenu(true); }} className="hover:bg-gray-700 p-2 font-bold text-gray-400 rounded">
                            Settings
                        </Link>
                        <button className="hover:bg-gray-700 text-left p-2 font-bold text-gray-400 rounded" onClick={handleLogout}>
                            Logout
                        </button>
                    </nav>
                </div>
            </div>

            {/* User profile menu section default view */}
            {profileMenu && (
                <div className="p-4 flex-grow bg-cover bg-center opacity-70" style={{ backgroundImage: `url('https://www.davidkowalski.nl/gallery/wp-content/uploads/2021/11/free-background-images-for-resumes.jpg')` }}>
                    <div className="w-full lg:flex items-center justify-between bg-gradient-to-br from-gray-200 to-zinc-800 opacity-95 p-4 rounded-md">
                        <h1 className="text-2xl lg:text-4xl text-center font-bold text-black uppercase">Welcome, {adminDetails.name}!</h1>
                        <div className="mt-10 lg:mt-0">
                            <div className='flex flex-wrap gap-4 justify-center lg:justify-start'>
                                <div className="w-full lg:w-auto flex items-center text-gray-900 font-semibold border shadow-md rounded p-4">
                                    <FaFile className='mr-2 text-cyan-700 text-3xl' />
                                    <div className='flex flex-col ml-2'>
                                        <h1 className='text-sm uppercase font-bold'>Total Templates</h1>
                                        <div className='text-md uppercase font-bold font-raleway'>{templates.length}</div>
                                    </div>
                                </div>
                                <div className="w-full lg:w-auto flex items-center text-gray-900 font-semibold border shadow-md rounded p-4">
                                    <FaUser className='mr-2 text-cyan-700 text-3xl' />
                                    <div className='flex flex-col ml-2'>
                                        <h1 className='text-sm uppercase font-bold'>Total Usexrs</h1>
                                        <div className='text-md uppercase font-bold font-raleway'>{allUsers.length}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='mt-4 w-full lg:flex justify-between gap-4'>
                        <div className='mt-10 gap-4 lg:w-1/2'>
                            <div className='w-full border-r border-b bg-gradient-to-br from-gray-200 to-zinc-800 opacity-95 p-4 rounded-md'>
                                <h2 className='text-2xl text-center font-raleway font-bold mb-4'>Templates Activity</h2>
                                <Graph data={graphData} />
                            </div>
                            <div className='my-5 mt-10 w-full border-b bg-gradient-to-br from-gray-200 to-zinc-800 opacity-95 p-4 rounded-md'>
                                <h2 className='text-2xl text-center font-raleway font-bold mb-4'>Users Activity</h2>
                                <GraphUsers data={userGraphData} />
                            </div>
                        </div>
                        <div className='mt-10 lg:w-1/2 h-[420px] lg:h-[784px] overflow-y-auto bg-gradient-to-br from-gray-200 to-zinc-800 opacity-95 p-4 rounded-md'>
                            <h1 className='text-2xl font-raleway font-bold text-center'>Templates</h1>
                            <div className='w-full flex lg:grid lg:grid-cols-2 gap-4 overflow-x-auto'>
                                {templates.length > 0 ? (
                                    templates.map(template => (
                                        <div key={template._id} className='flex-shrink-0 lg:flex-shrink p-5 w-[280px] h-[380px]'>
                                            <img src={`http://localhost:8000/${template.imageUrl}`} alt='' className='w-full h-full object-cover rounded-md sha' />
                                        </div>
                                    ))
                                ) : (
                                    <div className='w-full h-full flex flex-col items-center justify-center'>
                                        <PuffLoader color='#498FCD' size={40} />
                                        <p className='text-xl tracking-wider capitalize text-gray-700'>No Data</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* Manage templates Menu section */}
            {manageTemplateMenu && (
                <div className='w-full px-4 lg:px-4 2xl:px-5 py-4 grid grid-cols-1 lg:grid-cols-12'>
                    <div className='col-span-12 lg:col-span-4 2xl:col-span-3 flex-1 flex items-center justify-start flex-col gap-4 px-2'>
                        <div className='w-full'>
                            <p className='text-xl font-bold'>Create a new Template</p>
                        </div>
                        <div className='w-full flex items-center justify-end'>
                            <p className='text-gray-300 text-base font-semibold uppercase'>TempID :{" "}</p>
                            <p className='text-gray-600 text-sm font-bold capitalize'>
                                {templates && templates.length > 0 ? `Template ${" #"}${templates.length + 1}` : `Template`}
                            </p>
                        </div>

                        {/* Template title Section */}
                        <input
                            className='w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-sm focus:shadow-md outline-none'
                            type='text'
                            name='title'
                            placeholder='Template Title'
                            value={formData.title}
                            onChange={handleInputChange} />

                        {/* File Uploader Section */}
                        <div className='w-full bg-gray-100 backdrop-blur-md rounded-md border-2 border-dotted border-gray-300 cursor-pointer flex items-center justify-center h-[420px]'>
                            {imageAsset.isImageLoading ? (
                                <div className='flex flex-col items-center justify-center gap-4'>
                                    <PuffLoader color='#498FCD' size={40} />
                                    <p>{imageAsset?.progress.toFixed(2)}%</p>
                                </div>
                            ) : (
                                <div>
                                    {!imageAsset?.uri ? (
                                        <div>
                                            <label className='w-full cursor-pointer h-full'>
                                                <div className='flex flex-col items-center justify-center h-full w-full'>
                                                    <div className='flex flex-col items-center justify-center cursor-pointer gap-4'>
                                                        <FaUpload className='text-lg' />
                                                        <p className='text-sm font-semibold text-gray-500'>Click to Upload</p>
                                                    </div>
                                                </div>
                                                <input type='file' className='w-0 h-0' accept='.jpeg,.jpg,.png' onChange={handleFileSelect} />
                                            </label>
                                        </div>
                                    ) : (
                                        <div className='w-[300px] h-[420px] flex items-center justify-center'>
                                            <img src={imageAsset.uri} alt="Uploaded" loading='lazy' className="w-[300px] h-[420px] object-cover rounded-md" />
                                            <div className='absolute top-4 right-4 w-6 h-6 rounded-md flex items-center justify-center bg-red-500 cursor-pointer' onClick={deleteUploadImage}>
                                                <FaTrash className='text-xs text-white' />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Tags Section */}
                        <div className='w-full flex items-center flex-wrap gap-2'>
                            {initialTags.map((tag, i) => (
                                <div key={i} className={`border border-gray-300 px-2 py-1 rounded-md cursor-pointer ${selectedTags.includes(tag) ? "bg-cyan-600 text-white" : ""}`} onClick={() => handleSelectedTags(tag)}>
                                    <p className='text-xs'>{tag}</p>
                                </div>
                            ))}
                        </div>

                        {/* Button actions */}
                        <button type='button' onClick={handleFormSubmit} className='w-full py-2 bg-cyan-700 rounded-md font-semibold text-white text-lg'>
                            Save
                        </button>
                    </div>
                    <div className='col-span-12 lg:col-span-8 2xl:col-span-9 p-2 w-full flex-1 lg:py-1'>
                        <h1 className='w-full text-end text-sm font-montserrat font-bold text-cyan-600 opacity-40 py-10 lg:pt-0'>Total Templates : {templates.length}</h1>
                        <div>
                            <div className='w-full h-full grid grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-4'>
                                {templates.length > 0 ? (
                                    templates.map(template => (
                                        <div key={template._id} className='w-full lg:h-[320px] rounded-md overflow-hidden border shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg relative'>
                                            <img src={`http://localhost:8000/${template.imageUrl}`} alt='' className='w-full h-full object-cover' />
                                            <div className='absolute top-4 right-4 w-6 h-6 rounded-md flex items-center justify-center bg-red-500 cursor-pointer' onClick={() => deleteTemplate(template._id)}>
                                                <FaTrash className='text-xs text-white' />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='w-full h-full grid grid-cols-1'>
                                        <div className='w-full h-full flex flex-col items-center justify-center'>
                                            <PuffLoader color='#498FCD' size={40} />
                                            <p className='text-xl tracking-wider capitalize text-gray-700'>No Data</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Update profile section for users menu */}
            {settingsMenu && (
                <div className="flex-grow p-4 opacity-70" style={{ backgroundImage: `url('https://www.davidkowalski.nl/gallery/wp-content/uploads/2021/11/free-background-images-for-resumes.jpg')` }}>
                    <h1 className="text-3xl font-bold font-raleway text-gray-900 uppercase">Settings</h1>
                    <div className='mt-10 p-8 lg:flex w-full max-w-full bg-gradient-to-br from-gray-300 to-zinc-800 opacity-90 rounded-lg'>
                        <div className="lg:w-1/2">
                            <ul className="divide-y divide-gray-200">
                                <li className='w-full py-4 flex items-end justify-between border-b'>
                                    <div className='flex'>
                                        {previewImage ? (
                                            <img className="rounded-full object-cover w-16 h-16 border" src={previewImage} alt="Profile" />
                                        ) : (
                                            <img className="rounded-full object-cover w-16 h-16 border" src={`http://localhost:8000/${adminDetails.profilePictureUrl}`} alt="Profile" />
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
                                            <input type="text" name="name" value={adminDetails.name} onChange={handleChange} className="text-sm ml-2 w-1/2 outline-cyan-700 border rounded p-2" />
                                        ) : (
                                            <span className="ml-2">{adminDetails.name}</span>
                                        )}
                                    </div>
                                </li>
                                <li className="py-4">
                                    <div className="flex justify-between">
                                        <span className="font-bold">E-mail:</span>
                                        {editMode ? (
                                            <input type="email" name="email" value={adminDetails.email} onChange={handleChange} className="text-sm ml-2 w-1/2 outline-cyan-700 border rounded p-2" />
                                        ) : (
                                            <span className="ml-2">{adminDetails.email}</span>
                                        )}
                                    </div>
                                </li>
                                <li className="py-4">
                                    <div className="flex justify-between">
                                        <span className="font-bold">Contact:</span>
                                        {editMode ? (
                                            <input type="text" name="phone" value={adminDetails.phone} onChange={handleChange} className="text-sm ml-2 w-1/2 outline-cyan-700 border rounded p-2" />
                                        ) : (
                                            <span className="ml-2">{adminDetails.phone}</span>
                                        )}
                                    </div>
                                </li>
                                <li className="py-4">
                                    <div className="flex justify-between">
                                        <span className="font-bold">City:</span>
                                        {editMode ? (
                                            <input type="text" name="city" value={adminDetails.city} onChange={handleChange} className="text-sm ml-2 w-1/2 outline-cyan-700 border rounded p-2" />
                                        ) : (
                                            <span className="ml-2">{adminDetails.city}</span>
                                        )}
                                    </div>
                                </li>
                                <li className="py-4">
                                    <div className="flex justify-between">
                                        <span className="font-bold">Country:</span>
                                        {editMode ? (
                                            <input type="text" name="country" value={adminDetails.country} onChange={handleChange} className="text-sm ml-2 w-1/2 outline-cyan-700 border rounded p-2" />
                                        ) : (
                                            <span className="ml-2">{adminDetails.country}</span>
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
    );
}
