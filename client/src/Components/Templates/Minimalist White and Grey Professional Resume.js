import React, { useState } from 'react';
import { FaHome, FaUser } from 'react-icons/fa';
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



export default function MinimalistWhiteandGreyProfessionalResume({ data }) {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);



    const [formData, setFormData] = useState({
        fullname: 'Jonathan Patterson',
        professionalTitle: 'gRAPHIC DESIGNER',
        personalDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sagittis pretium nisl, nec commodo est. Fusce laoreet consequat sapien, eu fermentum ex pulvinar eget. Praesent hendrerit nulla in varius pharetra. Fusce facilisis venenatis lacus in lobortis. Fusce vulputate iaculis mauris. Nunc risus arcu, tempor vel dignissim porta, vulputate id quam. Vestibulum pellentesque augue in lobortis ullamcorper. In eleifend nisl faucibus molestie porttitor.   augue in lobortis ullamcorper. `,
        mobile: '123-456-7890',
        email: 'hello@reallygreatsite.com',
        website: 'reallygreatsite.com',
        address: '123 Anywhere St., Any City',
    });

    const [experiences, setExperiences] = useState([
        {
            year: '2020-2022',
            title: 'Your Job Position here',
            companyAndLocation: 'Company name',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sagittis pretium nisl, nec commodo est. Fusce laoreet consequat sapien, eu fermentum ex pulvinar eget. Praesent hendrerit nulla in varius pharetra. Fusce facilisis venenatis lacus in lobortis. Fusce vulputate iaculis mauris. Nunc risus arcu, tempor vel dignissim porta, vulputate id quam. Vestibulum pellentesque augue in lobortis ullamcorper. In eleifend nisl faucibus molestie porttitor. Fusce nec tristique est. Aliquam erat volutpat. Aenean nisi neque, rhoncus in ex eget, egestas pharetra sapien. In vehicula efficitur risus a eleifend. Sed non efficitur libero. Fusce dui nunc, accumsan sodales semper mattis, fringilla vitae nisl. Maecenas sed nulla eget velit tristique pharetra. Praesent a scelerisque orci.Aliquam sagittis mi ut neque auctor, et consectetur massa placerat. Nulla sit amet tortor in purus auctor tristique.',
        },
        {
            year: '2020-2022',
            title: 'Your Job Position here',
            companyAndLocation: 'Company name',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sagittis pretium nisl, nec commodo est. Fusce laoreet consequat sapien, eu fermentum ex pulvinar eget. Praesent hendrerit nulla in varius pharetra. Fusce facilisis venenatis lacus in lobortis. Fusce vulputate iaculis mauris. Nunc risus arcu, tempor vel dignissim porta, vulputate id quam. Vestibulum pellentesque augue in lobortis ullamcorper. In eleifend nisl faucibus molestie porttitor. Fusce nec tristique est. Aliquam erat volutpat. Aenean nisi neque, rhoncus in ex eget, egestas pharetra sapien. In vehicula efficitur risus a eleifend. Sed non efficitur libero. Fusce dui nunc, accumsan sodales semper mattis, fringilla vitae nisl. Maecenas sed nulla eget velit tristique pharetra. Praesent a scelerisque orci.Aliquam sagittis mi ut neque auctor, et consectetur massa placerat. Nulla sit amet tortor in purus auctor tristique.',
        },
    ]);

    const [education, setEducation] = useState([
        {
            major: 'Your Degree Name',
            about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
            university: 'Your Institution Name',
            year: '2016-2018',
        },
        {
            major: 'Your Degree Name',
            about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
            university: 'Your Institution Name',
            year: '2016-2018',
        },
    ]);

    const [skills, setSkills] = useState([
        'Skill name here',
        'Your Skill',
        'Special skills',
        'List your skills',
    ]);

    const [languages, setLanguages] = useState([
        'English',
        'German',
        'Spanish',
    ]);

    const handleFormDataChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
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
            formDataToSend.append("formData", JSON.stringify(formData));
            formDataToSend.append("education", JSON.stringify(education));
            formDataToSend.append("experiences", JSON.stringify(experiences));
            formDataToSend.append("skills", JSON.stringify(skills));
            formDataToSend.append("languages", JSON.stringify(languages));

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
                    <div id='resume' className='pt-6 bg-white shadow-lg'>

                        {/* Header section of Resume */}
                        <header className='flex flex-col items-center text-center font-montserrat'>
                            <div className='w-full px-10 py-8 flex flex-col justify-center items-center gap-y-2 border-b border-gray-900'>
                                <input
                                    type='text'
                                    name='fullname'
                                    value={formData.fullname}
                                    onChange={handleFormDataChange}
                                    className='lg:text-4xl text-gray-600 font-medium w-full text-center uppercase bg-transparent py-1 px-2'
                                    style={{ letterSpacing: '0.3em' }}
                                    disabled={!isEditing}
                                />
                                <input
                                    type='text'
                                    name='professionalTitle'
                                    value={formData.professionalTitle}
                                    onChange={handleFormDataChange}
                                    className='lg:text-lg font-normal text-gray-600 w-full text-center uppercase bg-transparent p-1'
                                    style={{ letterSpacing: '0.2em' }}
                                    disabled={!isEditing}
                                />
                            </div>
                        </header>

                        {/* Body Section */}
                        <section className='flex'>

                            {/* Left Section */}
                            <section className='pb-4 pl-10 w-full md:w-1/2 border-b border-gray-900 bg-zinc-100 font-montserrat'>
                                <ul className='flex flex-col gap-2 pb-4 mr-4 border-b border-dashed border-gray-700'>
                                    <h1 className='font-semibold text-zinc-500 uppercase pt-5' style={{ letterSpacing: '0.1rem' }}>Contact</h1>
                                    <li className='flex items-center gap-2'>
                                        <CiMobile3 className='lg:text-lg text-gray-600 font-medium' />
                                        <input
                                            type='text'
                                            name='mobile'
                                            value={formData.mobile}
                                            onChange={handleFormDataChange}
                                            className='w-full text-xs text-gray-500 p-1 bg-transparent'
                                            disabled={!isEditing}
                                        />
                                    </li>
                                    <li className='flex items-center gap-2'>
                                        <MdEmail className='lg:text-lg text-gray-600 font-medium' />
                                        <input
                                            type='email'
                                            name='email'
                                            value={formData.email}
                                            onChange={handleFormDataChange}
                                            className='w-full text-xs text-gray-500 p-1 bg-transparent'
                                            disabled={!isEditing}
                                        />
                                    </li>
                                    <li className='flex items-center gap-2'>
                                        <BsGlobe className='lg:text-lg text-gray-600 font-medium' />
                                        <input
                                            type='text'
                                            name='website'
                                            value={formData.website}
                                            onChange={handleFormDataChange}
                                            className='w-full text-xs text-gray-500 p-1 bg-transparent'
                                            disabled={!isEditing}
                                        />
                                    </li>
                                    <li className='flex items-center gap-2'>
                                        <IoLocationOutline className='lg:text-lg text-gray-600 font-medium' />
                                        <input
                                            type='text'
                                            name='address'
                                            value={formData.address}
                                            onChange={handleFormDataChange}
                                            className='w-full text-xs text-gray-500 p-1 bg-transparent'
                                            disabled={!isEditing}
                                        />
                                    </li>
                                </ul>
                                <ul className='flex flex-col gap-2 pb-4 mr-4 border-b border-dashed border-gray-700'>
                                    <h1 className='font-semibold text-zinc-500 uppercase pt-5' style={{ letterSpacing: '0.1rem' }}>Skills</h1>
                                    {skills.map((skill, index) => (
                                        <li key={index}>
                                            <input
                                                type='text'
                                                value={skill}
                                                onChange={(e) => handleSkillChange(index, e.target.value)}
                                                className='w-full text-xs bg-transparent text-gray-500 p-1'
                                                disabled={!isEditing}
                                            />
                                        </li>
                                    ))}
                                </ul>
                                <ul className='flex flex-col gap-2 mr-4 border-b border-dashed border-gray-700'>
                                    <h1 className='font-semibold text-zinc-500 uppercase pt-5' style={{ letterSpacing: '0.1rem' }}>Education</h1>
                                    {education.map((edu, index) => (
                                        <div key={index}>
                                            <input
                                                type='text'
                                                value={edu.major}
                                                onChange={(e) => handleEducationChange(index, 'major', e.target.value)}
                                                className='w-full mb-2 uppercase font-bold text-xs bg-transparent text-gray-500 p-1'
                                                disabled={!isEditing}
                                            />
                                            <input
                                                type='text'
                                                value={edu.university}
                                                onChange={(e) => handleEducationChange(index, 'university', e.target.value)}
                                                className='w-full my-2 text-xs bg-transparent text-gray-500 p-1'
                                                disabled={!isEditing}
                                            />
                                            <input
                                                type='text'
                                                value={edu.year}
                                                onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                                                className='w-full my-2 text-xs bg-transparent text-gray-500 p-1'
                                                disabled={!isEditing}
                                            />
                                            <input
                                                type='text'
                                                value={edu.about}
                                                onChange={(e) => handleEducationChange(index, 'about', e.target.value)}
                                                className='w-full my-2 text-xs bg-transparent text-gray-500 p-1'
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    ))}
                                </ul>
                                <ul className='flex flex-col gap-2 pb-4 mr-4'>
                                    <h1 className='font-semibold text-zinc-500 uppercase py-5' style={{ letterSpacing: '0.1rem' }}>Languages</h1>
                                    {languages.map((language, index) => (
                                        <li key={index}>
                                            <input
                                                type='text'
                                                value={language}
                                                onChange={(e) => handleLanguageChange(index, e.target.value)}
                                                className='w-full text-xs bg-transparent text-gray-500 p-1'
                                                disabled={!isEditing}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* Right Section */}
                            <section className='pb-4 pl-5 mr-6 w-full border-b border-gray-900'>
                                <h3 className='font-semibold text-zinc-500 uppercase py-5' style={{ letterSpacing: '0.1em' }}>
                                    PROFILE
                                </h3>
                                <textarea
                                    name='personalDescription'
                                    value={formData.personalDescription}
                                    onChange={handleFormDataChange}
                                    rows={7}
                                    spellCheck
                                    className='w-full text-xs text-gray-500 p-1 pr-5'
                                    disabled={!isEditing}
                                />
                                <section className='w-full pb-4 font-montserrat border-gray-400'>
                                    <h3 className='font-semibold text-zinc-500 uppercase py-5' style={{ letterSpacing: '0.1em' }}>
                                        Experience
                                    </h3>
                                    {experiences.map((exp, index) => (
                                        <div key={index} className='mb-2'>
                                            <input
                                                type='text'
                                                value={exp.title}
                                                onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                                                className='w-full uppercase font-bold text-xs lg:text-sm text-gray-600 p-1'
                                                style={{ letterSpacing: '0.1em' }}
                                                disabled={!isEditing}
                                            />
                                            <div className='flex justify-between py-3'>
                                                <input
                                                    type='text'
                                                    value={exp.companyAndLocation}
                                                    onChange={(e) => handleExperienceChange(index, 'companyAndLocation', e.target.value)}
                                                    className='w-full font-semibold text-xs lg:text-sm text-gray-500 p-1'
                                                    style={{ letterSpacing: '0.1em' }}
                                                    disabled={!isEditing}
                                                />
                                                <input
                                                    type='text'
                                                    value={exp.year}
                                                    onChange={(e) => handleExperienceChange(index, 'year', e.target.value)}
                                                    className='w-full font-semibold text-end text-xs text-gray-500 p-1'
                                                    style={{ letterSpacing: '0.1em' }}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <textarea
                                                value={exp.description}
                                                rows={13}
                                                spellCheck
                                                onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                                className='w-full text-xs text-gray-500 p-1'
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    ))}
                                </section>
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
