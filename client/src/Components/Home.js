import React, { useEffect, useState } from 'react'

export default function Home() {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
    }, []);
    return (
        <div className='m-10'>
            <div className='w-full rounded-md bg-gradient-to-br from-slate-700 to-cyan-400'>
                <h1 className='p-5 text-center text-white text-2xl font-cursive font-bold'>Customize your own design</h1>
                <p className='pt-2 text-center text-white text-xl font-extralight font-raleway'>Use professional field-tested resume templates that follow the exact</p>
                <p className='text-center text-white text-xl font-extralight font-raleway'>‘resume rules’ employers look for. Easy to use and done within</p>
                <p className='pb-5 text-center text-white text-xl font-extralight font-raleway'>minutes - try now for free!</p>
            </div>
            <a href='/templates'>
                <div className='border-b-2 flex justify-center'>
                    <img
                        className={`w-full md:w-1/2 mt-24 rounded-t-3xl shadow-lg h-auto object-cover object-center ${animate ? 'animate-slideUp' : ''}`}
                        src="https://s3.resume.io/cdn-cgi/image/width=770,height=350,dpr=1.5,fit=crop,gravity=top,quality=75,format=auto/uploads/local_template_image/image/488/persistent-resource/dublin-resume-templates.jpg"
                        alt="Resume builder"
                    />
                </div>
            </a>

            <div className='p-5 md:p-20 mt-10'>
                <h1 className='text-2xl md:text-4xl pb-8 text-center font-bold font-cursive'>Features designed to help you win your dream job</h1>
                <div className='mt-10'>
                    <div className='flex flex-wrap justify-center md:justify-between py-3'>
                        <div className='w-full md:w-1/4 p-2'>
                            <h1 className='font-bold text-cyan-700 font-cursive py-1'>Easy online resume builder</h1>
                            <p className='text-gray-400 font-light font-raleway'>Create an awesome resume in minutes, without leaving your web browser.</p>
                        </div>
                        <div className='w-full md:w-1/4 p-2'>
                            <h1 className='font-bold text-cyan-700 font-cursive py-1'>Automatic spell-checker</h1>
                            <p className='text-gray-400 font-light font-raleway'>Our built-in spell-checker takes care of the grammar for you. Create a resume with zero typos or errors.</p>
                        </div>
                        <div className='w-full md:w-1/4 p-2'>
                            <h1 className='font-bold text-cyan-700 font-cursive py-1'>Your data is safe</h1>
                            <p className='text-gray-400 font-light font-raleway'>Your data is kept private and protected by strong 256-bit encryption.</p>
                        </div>
                    </div>
                    <div className='flex flex-wrap justify-center md:justify-between py-3'>
                        <div className='w-full md:w-1/4 p-2'>
                            <h1 className='font-bold text-cyan-700 font-cursive py-1'>Automatic summary generator</h1>
                            <p className='text-gray-400 font-light font-raleway'>Create a powerful resume profile or cover letter in one click. Writer’s block is no longer an obstacle. Try for free!</p>
                        </div>
                        <div className='w-full md:w-1/4 p-2'>
                            <h1 className='font-bold text-cyan-700 font-cursive py-1'>Approved templates</h1>
                            <p className='text-gray-400 font-light font-raleway'>Professionally-designed resume templates and examples. Just edit and download in 5 minutes.</p>
                        </div>
                        <div className='w-full md:w-1/4 p-2'>
                            <h1 className='font-bold text-cyan-700 font-cursive py-1'>AI pre-written phrases</h1>
                            <p className='text-gray-400 font-light font-raleway'>Use the power of AI and data analysis, choose pre-generated effective phrases and keywords.</p>
                        </div>
                    </div>
                    <div className='flex flex-wrap justify-center md:justify-between py-3'>
                        <div className='w-full md:w-1/4 p-2'>
                            <h1 className='font-bold text-cyan-700 font-cursive py-1'>Optimized resumes</h1>
                            <p className='text-gray-400 font-light font-raleway'>Formats and designs are optimized for resume-filtering algorithms. Ensure humans see your application!</p>
                        </div>
                        <div className='w-full md:w-1/4 p-2'>
                            <h1 className='font-bold text-cyan-700 font-cursive py-1'>Multi-format resume options</h1>
                            <p className='text-gray-400 font-light font-raleway'>Save your perfect resume in any common format, including Microsoft Word and PDF in a single click.</p>
                        </div>
                        <div className='w-full md:w-1/4 p-2'>
                            <h1 className='font-bold text-cyan-700 font-cursive py-1'>Cover letters</h1>
                            <p className='text-gray-400 font-light font-raleway'>Our cover letter builder works with the same ease and use of elegant templates as the resume creator.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
