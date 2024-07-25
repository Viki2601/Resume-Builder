import axios from 'axios'
import React, { useState } from 'react'
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

export default function ResetPassword() {
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [repassword, setRepassword] = useState('')

    const submit = async (e) => {
        e.preventDefault();
        try {
            if (password !== repassword) {
                toast.error("Password doesn't match");
            } else if (password.length < 8) {
                toast.error("Password must be minimum 8 characters");
            } else {
                const cookieVal = Cookies.get('resetEmail')
                await axios.post("http://localhost:8000/resetPassword", { cookieVal, password })
                    .then(res => {
                        if (res.data === "pass") {
                            toast.success("Password changed successfully");
                            Cookies.remove('resetEmail');
                            navigate("/login");
                        } else if (res.data === "fail") {
                            toast.error("Something went wrong!");
                        }
                    }).catch(e => {
                        toast.error("Something went wrong!")
                    })
            }
        } catch (e) {
            toast.error("Something went wrong!");
        }
    }
    return (
        <div className='min-h-screen flex flex-col md:flex-row justify-normal bg-gray-100 overflow-hidden'>
            <div className='w-full md:w-1/2 lg:w-1/3 flex flex-col items-center shadow-lg shadow-cyan-500 p-5 bg-gradient-to-br from-slate-700 to-cyan-400'>
                <div className='mt-4 p-1 font-bold'>
                    <Link to="/" className="bg-gradient-to-br from-slate-500 to-white bg-clip-text text-transparent font-cursive text-4xl">
                        CV.io
                    </Link>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-br from-slate-500 to-white bg-clip-text text-transparent font-cursive py-8">ResetPassword</h1>
                <form className="w-full" onSubmit={submit}>
                    <div className="mb-5">
                        <label htmlFor="password" className="leading-7 text-sm font-bold text-gray-400">Password</label>
                        <input
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
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
                            value={repassword}
                            onChange={(event) => setRepassword(event.target.value)}
                            required
                            type="password"
                            id="repassword"
                            name="repassword"
                            className="w-full rounded border border-gray-300 text-sm font-semibold outline-none text-gray-900 px-3 py-2 leading-8"
                        />
                    </div>
                    <div className="flex justify-center">
                        <input
                            className="rounded-md bg-gradient-to-br from-slate-500 to-white px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-fuchsia-500 sm:w-auto"
                            type="submit"
                            value={"Submit"}
                        />
                    </div>
                </form>
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
