import React, { useState } from "react";
import Input from "./Input";
import FormAction from "./FormAction";
import { toast } from "react-toastify";
import { BsBackspaceReverseFill } from "react-icons/bs";
import axios from "axios";

const UserDetailFields = [
  {
    labelText: "Profile Image",
    labelFor: "profile",
    id: "profile",
    name: "profile",
    type: "file",
    autoComplete: "profile",
    required: true,
    accept:"image/*",
    // accept: ".jpeg, .jpg, .png",
  },
  {
    labelText: "Username",
    labelFor: "username",
    id: "username",
    name: "username",
    type: "text",
    autoComplete: "username",
    required: true,
    placeholder: "Full name",
    errorMessage:
      "Username should be 3-16 characters and shouldn't include any special character!",
    pattern: "^(?! )[A-Za-z0-9 ]*(?<! )$",
  },
  {
    labelText: "Email address",
    labelFor: "email",
    id: "email",
    name: "email",
    type: "email",
    autoComplete: "email",
    required: true,
    placeholder: "Email address",
    errorMessage: "It should be a valid email address!",
    pattern: `^(?=.{1,256}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}(?:.[a-zA-Z]{2,})?$`,
  },
  {
    labelText: "Phone",
    labelFor: "phone",
    id: "phone",
    name: "phone",
    type: "tel",
    required: true,
    placeholder: "Phone no.",
    errorMessage: "It should be a valid 10 digits phone number!",
    pattern: "^[7-9][0-9]{9}$",
  },
  {
    labelText: "Resume ",
    labelFor: "resume",
    id: "resume",
    name: "resume",
    type: "file",
    autoComplete: "resume",
    required: true,
    accept: ".pdf, .doc, .docx",
  },
  {
    labelText: "Portfolio link",
    labelFor: "portfolio",
    id: "portfolio",
    name: "portfolio",
    type: "url",
    autoComplete: "portfolio",
    placeholder: "portfolio link",
    errorMessage:
      "Please enter a valid URL for your portfolio (e.g., https://example.com).",
    pattern: `^(https?|ftp):[^/$.?#].[^]*$`,
  },
  {
    labelText: "LinkedIn link",
    labelFor: "linkedIn",
    id: "linkedIn",
    name: "linkedIn",
    type: "url",
    autoComplete: "linkedIn",
    placeholder: "LinkedIn link",
    errorMessage:
      "Please enter a valid LinkedIn URL (e.g., https://www.linkedin.com/in/username).",
    pattern: `^https:www.linkedin.comin[A-Za-z0-9_-]+?$`,
  },
  {
    labelText: "Github link",
    labelFor: "github",
    id: "github",
    name: "github",
    type: "url",
    autoComplete: "github",
    placeholder: "Github link",
    errorMessage:
      "Please enter a valid GitHub URL (e.g., https://github.com/username).",
    pattern: `^https:github.com[A-Za-z0-9_-]+?$`,
  },
];

