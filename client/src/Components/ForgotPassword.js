import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';


export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(null);
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [otpValue, setOtpValue] = useState(null);
    const digits = '0123456789';
    const url = "https://resume-builder-backend-1qao.onrender.com";


    const handleOtpChange = (event) => {
        setOtpValue(event.target.value);
    };

    const sendEmail = async (e) => {
        e.preventDefault();
        try {
            let otp = '';
            for (let i = 0; i < 6; i++) {
                otp += digits[Math.floor(Math.random() * 10)];
            }
            setOtp(otp);

            const response = await axios.post(`${url}/sendemail`, { email, otp });
            if (response.data === "pass") {
                toast.success("OTP sent to your Email");
                setShowPopup(true);
            } else if (response.data === "notexists") {
                toast.error("User not Found!");
            } else if (response.data === 'fail') {
                toast.error("Something went wrong!");
            }
        } catch (e) {
            toast.error("Something went wrong!");
        }
    };

    const otpCheck = () => {
        if (otp !== otpValue) {
            toast.error("Invalid OTP");
        } else {
            Cookies.set("resetEmail", email);
            navigate("/resetpassword");
        }
    };
    return (
        <div className='min-h-screen flex flex-col md:flex-row justify-normal bg-gray-100 overflow-hidden'>
            {showPopup && (
                <div className="z-20 fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg bg-gradient-to-br from-slate-700 to-cyan-400 bg-clip-text text-transparent font-semibold">Enter OTP</h2>
                        </div>
                        <div className="flex justify-center items-center">
                            <input
                                type="text"
                                maxLength="6"
                                value={otpValue}
                                onChange={handleOtpChange}
                                className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 w-full outline-none text-center text-lg font-semibold"
                            />
                        </div>
                        <p className="text-md bg-gradient-to-br from-slate-700 to-cyan-400 bg-clip-text text-transparent mt-4">Enter the 6-digit code sent to your Email.</p>
                        <button onClick={otpCheck} className="rounded-md bg-gradient-to-br from-slate-700 to-cyan-400 px-3 py-2 text-sm font-bold text-white shadow-sm sm:w-auto mt-3">Submit</button>
                    </div>
                </div>
            )}
            <div className='w-full md:w-1/2 lg:w-1/3 flex flex-col items-center shadow-lg shadow-cyan-500 p-5 bg-gradient-to-br from-slate-700 to-cyan-400'>
                <div className='mt-4 p-1 font-bold'>
                    <Link to="/" className="bg-gradient-to-br from-slate-500 to-white bg-clip-text text-transparent font-cursive text-4xl">
                        CV.io
                    </Link>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-br from-slate-500 to-white bg-clip-text text-transparent font-cursive py-8">ForgotPassword</h1>
                <form className="w-full" onSubmit={sendEmail}>
                    <div className="mb-5">
                        <label htmlFor="email" className="leading-7 text-sm font-bold text-gray-400">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value); }}
                            required
                            type="email"
                            id="email"
                            name="email"
                            className="w-full rounded border border-gray-300 text-sm font-semibold outline-none text-gray-900 px-3 py-2 leading-8"
                        />
                    </div>
                    <div className="flex flex-col justify-center">
                        <input
                            className="rounded-md bg-gradient-to-br from-slate-400 to-white px-3 py-2 text-sm font-bold text-white shadow-sm sm:w-auto"
                            type="submit"
                            value="Send OTP"
                        />
                        <span className='text-center bg-gradient-to-br from-slate-400 to-white bg-clip-text text-transparent font-bold mt-3'>Or</span>
                        <p className='text-center bg-gradient-to-br from-slate-400 to-white bg-clip-text text-transparent font-bold mt-3'>Continue with <Link className='bg-gradient-to-br from-slate-400 to-white bg-clip-text text-transparent font-cursive font-bold' to={'/login'}>Login</Link></p>
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
