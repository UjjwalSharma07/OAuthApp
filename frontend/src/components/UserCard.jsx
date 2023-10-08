import React, { useState } from 'react';
import {GiSmartphone} from "react-icons/gi"
import {AiOutlineLink} from "react-icons/ai"
import {BsLinkedin} from "react-icons/bs"
import {AiFillGithub} from "react-icons/ai"
import {AiFillFilePdf} from "react-icons/ai"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

const UserCard = () => {
  const [data,setData] = useState(null);
  // const navigate = useNavigate();
  const location = useLocation();
  const userDetails = location.state?.userDetails || null;
  // console.log("userDetails: ",userDetails);
  // Check if userDetails is not null before accessing its properties
  const userEmail = userDetails ? userDetails.email : null;
  // console.log("userEmail: ",userEmail);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const res = await axios.get('http://localhost:8800/api/v1/user/details', {
          const res = await axios.get('https://oauthapp-8l6w.onrender.com/api/v1/user/details', {
          params: {
            email: userEmail,
          },
        });
        console.log("fetched data", res);
        if (res.data.success) {
          setData(res.data.data.data); 
        }
      } catch (error) {
        console.log("Error occurred while fetching userDetails:", error);
      }
    };
  
    if (userEmail) {
      fetchData(); 
    }
  }, []); 
  const handleClick = ()=>{
    toast.error(`Data Not Available. Please add link.`)
  }
  return (
    <div className="w-full flex justify-center items-center  mb-[30px]">
    <div  className="w-[800px] h-96 flex justify-center items-center gap-36 bg-white p-8 rounded-lg shadow-md">
        <img
          src={data ? data?.profile : "https://t4.ftcdn.net/jpg/00/65/77/27/240_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg"   }
          alt="profile_img"
          className="w-40 h-40 rounded-full object-cover"
        />
        <div className="flex flex-col items-start gap-3">
          <div className="text-3xl font-bold text-red-500">  {data?.username ? data.username.charAt(0).toUpperCase() + data.username.slice(1) : ''}</div>
          <div className='flex flex-col gap-1'>
            <span className="font-semibold text-black">{data?.email}</span>
            <div className="flex items-center gap-2">
                <GiSmartphone/> <span>{data?.phone}</span> 
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <AiOutlineLink/>
                    {data?.portfolio ? <Link target="_blank" to={data?.portfolio}>Portfolio</Link> : <Link  onClick={handleClick} >Portfolio</Link> }
                </div>
                <div className="flex items-center gap-2">
                    <BsLinkedin/>
                    {data?.linkedIn ? <Link target="_blank" to={data?.linkedIn}>LinkedIn</Link> : <Link onClick={handleClick} >LinkedIn</Link> }
                    
                </div>
                <div className="flex items-center gap-2">
                    <AiFillGithub/>
                    {data?.github ? <Link target="_blank" to={data?.github}>Github</Link> : <Link onClick={handleClick} >Github</Link> }
                </div>
               
            </div>
          </div>
            <div className="flex items-center gap-2">
                <AiFillFilePdf/>
                <Link target="_blank" to={data?.resume}>Resume</Link>
            </div>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
