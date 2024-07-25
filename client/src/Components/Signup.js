import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Signup() {
    const navigate = useNavigate();
    const url = "https://resume-builder-backend-1qao.onrender.com";
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        repassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const submit = async (e) => {
        e.preventDefault();
        try {
            if (form.password.length < 8) {
                toast.error('Password must be minimum 8 characters');
            } else if (form.password !== form.repassword) {
                toast.error("Passwords don't match");
            } else {
                const response = await axios.post(`${url}/signup`, { form });

                if (response.data === 'exists') {
                    toast.error('Email already exists');
                } else if (response.data === 'notexists') {
                    Cookies.set('email', form.email, { expires: 7 });
                    toast.success('Successfully registered', { autoClose: 1000 });
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                }
            }
        } catch (error) {
            toast.error('Something went wrong!');
        }
    };
    return (
        <div className='min-h-screen flex flex-col md:flex-row justify-normal bg-gray-100 overflow-hidden'>
            <div className='w-full md:w-1/2 lg:w-1/3 flex flex-col items-center shadow-lg shadow-cyan-500 p-5 bg-gradient-to-br from-slate-700 to-cyan-400'>
                <div className='mt-4 p-1 font-bold'>
                    <Link to="/" className="bg-gradient-to-br from-slate-500 to-white bg-clip-text text-transparent font-cursive text-4xl">
                        CV.io
                    </Link>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-br from-slate-500 to-white bg-clip-text text-transparent font-cursive py-8">Signup</h1>
                <form className="w-full" onSubmit={submit}>
                    <div className="mb-5">
                        <label htmlFor="name" className="leading-7 text-sm font-bold text-gray-400">Username</label>
                        <input
                            value={form.name}
                            onChange={handleChange}
                            required
                            type="text"
                            id="name"
                            name="name"
                            className="w-full rounded border border-gray-300 text-sm font-semibold outline-none text-gray-900 px-3 py-2 leading-8"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="email" className="leading-7 text-sm font-bold text-gray-400">Email</label>
                        <input
                            value={form.email}
                            onChange={handleChange}
                            required
                            type="email"
                            id="email"
                            name="email"
                            className="w-full rounded border border-gray-300 text-sm font-semibold outline-none text-gray-900 px-3 py-2 leading-8"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="leading-7 text-sm font-bold text-gray-400">Password</label>
                        <input
                            value={form.password}
                            onChange={handleChange}
                            required
                            type="password"
                            id="password"
                            name="password"
                            className="w-full rounded border border-gray-300 text-sm font-semibold outline-none text-gray-900 px-3 py-2 leading-8"
                        />
                    </div>
                    <div className="mb-8">
                        <label htmlFor="repassword" className="leading-7 text-sm font-bold text-gray-400">Confirm Password</label>
                        <input
                            value={form.repassword}
                            onChange={handleChange}
                            required
                            type="password"
                            id="repassword"
                            name="repassword"
                            className="w-full rounded border border-gray-300 text-sm font-semibold outline-none text-gray-900 px-3 py-2 leading-8"
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="rounded-md bg-gradient-to-br from-slate-400 to-white px-3 py-2 text-sm font-bold text-gray-900 shadow-sm sm:w-auto"
                        >
                            Register
                        </button>
                    </div>
                </form>
                <div className="my-5 text-sm text-center font-bold text-gray-400">
                    <p>
                        Already have an account? <Link to="/login" className="bg-gradient-to-br from-slate-400 to-white bg-clip-text text-transparent font-cursive font-bold">Login now</Link>
                    </p>
                </div>
            </div>
            <div className='hidden md:flex w-full md:w-1/2 lg:w-full overflow-hidden'>
                <img
                    className="w-full h-auto object-cover object-center"
                    src="https://www.davidkowalski.nl/gallery/wp-content/uploads/2021/11/free-background-images-for-resumes.jpg"
                    alt="Resume builder"
                />
            </div>
            <ToastContainer />
        </div>
    )
}
