import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const submit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8000/login", { form })
                .then(res => {
                    if (res.data === "loginpass") {
                        Cookies.set("email", form.email, { expires: 7 });
                        toast.success("Successfully Login...");
                    } else if (res.data === "nouser") {
                        toast.error("Oops! Email is not registered");
                    } else if (res.data === "loginfail") {
                        toast.error("Invalid Credential");
                    } else if (res.data === "fail") {
                        toast.error("Something went wrong!");
                    }
                }).catch(e => {
                    toast.error("Something went wrong!");
                });
        } catch (e) {
            toast.error("Something went wrong!");
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
                <h1 className="text-2xl font-bold bg-gradient-to-br from-slate-500 to-white bg-clip-text text-transparent font-cursive py-8">Login</h1>
                <form className="w-full" action='POST' method='/login' onSubmit={submit}>
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
                    <div className="mb-8">
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
                    <div className="flex justify-center">
                        <input
                            className="rounded-md bg-gradient-to-br from-slate-400 to-white px-3 py-2 text-sm font-bold text-gray-900 shadow-sm sm:w-auto"
                            type="submit"
                            value="Login"
                        />
                    </div>
                </form>
                <div className="my-5 text-sm text-center font-bold text-gray-400">
                    <p>
                        Don't have an account? <Link to="/signup" className="bg-gradient-to-br from-slate-400 to-white bg-clip-text text-transparent font-cursive font-bold">Create Account</Link>
                    </p>
                    <p className='pt-5'>
                        <Link to="/forgotPassword" className="bg-gradient-to-br from-slate-400 to-white bg-clip-text text-transparent font-cursive font-bold">Forgot Password</Link>
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
    );
}