const UserDetails = ({setOpenModal,data}) => {
  const [details, setDetails] = useState({
    profile: null,
    username: "",
    email: "",
    phone: "",
    resume: null,
    portfolio: "",
    linkedIn: "",
    github: "",
  });
  const [selectedFileProfile, setSelectedFileProfile] = useState(null);
  const [selectedFileResume, setSelectedFileResume] = useState(null);
  

  const handleChange = (e) => {
    if (e.target.type === "file") {
      
      const file = e.target.files[0]; // Get the selected file

      console.log("usefiles", file)

      if (e.target.id === "profile") {
        setDetails((prevDetails) => ({
          ...prevDetails,
          [e.target.id]: file, // Set the file object directly
        }));
        setSelectedFileProfile(file);
      } else if (e.target.id === "resume") {
        setDetails((prevDetails) => ({
          ...prevDetails,
          [e.target.id]: file, // Set the file object directly
        }));
        setSelectedFileResume(file);
      }
    } else {
      // Handle remaining inputs
      setDetails((prevDetails) => ({
        ...prevDetails,
        [e.target.id]: e.target.value,
      }));
    }
  };
  console.log(details);

  const handleSubmit = async(e)=>{

    e.preventDefault();

      const isUsernameValid =
        UserDetailFields[1].pattern === "" ||
        new RegExp(UserDetailFields[1].pattern).test(details.username);
      const isEmailValid =
        UserDetailFields[2].pattern === "" ||
          new RegExp(UserDetailFields[2].pattern).test(details.email);
      const isPhoneValid =
        UserDetailFields[3].pattern === "" ||
          new RegExp(UserDetailFields[3].pattern).test(details.phone);
      const profileImg = details.profile;
      const resume = details.resume; 

      if (
        !isUsernameValid ||
        !isEmailValid ||
        !isPhoneValid || !profileImg || !resume
      ) {
        toast.error("Invalid input data. Please fill the correct details.");
        return;
      }
      
      try {
        console.log("details ",details);

        const formData = new FormData();
        console.log("formdata----")
        // Append text data to the formData
        formData.append("username", details.username);
        formData.append("email", details.email);
        formData.append("phone", details.phone);
        formData.append("portfolio", details.portfolio);
        formData.append("linkedIn", details.linkedIn);
        formData.append("github", details.github);

        // Append files to the formData
        formData.append("profile", details.profile);
        formData.append("resume", details.resume);

        // console.log("Before loop");
        // for (const [key, value] of formData.entries()) {
        //   console.log("Inside loop")
        //   console.log(key, value);
        // }
        // console.log("After loop");

        // const response = await axios.post("http://localhost:8800/api/v1/user/detailsUpload",formData,{
          const response = await axios.post("https://oauthapp-8l6w.onrender.com/api/v1/user/detailsUpload",formData,{
          headers: {
            "Content-Type": "multipart/form-data",
          }
        });  
        console.log("details response",response);
        if (response.data.success) {
          setOpenModal(false);
          window.location.reload();
          toast.success(`${response.data.message}`);
        } else {
          console.log("userDetails error:", response.data.message);
          toast.error(`${response.data.message}`);
        }
      } catch (error) {
        console.log("Error occur in upload userDetails:", error);
        toast.error(`${error.response.data.message}`);
      }
      
  }
  const handleEditSubmit = async(e)=>{
    e.preventDefault();

      const isUsernameValid =
        UserDetailFields[1].pattern === "" ||
        new RegExp(UserDetailFields[1].pattern).test(details.username);
      const isEmailValid =
        UserDetailFields[2].pattern === "" ||
          new RegExp(UserDetailFields[2].pattern).test(details.email);
      const isPhoneValid =
        UserDetailFields[3].pattern === "" ||
          new RegExp(UserDetailFields[3].pattern).test(details.phone);
      const profileImg = details.profile;
      const resume = details.resume; 

      if (
        !isUsernameValid ||
        !isEmailValid ||
        !isPhoneValid || !profileImg || !resume
      ) {
        toast.error("Invalid input data. Please fill the correct details.");
        return;
      }
      
      try {

        console.log("details ",details);

        const formData = new FormData();
        console.log("formdata----")
        // Append text data to the formData
        formData.append("username", details.username);
        formData.append("email", details.email);
        formData.append("phone", details.phone);
        formData.append("portfolio", details.portfolio);
        formData.append("linkedIn", details.linkedIn);
        formData.append("github", details.github);

        // Append files to the formData
        formData.append("profile", details.profile);
        formData.append("resume", details.resume);

        // console.log("Before loop");
        // for (const [key, value] of formData.entries()) {
        //   console.log("Inside loop")
        //   console.log(key, value);
        // }
        // console.log("After loop");

        // const response = await axios.put("http://localhost:8800/api/v1/user/editdetailsUpload",formData,{
          const response = await axios.put("https://oauthapp-8l6w.onrender.com/api/v1/user/editdetailsUpload",formData,{
          headers: {
            "Content-Type": "multipart/form-data",
          }
        });  
        console.log("details response",response);
        if (response.data.success) {
          setOpenModal(false);
          window.location.reload();
          toast.success(`${response.data.message}`);
        } else {
          console.log("userDetails error:", response.data.message);
          toast.error(`${response.data.message}`);
        }
      } catch (error) {
        console.log("Error occur in upload userDetails:", error);
        toast.error(`${error.response.data.message}`);
      }
  }
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  return (
    <div className="w-screen h-screen bg-black bg-opacity-80 fixed top-0 left-0 flex  justify-center items-center">
      <form className="w-[450px] bg-white-500 h-screen py-10 relative overflow-auto space-y-6 hideScroll" onSubmit={data?handleEditSubmit:handleSubmit} encType="multipart/form-data" >
        <BsBackspaceReverseFill
          onClick={handleCloseModal}
          className="absolute right-10 top-20  rounded-md text-white  hover:bg-purple-700 cursor-pointer"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
            User details form
          </span>
        </h2>
        {UserDetailFields.map((input) => (
          <div key={input.id} className="mb-4 relative">
            <Input
              {...input}
              handleChange={handleChange}
              value={details[input.id]}
              type={input.type}
              selectedFileProfile={selectedFileProfile}
              selectedFileResume={selectedFileResume}
            />
          </div>
        ))}
        <FormAction text={"SUBMIT"} />
      </form>
    </div>
  );
};

export default UserDetails;
