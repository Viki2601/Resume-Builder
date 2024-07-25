import React, { useState } from 'react';
import { FaHome, FaPen, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { MdClear, MdEmail } from 'react-icons/md';
import { IoLocationOutline } from 'react-icons/io5';
import { CiLock, CiUnlock, CiExport, CiImageOn, CiMobile3 } from "react-icons/ci";
import { BsFiletypePdf, BsGlobe } from 'react-icons/bs';
import { toast } from 'react-toastify';
import axios from 'axios';
import Modal from 'react-modal';
import jsPDF from 'jspdf';
import * as htmlToImage from "html-to-image";



export default function WhiteandBeigeSimpleStudentCVResume({ data }) {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [profilePic, setprofilePic] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const url = "https://resume-builder-server-ea28.onrender.com";



    const [formData, setFormData] = useState({
        profileImg: 'uploads/Adeline Palmerston.png',
        fullname: 'Adeline Palmerston',
        professionalTitle: 'Student',
        personalDescription: `Business administration student. I consider myself a responsible and orderly person. I am looking forward to my first work experience.`,
        mobile: '123-456-7890',
        email: 'hello@reallygreatsite.com',
        address: '123 Anywhere St., Any City',
    });

    const [experiences, setExperiences] = useState([
        {
            companyAndLocation: 'Ingoude Company',
            description:
                'Participation in collections to distribute in low-income schools.',
        },

    ]);

    const [education, setEducation] = useState([
        {
            major: 'Borcelle College',
            about: 'Business Administration career, in progress.',
            university: 'Borcelle University',
            year: '2018-2022',
        },
    ]);

    const [skills, setSkills] = useState([
        'Text processor.',
        'Spreadsheet.',
        'Slide presentation.',
    ]);

    const [languages, setLanguages] = useState([
        'Native English.',
        'Advanced Spanish.',
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

    const handleLanguageChange = (index, value) => {
        const updatedLanguages = [...languages];
        updatedLanguages[index] = value;
        setLanguages(updatedLanguages);
    };


    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("profileImg", profilePic);
            formDataToSend.append("formData", JSON.stringify(formData));
            formDataToSend.append("education", JSON.stringify(education));
            formDataToSend.append("experiences", JSON.stringify(experiences));
            formDataToSend.append("skills", JSON.stringify(skills));
            formDataToSend.append("languages", JSON.stringify(languages));

            await axios.post(`${url}/saveToDownload`, formDataToSend, {
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
        <div className='w-full flex flex-col min-h-screen font-montserrat'>
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
            <div className='pt-10 flex-grow flex justify-center items-center font-montserrat bg-gray-200 overflow-y-auto'>
                <div className='relative w-full lg:w-3/4 xl:w-1/2 mt-10 h-full border shadow-sm bg-white'>
                    <button onClick={() => { handleSubmit(); openModal(); }} className='absolute right-4 -top-7 text-gray-600 text-2xl rounded'>
                        <CiExport />
                    </button>
                    <button onClick={() => setIsEditing(!isEditing)} className='absolute right-14 -top-7 text-gray-600 text-2xl rounded'>
                        {isEditing ? <CiUnlock /> : <CiLock />}
                    </button>
                    <div id='resume' className=' bg-white shadow-lg'>

                        {/* Header section of Resume */}
                        <header className='flex flex-col items-center text-center bg-customColor2 font-tenorSans'>
                            <div className='w-full px-10 py-8 flex flex-col justify-center items-center gap-y-2'>
                                <div>
                                    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className='relative w-28 flex justify-center items-center rounded-lg border-2 border-gray-900'>
                                        <img className="rounded-lg w-28 h-28 object-cover" src={previewImage || `${url}/${formData.profileImg}`} />
                                        {isHovered && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-lg">
                                                <label htmlFor="file-input" className="font-bold uppercase text-sm text-gray-100 cursor-pointer">
                                                    <FaPen className='text-lg' />
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
                                <input
                                    type='text'
                                    name='fullname'
                                    value={formData.fullname}
                                    onChange={handleFormDataChange}
                                    className='text-4xl text-gray-900 font-medium w-full text-center bg-transparent px-2'
                                    disabled={!isEditing}
                                />
                                <input
                                    type='text'
                                    name='professionalTitle'
                                    value={formData.professionalTitle}
                                    onChange={handleFormDataChange}
                                    className='text-xl font-normal text-gray-900 w-full text-center bg-transparent p-1'
                                    disabled={!isEditing}
                                />
                            </div>
                        </header>

                        {/* Body Section */}
                        <section className='flex'>

                            {/* Left Section */}
                            <section className='pb-4 pl-10 w-full md:w-3/4 border-b border-gray-900 bg-customColor1 font-tenorSans'>
                                <div className='mt-10 mb-5 mr-6'>
                                    <h3 className='font-semibold text-zinc-900 uppercase py-5'>
                                        PROFILE
                                    </h3>
                                    <textarea
                                        name='personalDescription'
                                        value={formData.personalDescription}
                                        onChange={handleFormDataChange}
                                        rows={5}
                                        spellCheck
                                        className='w-full text-sm text-gray-900 p-1 bg-transparent'
                                        disabled={!isEditing}
                                    />
                                </div>
                                <ul className='flex flex-col gap-2 my-5 mr-6'>
                                    <h1 className='font-semibold text-zinc-900 uppercase py-5' >Contact</h1>
                                    <li className='flex items-center gap-2'>
                                        <CiMobile3 className='text-lg text-gray-900 font-medium' />
                                        <input
                                            type='text'
                                            name='mobile'
                                            value={formData.mobile}
                                            onChange={handleFormDataChange}
                                            className='w-full text-sm text-gray-900 p-1 bg-transparent'
                                            disabled={!isEditing}
                                        />
                                    </li>
                                    <li className='flex items-center gap-2'>
                                        <MdEmail className='text-lg text-gray-900 font-medium' />
                                        <input
                                            type='email'
                                            name='email'
                                            value={formData.email}
                                            onChange={handleFormDataChange}
                                            className='w-full text-sm text-gray-900 p-1 bg-transparent'
                                            disabled={!isEditing}
                                        />
                                    </li>
                                    <li className='flex items-center gap-2'>
                                        <IoLocationOutline className='text-lg text-gray-900 font-medium' />
                                        <input
                                            type='text'
                                            name='address'
                                            value={formData.address}
                                            onChange={handleFormDataChange}
                                            className='w-full text-sm text-gray-900 p-1 bg-transparent'
                                            disabled={!isEditing}
                                        />
                                    </li>
                                </ul>
                            </section>

                            {/* Right Section */}
                            <section className='pb-4 pl-5 mr-6 w-full font-tenorSans'>
                                <ul className='flex flex-col gap-2 my-5'>
                                    <h1 className='font-semibold text-zinc-900 uppercase pt-5'>Education</h1>
                                    {education.map((edu, index) => (
                                        <div key={index}>
                                            <input
                                                type='text'
                                                value={edu.university}
                                                onChange={(e) => handleEducationChange(index, 'university', e.target.value)}
                                                className='w-full mt-2 text-sm bg-transparent text-gray-900 p-1'
                                                disabled={!isEditing}
                                            />
                                            <input
                                                type='text'
                                                value={edu.about}
                                                onChange={(e) => handleEducationChange(index, 'about', e.target.value)}
                                                className='w-full mb-3 text-xs bg-transparent text-gray-900 p-1'
                                                disabled={!isEditing}
                                            />
                                            <input
                                                type='text'
                                                value={edu.major}
                                                onChange={(e) => handleEducationChange(index, 'major', e.target.value)}
                                                className='w-full mt-2 text-sm bg-transparent text-gray-900 p-1'
                                                disabled={!isEditing}
                                            />
                                            <input
                                                type='text'
                                                value={edu.year}
                                                onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                                                className='w-full mb-2 text-sm bg-transparent text-gray-900 p-1'
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    ))}
                                </ul>
                                <ul className='flex flex-col gap-1 pb-4 mr-4'>
                                    <h1 className='font-semibold text-zinc-900 uppercase py-5'>Languages</h1>
                                    {languages.map((language, index) => (
                                        <li key={index}>
                                            <input
                                                type='text'
                                                value={language}
                                                onChange={(e) => handleLanguageChange(index, e.target.value)}
                                                className='w-full text-sm bg-transparent text-gray-900 p-1'
                                                disabled={!isEditing}
                                            />
                                        </li>
                                    ))}
                                </ul>
                                <ul className='flex flex-col gap-2 pb-4 mr-4'>
                                    <h1 className='font-semibold text-zinc-900 uppercase pt-5'>Computer Skills</h1>
                                    {skills.map((skill, index) => (
                                        <li key={index}>
                                            <input
                                                type='text'
                                                value={skill}
                                                onChange={(e) => handleSkillChange(index, e.target.value)}
                                                className='w-full text-sm bg-transparent text-gray-900 p-1'
                                                disabled={!isEditing}
                                            />
                                        </li>
                                    ))}
                                </ul>
                                <ul className='flex flex-col gap-2 my-5 mr-6'>
                                    <h3 className='font-semibold text-zinc-900 uppercase py-5'>
                                        Experience
                                    </h3>
                                    {experiences.map((exp, index) => (
                                        <div key={index} className='mb-2'>
                                            <input
                                                type='text'
                                                value={exp.companyAndLocation}
                                                onChange={(e) => handleExperienceChange(index, 'companyAndLocation', e.target.value)}
                                                className='w-full mb-4 font-semibold text-sm text-gray-900 p-1 bg-transparent'
                                                style={{ letterSpacing: '0.1em' }}
                                                disabled={!isEditing}
                                            />
                                            <textarea
                                                value={exp.description}
                                                rows={5}
                                                spellCheck
                                                onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                                className='w-full text-sm text-gray-900 p-1 bg-transparent'
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    ))}
                                </ul>
                            </section>
                        </section>
                    </div>

                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Template Preview"
                className="fixed inset-0 flex flex-col items-center justify-center left-3/4 z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
            >
                <div className="bg-white rounded-l-lg p-6 max-w-sm w-full h-full mx-4 overflow-x-auto">
                    <div className="flex justify-end items-center pb-4">
                        <MdClear onClick={closeModal} className="text-2xl text-gray-500 hover:text-gray-700" />
                    </div>
                    <div className='flex pb-4'>
                        <div className='w-full flex flex-col gap-2'>

                            {/* Title of Template in Preview section */}
                            <h2 className="text-2xl font-bold font-nunito">{data.title}</h2>

                            {/* Preview of the edited template */}
                            <div></div>

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
                                    <p className='text-xs text-gray-500 font-medium'>Best for complex images, illustratiions</p>
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
                </div>
            </Modal>
        </div>
    );
}
