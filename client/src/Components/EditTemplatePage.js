import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import PuffLoader from "react-spinners/PuffLoader";
import GreyCleanCVResume from './Templates/Grey Clean CV Resume';
import MinimalistWhiteandGreyProfessionalResume from './Templates/Minimalist White and Grey Professional Resume';
import { FaArrowLeft } from 'react-icons/fa';
import WhiteandBeigeSimpleStudentCVResume from './Templates/White and Beige Simple Student CV Resume';

export default function EditTemplatePage() {
  const { templateId } = useParams();
  const [templateData, setTemplateData] = useState([]);
  const navigate = useNavigate();
  const url = "https://resume-builder-server-ea28.onrender.com";


  const getTemplate = async () => {
    try {
      const res = await axios.post(`${url}/getTemplateById/${templateId}`);
      if (res.status === 200) {
        setTemplateData(res.data);
      }
    } catch (e) {
      console.log(e);
      toast.error("Oops! Failed to fetch template data");
    }
  };

  useEffect(() => {
    getTemplate();
  }, []);


  const renderTemplate = () => {
    if (!templateData) return (
      <div className='flex flex-col w-full min-h-screen items-center justify-center'>
        <div className='flex flex-col w-full items-center justify-center gap-5'>
          <PuffLoader color='#498FCD' size={40} />
          <p className='text-3xl capitalize font-bold text-cyan-600'>Please wait while Fetching Template</p>
          <FaArrowLeft className='text-3xl w-16 h-8 p-2 text-gray-900 font-bold rounded-md bg-cyan-500 hover:bg-cyan-600 hover:border' onClick={() => navigate(-1)} />
        </div>
      </div>
    )

    switch (templateData.title) {
      case 'Grey Clean CV Resume':
        return <GreyCleanCVResume data={templateData} />;
      case 'Minimalist White and Grey Professional Resume':
        return <MinimalistWhiteandGreyProfessionalResume data={templateData} />;
      case 'White and Beige Simple Student CV Resume':
        return <WhiteandBeigeSimpleStudentCVResume data={templateData} />;
      default:
        return (
          <div className='flex flex-col w-full min-h-screen items-center justify-center'>
            <div className='flex flex-col w-full items-center justify-center gap-5'>
              <PuffLoader color='#498FCD' size={40} />
              <p className='text-3xl capitalize font-bold text-cyan-600'>Error on Fetching Template</p>
              <FaArrowLeft className='text-3xl w-16 h-8 p-2 text-gray-900 font-bold rounded-md bg-cyan-500 hover:bg-cyan-600 hover:border' onClick={() => navigate(-1)} />
            </div>
          </div>
        )
    }
  };



  return (
    <div>
      <div>
        {renderTemplate()}
      </div>
    </div>
  )
}
