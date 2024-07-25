import React, { useState } from 'react';
import { FaHome, FaPen, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { GiRotaryPhone } from 'react-icons/gi';
import { MdClear, MdEmail } from 'react-icons/md';
import { IoLocationOutline } from 'react-icons/io5';
import { CiLock, CiUnlock, CiExport, CiImageOn } from "react-icons/ci";
import { BsFiletypePdf, BsGlobe } from 'react-icons/bs';
import { toast } from 'react-toastify';
import axios from 'axios';
import Modal from 'react-modal';
import jsPDF from 'jspdf';
import * as htmlToImage from "html-to-image";



export default function GreyCleanCVResume({ data }) {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [profilePic, setprofilePic] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);



    const [formData, setFormData] = useState({
        profileImg: 'uploads/width_800.webp',
        fullname: 'Dani Schwaiger',
        professionalTitle: 'web DEVELOPER',
        personalDescription: `I am a qualified and professional web developer with five years of experience in database administration and website design. Strong creative and analytical skills. Team player with an eye for detail. `,
        mobile: '123-456-7890',
        email: 'hello@reallygreatsite.com',
        website: 'reallygreatsite.com',
        address: '123 Anywhere St., Any City',
    });

    const [experiences, setExperiences] = useState([
        {
            year: '2016 - Present',
            title: 'Applications developer',
            companyAndLocation: 'Really Great Company',
            description:
                'Database administration and website design. Built the logic for a streamlined ad-serving platform that scaled. Educational institutions and online classroom management',
        },
        {
            year: '2014 - 2016',
            title: 'Web content manager',
            companyAndLocation: 'Really Great Company',
            description:
                'Database administration and website design. Built the logic for a streamlined ad-serving platform that scaled. Educational institutions and online classroom management',
        },
        {
            year: '2010 - 2014',
            title: 'Analysis content',
            companyAndLocation: 'Really Great Company',
            description:
                'Database administration and website design. Built the logic for a streamlined ad-serving platform that scaled. Educational institutions and online classroom management',
        },
    ]);

    const [education, setEducation] = useState([
        {
            major: 'secondary school',
            university: 'Really Great High School',
            year: '2010 - 2014',
        },
        {
            major: 'Bachelor of Technology',
            university: 'Really Great High School',
            year: '2014 - 2016',
        },
    ]);

    const [skills, setSkills] = useState([
        ' Web Design',
        'Design Thinking',
        'Wireframe Creation',
        'Front End Coding',
        'Problem-Solving',
        'Computer Literacy',
        'Project Management Tools',
        'Strong Communication',
    ]);

    const handleFormDataChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setprofilePic(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleExperienceChange = (index, field, value) => {
        const updatedExperiences = [...experiences];
        updatedExperiences[index][field] = value;
        setExperiences(updatedExperiences);
    };

    const handleEducationChange = (index, field, value) => {
        const updatedEducation = [...education];
        updatedEducation[index][field] = value;
        setEducation(updatedEducation);
    };

    const handleSkillChange = (index, value) => {
        const updatedSkills = [...skills];
        updatedSkills[index] = value;
        setSkills(updatedSkills);
    };


    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("profileImg", profilePic);
            formDataToSend.append("formData", JSON.stringify(formData));
            formDataToSend.append("education", JSON.stringify(education));
            formDataToSend.append("experiences", JSON.stringify(experiences));
            formDataToSend.append("skills", JSON.stringify(skills));

            await axios.post('http://localhost:8000/saveToDownload', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (error) {
            toast.error('Missing data...! Failed to export');
        }
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const downloadAsJPG = async () => {
        const input = document.getElementById('resume');
        htmlToImage.toJpeg(input).then((dataUrl) => {
            const a = document.createElement("a")
            a.href = dataUrl;
            a.download = "resume.jpg";
            a.click()
        }).catch((err) => {
            console.log(err);
            toast.error("Something went wrong!");
        });

    };

    const downloadAsPNG = async () => {
        const input = document.getElementById('resume');
        htmlToImage.toPng(input).then((dataUrl) => {
            const a = document.createElement("a")
            a.href = dataUrl;
            a.download = "resume.png";
            a.click()
        }).catch((err) => {
            console.log(err);
            toast.error("Something went wrong!");
        });
    };

    const downloadAsPDF = async () => {
        const input = document.getElementById('resume');
        htmlToImage.toPng(input).then((dataUrl) => {
            const a4Width = 210;
            const a4Height = 297;
            var pdf = new jsPDF({
                orientation: "p",
                unit: "mm",
                format: [a4Width, a4Height],
            });
            const aspectRatio = a4Width / a4Height;
            const imgWidth = a4Width;
            const imgHeight = a4Width / aspectRatio;

            const verticalMargin = (a4Height - imgHeight) / 2;
            pdf.addImage(dataUrl, "PNG", 0, verticalMargin, imgWidth, imgHeight);
            pdf.save("resume.pdf");
        }).catch((err) => {
            console.log(err);
            toast.error("Something went wrong!");
        });
    };

    const downloadAsSVG = async () => {
        const input = document.getElementById('resume');
        htmlToImage.toSvg(input).then((dataUrl) => {
            const a = document.createElement("a")
            a.href = dataUrl;
            a.download = "resume.svg";
            a.click()
        }).catch((err) => {
            console.log(err);
            toast.error("Something went wrong!");
        });
    };


    return (
        <div className='w-full flex flex-col min-h-screen font-raleway'>
            {/* BreadCrump Section */}
            <div className='w-full flex items-center justify-between p-5'>
                <div className='flex items-center gap-2'>
                    <Link to={'/'} className='flex items-center justify-center text-txtPrimary'>
                        <FaHome className='text-2xl text-cyan-600 cursor-pointer hover:text-cyan-700' />
                    </Link>
                    <p className='text-cyan-600 font-semibold cursor-pointer hover:text-cyan-700' onClick={() => navigate(-1)}>
                        / {data.title} /
                    </p>
                    <p className='text-cyan-600 font-semibold cursor-pointer hover:text-cyan-700'>Edit</p>
                </div>
                <div>
                    <FaUser className='text-xl cursor-pointer' />
                </div>
            </div>
            <div className="pt-10 flex-grow flex justify-center items-center font-raleway bg-gray-200 overflow-y-auto">
                <div className="relative w-full lg:w-3/4 xl:w-1/2 mt-10 h-full border shadow-sm bg-white">
                    <button onClick={() => { handleSubmit(); openModal(); }} className="absolute right-4 -top-7 text-gray-600 text-2xl rounded">
                        <CiExport />
                    </button>
                    <button onClick={() => setIsEditing(!isEditing)} className="absolute right-14 -top-7 text-gray-600 text-2xl rounded">
                        {isEditing ? <CiUnlock /> : <CiLock />}
                    </button>
                    <div id="resume" className="py-6 bg-white shadow-lg">

                        {/* Header section of Resume */}
                        <header className="relative bg-zinc-100 flex flex-col md:flex-row justify-between items-center text-center mt-4 mb-12 px-4 md:px-8">
                            <div className="w-full md:w-3/4 flex flex-col justify-start gap-y-2">
                                <input
                                    type="text"
                                    name="fullname"
                                    value={formData.fullname}
                                    onChange={handleFormDataChange}
                                    className="text-3xl text-gray-600 font-semibold w-full uppercase bg-transparent p-1"
                                    style={{ letterSpacing: '0.3em' }}
                                    disabled={!isEditing}
                                />
                                <input
                                    type="text"
                                    name="professionalTitle"
                                    value={formData.professionalTitle}
                                    onChange={handleFormDataChange}
                                    className="text-lg font-normal text-gray-600 w-full uppercase bg-transparent p-1"
                                    style={{ letterSpacing: '0.3em' }}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="w-1/4 relative">
                                <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="relative w-36 flex justify-center items-center mb-4">
                                    <img className="rounded-full w-36 h-36 object-cover" src={previewImage || `http://localhost:8000/${formData.profileImg}`} />
                                    {isHovered && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-full">
                                            <label htmlFor="file-input" className="font-bold uppercase text-sm text-gray-100 cursor-pointer">
                                                <FaPen className="text-lg" />
                                            </label>
                                            <input
                                                id="file-input"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </header>

                        {/* Body Section */}
                        <section className="px-4 md:px-8 flex flex-col md:flex-row">

                            {/* Contact Section */}
                            <section className="pb-4 w-full md:w-1/3 border-r-0 md:border-r-2 border-b-2 md:border-b-2 border-gray-400">
                                <ul className="flex flex-col gap-2">
                                    <li className="flex items-center gap-2">
                                        <GiRotaryPhone className="text-lg text-gray-600 font-medium" />
                                        <input
                                            type="text"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleFormDataChange}
                                            className="w-full text-xs text-gray-500 p-1 bg-transparent"
                                            style={{ letterSpacing: '0.1em' }}
                                            disabled={!isEditing}
                                        />
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <MdEmail className="text-lg text-gray-600 font-medium" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleFormDataChange}
                                            className="w-full text-xs text-gray-500 p-1"
                                            style={{ letterSpacing: '0.1em' }}
                                            disabled={!isEditing}
                                        />
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <IoLocationOutline className="text-lg text-gray-600 font-medium" />
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleFormDataChange}
                                            className="w-full text-xs text-gray-500 p-1"
                                            style={{ letterSpacing: '0.1em' }}
                                            disabled={!isEditing}
                                        />
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <BsGlobe className="text-lg text-gray-600 font-medium" />
                                        <input
                                            type="text"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleFormDataChange}
                                            className="w-full text-xs text-gray-500 p-1"
                                            style={{ letterSpacing: '0.1em' }}
                                            disabled={!isEditing}
                                        />
                                    </li>
                                </ul>
                            </section>

                            {/* Profile Section */}
                            <section className="pb-4 pl-0 md:pl-5 w-full md:w-2/3 border-b-2 border-gray-400">
                                <h3 className="text-md text-gray-500 font-bold mb-5" style={{ letterSpacing: '0.1em' }}>
                                    PROFILE
                                </h3>
                                <textarea
                                    name="personalDescription"
                                    value={formData.personalDescription}
                                    onChange={handleFormDataChange}
                                    rows={4}
                                    spellCheck
                                    className="w-full text-xs text-gray-500 p-1 bg-transparent"
                                    style={{ letterSpacing: '0.05em', lineHeight: '1.5' }}
                                    disabled={!isEditing}
                                />
                            </section>
                        </section>

                        {/* Bottom Section */}
                        <section className="px-4 md:px-8 flex flex-col md:flex-row">

                            {/* Skills Section */}
                            <section className="w-full md:w-1/3 flex flex-col">
                                <section className="pb-7 border-r-0 md:border-r-2 border-b-2 border-gray-400">
                                    <h3 className="text-md text-gray-500 font-bold my-6 uppercase" style={{ letterSpacing: '0.1em' }}>
                                        Skills
                                    </h3>
                                    <ul className="list-disc ml-6 text-gray-500">
                                        {skills.map((skill, index) => (
                                            <li key={index}>
                                                <input
                                                    type="text"
                                                    value={skill}
                                                    onChange={(e) => handleSkillChange(index, e.target.value)}
                                                    className="w-full text-xs text-gray-500 p-1"
                                                    style={{ letterSpacing: '0.1em' }}
                                                    disabled={!isEditing}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                {/* Education Section */}
                                <section className="pt-4 border-r-0 md:border-r-2 border-gray-400">
                                    <h3 className="text-md text-gray-500 font-bold my-6 uppercase" style={{ letterSpacing: '0.1em' }}>
                                        Education
                                    </h3>
                                    {education.map((edu, index) => (
                                        <div key={index} className="mb-2">
                                            <input
                                                type="text"
                                                value={edu.major}
                                                onChange={(e) => handleEducationChange(index, 'major', e.target.value)}
                                                className="w-full uppercase font-bold text-xs text-gray-500 p-1"
                                                style={{ letterSpacing: '0.1em' }}
                                                disabled={!isEditing}
                                            />
                                            <input
                                                type="text"
                                                value={edu.university}
                                                onChange={(e) => handleEducationChange(index, 'university', e.target.value)}
                                                className="w-full text-xs text-gray-500 p-1"
                                                style={{ letterSpacing: '0.1em' }}
                                                disabled={!isEditing}
                                            />
                                            <input
                                                type="text"
                                                value={edu.year}
                                                onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                                                className="w-full text-xs text-gray-500 p-1"
                                                style={{ letterSpacing: '0.1em' }}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    ))}
                                </section>
                            </section>

                            {/* Experience Section */}
                            <section className="w-full md:w-2/3 pb-4 pl-0 md:pl-5 font-raleway border-gray-400">
                                <h3 className="text-md text-gray-700 font-bold my-6 uppercase" style={{ letterSpacing: '0.1em' }}>
                                    Experience
                                </h3>
                                {experiences.map((exp, index) => (
                                    <div key={index} className="mb-3">
                                        <input
                                            type="text"
                                            value={exp.position}
                                            onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                            className="w-full uppercase font-bold text-xs text-gray-500 p-1"
                                            style={{ letterSpacing: '0.1em' }}
                                            disabled={!isEditing}
                                        />
                                        <input
                                            type="text"
                                            value={exp.company}
                                            onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                            className="w-full text-xs text-gray-500 p-1"
                                            style={{ letterSpacing: '0.1em' }}
                                            disabled={!isEditing}
                                        />
                                        <input
                                            type="text"
                                            value={exp.year}
                                            onChange={(e) => handleExperienceChange(index, 'year', e.target.value)}
                                            className="w-full text-xs text-gray-500 p-1"
                                            style={{ letterSpacing: '0.1em' }}
                                            disabled={!isEditing}
                                        />
                                        <textarea
                                            value={exp.description}
                                            onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                            rows={3}
                                            className="w-full text-xs text-gray-500 p-1 bg-transparent"
                                            style={{ letterSpacing: '0.05em', lineHeight: '1.5' }}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                ))}
                            </section>
                        </section>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Template Preview"
                className="fixed inset-0 flex items-center lg:left-3/4 justify-center z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
            >
                <div className="bg-white rounded-lg lg:rounded-r-none p-6 w-full max-w-md md:max-w-md lg:max-w-md mx-4 lg:mx-0 lg:h-full overflow-y-auto">
                    <div className="flex justify-end items-center pb-4">
                        <MdClear onClick={closeModal} className="text-2xl text-gray-500 hover:text-gray-700 cursor-pointer" />
                    </div>
                    <div className='flex flex-col gap-4'>
                        {/* Title of Template in Preview section */}
                        <h2 className="text-xl md:text-2xl font-bold">{data.title}</h2>

                        {/* Downloadable buttons (In variations) section */}
                        <button onClick={downloadAsJPG} className='w-full p-3 rounded-md flex items-center gap-3 hover:bg-gray-200'>
                            <CiImageOn className='text-cyan-600 text-2xl' />
                            <div className='flex flex-col items-start'>
                                <h2 className="text-md font-medium text-gray-600">JPG</h2>
                                <p className='text-xs text-gray-500 font-medium'>Best for sharing</p>
                            </div>
                        </button>
                        <button onClick={downloadAsPNG} className='w-full p-3 rounded-md flex items-center gap-3 hover:bg-gray-200'>
                            <CiImageOn className='text-cyan-600 text-2xl' />
                            <div className='flex flex-col items-start'>
                                <h2 className="text-md font-medium text-gray-600">PNG</h2>
                                <p className='text-xs text-gray-500 font-medium'>Best for complex images, illustrations</p>
                            </div>
                        </button>
                        <button onClick={downloadAsPDF} className='w-full p-3 rounded-md flex items-center gap-3 hover:bg-gray-200'>
                            <BsFiletypePdf className='text-cyan-600 text-2xl' />
                            <div className='flex flex-col items-start'>
                                <h2 className="text-md font-medium text-gray-600">PDF Standard</h2>
                                <p className='text-xs text-gray-500 font-medium'>Best for documents (and emailing)</p>
                            </div>
                        </button>
                        <button onClick={downloadAsSVG} className='w-full p-3 rounded-md flex items-center gap-3 hover:bg-gray-200'>
                            <CiImageOn className='text-cyan-600 text-2xl' />
                            <div className='flex flex-col items-start'>
                                <h2 className="text-md font-medium text-gray-600">SVG</h2>
                                <p className='text-xs text-gray-500 font-medium'>Best for web design and animation</p>
                            </div>
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
