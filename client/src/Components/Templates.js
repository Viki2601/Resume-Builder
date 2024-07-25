import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaAngleDown, FaBan, FaPen, FaMobile, FaUpload, FaAngleRight, FaStar } from 'react-icons/fa';
import { CiStar } from "react-icons/ci";
import Modal from 'react-modal';
import Cookies from 'js-cookie';
import { MdClear } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Templates() {
  const [email] = useState(Cookies.get('email'));
  const url = "https://resume-builder-backend-1qao.onrender.com";
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [similarTemplates, setSimilarTemplates] = useState([]);
  const [currentSimilarIndex, setCurrentSimilarIndex] = useState(0);
  const [starredTemplates, setStarredTemplates] = useState(new Set());
  const navigate = useNavigate();

  const initialTags = [
    "Software Engineer", "Front-end Developer", "Back-end Developer", "Full-stack Developer", "Web Developer", "UI/UX Designer",
    "Graphic Designer", "Data Scientist", "Product Manager", "Project Manager", "Business Analyst", "Marketing Manager",
    "Sales Representative", "Customer Service Representative", "HR Manager", "Financial Analyst", "Content Writer",
    "Teacher/Educator", "Healthcare Professional", "Legal Counsel"
  ];

  const getAllTemplates = async () => {
    try {
      const res = await axios.post(`${url}/getAllTemplates`);
      setTemplates(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getSimilarTemplates = async (tags) => {
    try {
      const res = await axios.post(`${url}/getSimilarTemplates`, { tags });
      setSimilarTemplates(res.data);
      setCurrentSimilarIndex(0);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllTemplates();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setDropdownOpen(false);
  };

  const filteredTemplates = selectedCategory === "All categories"
    ? templates
    : templates.filter(template => template.tags.includes(selectedCategory));

  const openModal = (template) => {
    setPreviewTemplate(template);
    setModalIsOpen(true);
    getSimilarTemplates(template.tags);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setPreviewTemplate(null);
    setSimilarTemplates([]);
  };

  const handleNextTemplate = () => {
    setCurrentSimilarIndex((prevIndex) => (prevIndex + 1) % similarTemplates.length);
    setPreviewTemplate(similarTemplates[(currentSimilarIndex + 1) % similarTemplates.length]);
  };


  const handleAddToStarred = async (template) => {
    try {
      const res = await axios.post(`${url}/addToStarredCollection`, { email, templateData: template });
      if (res.status === 201) {
        setStarredTemplates((prev) => new Set(prev).add(template._id));
        toast.success("Starred...⭐");
      };
    } catch (error) {
      console.error("Error starring template:", error);
      toast.error("Failed to star template");
    };
  };

  const handleRemoveStar = async (template) => {
    try {
      const res = await axios.post(`${url}/removeToStarredCollection`, { email, templateData: template });
      if (res.status === 201) {
        setStarredTemplates((prev) => {
          const newSet = new Set(prev);
          newSet.delete(template._id);
          return newSet;
        });
        toast.success("Unstarred");
      };
    } catch (error) {
      console.error("Error unstarring template:", error);
      toast.error("Failed to unstar template");
    };
  };


  const handleRouteNavigation = async () => {
    navigate(`/editTemplatePage/${previewTemplate._id}`, { replace: true })
  };


  return (
    <div className='p-5'>
      <h1 className='pb-3 text-4xl font-semibold text-gray-500'>Resume templates</h1>
      <p className='font-medium text-gray-500'>Browse high quality Resume templates for your next design</p>

      <div className="flex items-center space-x-4 my-4">
        <div className="relative">
          <button
            className="border font-nunito text-gray-600 font-semibold py-2 px-4 w-60 rounded-lg inline-flex items-center justify-between"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="mr-1">Category</span>
            <FaAngleDown className='text-cyan-600' />
          </button>
          {dropdownOpen && (
            <ul className="absolute h-60 overflow-y-auto bg-white border border-gray-200 mt-2 py-2 w-60 rounded-lg shadow-lg z-10">
              <li>
                <button
                  className={`py-2 px-4 block text-left text-cyan-600 w-full ${selectedCategory === "All categories" ? 'bg-cyan-200' : ''}`}
                  onClick={() => handleCategoryChange("All categories")}
                >
                  All categories
                </button>
              </li>
              {initialTags.map((tag) => (
                <li key={tag}>
                  <button
                    className={`py-2 px-4 block text-left text-cyan-600 w-full ${selectedCategory === tag ? 'bg-cyan-200' : ''}`}
                    onClick={() => handleCategoryChange(tag)}
                  >
                    {tag}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedCategory !== "All categories" && (
          <button
            className="text-cyan-600 font-bold rounded"
            onClick={() => setSelectedCategory("All categories")}
          >
            <FaBan className='text-xl' />
          </button>
        )}
      </div>

      <div className="w-full flex flex-nowrap overflow-x-auto lg:grid lg:grid-cols-5 gap-4">
        {filteredTemplates.map(template => (
          <div
            key={template._id}
            className="bg-gray-100 shadow-md rounded-lg m-4 w-64 h-96 flex-shrink-0 flex items-center justify-center relative group"
            onClick={() => openModal(template)}
          >
            <img src={`${url}/${template.imageUrl}`} alt={template.title} className="w-full rounded-lg h-full object-cover" />
            <div className='absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-gray-100 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
              {starredTemplates.has(template._id) ? (
                <FaStar className='text-xl text-cyan-700' onClick={(e) => { e.stopPropagation(); handleRemoveStar(template); }} />
              ) : (
                <CiStar className='text-2xl text-cyan-700' onClick={(e) => { e.stopPropagation(); handleAddToStarred(template); }} />
              )}
            </div>
          </div>
        ))}
      </div>


      {previewTemplate && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Template Preview"
          className="fixed inset-0 flex flex-col items-center justify-center z-50 overflow-auto"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
          <div className="bg-white rounded-lg p-6 max-w-full w-full md:max-w-5xl md:w-auto h-full md:h-3/4 mx-4 overflow-auto">
            <div className="flex justify-end items-center pb-4">
              <MdClear onClick={closeModal} className="text-2xl text-gray-500 hover:text-gray-700" />
            </div>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center pb-4'>
              <div className='mb-10 flex flex-col w-full md:w-1/2 gap-4'>
                <h2 className="text-2xl font-bold font-nunito">{previewTemplate.title}</h2>
                <div className='flex items-center gap-3'>
                  <button onClick={handleRouteNavigation} className='px-10 py-2 border bg-cyan-600 font-semibold text-white rounded-xl'>Customize this Template</button>
                  {starredTemplates.has(previewTemplate._id) ? (
                    <FaStar className='text-xl text-cyan-700' onClick={(e) => { e.stopPropagation(); handleRemoveStar(previewTemplate); }} />
                  ) : (
                    <CiStar className='text-2xl text-cyan-700' onClick={(e) => { e.stopPropagation(); handleAddToStarred(previewTemplate); }} />
                  )}
                </div>
                <div className='flex items-center gap-2'>
                  <FaPen className='text-cyan-600' />
                  <h2 className="text-sm font-medium text-gray-600">100% fully Customizable</h2>
                </div>
                <div className='flex items-center gap-2'>
                  <FaMobile className='text-cyan-600' />
                  <h2 className="text-sm font-medium text-gray-600">Edit and download on the way</h2>
                </div>
                <div className='flex items-center gap-2'>
                  <FaUpload className='text-cyan-600' />
                  <h2 className="text-sm font-medium text-gray-600">Share and publish anywhere</h2>
                </div>
                <div className='flex w-full gap-3'>
                  <h1 className="text-sm font-bold text-gray-500">Tags:</h1>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.tags.map((tag) => (
                      <p className='text-xs text-gray-500 border border-cyan-600 cursor-pointer px-4 py-1 rounded-md' key={tag}>{tag}</p>
                    ))}
                  </div>
                </div>
              </div>
              <div className='flex lg:flex-col items-center'>
                <img src={`${url}/${previewTemplate.imageUrl}`} alt={previewTemplate.title} className="w-64 h-96 md:w-[260px] md:h-[360px] border rounded-lg" />
                <FaAngleRight className='text-cyan-600 text-3xl rounded-lg mt-4 md:mt-0' onClick={handleNextTemplate} />
              </div>
            </div>

            <div className='w-full'>
              <h2 className="text-2xl font-bold font-nunito mb-4">Similar like this</h2>
              <div className="flex overflow-x-auto space-x-4">
                {similarTemplates.map(template => (
                  <div key={template._id} className="bg-gray-100 shadow-md rounded-lg w-60 h-80 flex-shrink-0 flex items-center justify-center relative">
                    <img src={`${url}/${template.imageUrl}`} alt={template.title} className="w-full rounded-lg h-full object-cover" />
                    <div className='absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-gray-100 cursor-pointer' onClick={(e) => { e.stopPropagation(); handleAddToStarred(template); }}>
                      <CiStar className='text-2xl text-cyan-700' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
