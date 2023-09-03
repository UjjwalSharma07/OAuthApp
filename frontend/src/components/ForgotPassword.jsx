import { useState } from "react";
import { forgotPasswordFields } from "../constants/FormFields"; 
import Input from "../components/Input";
import FormAction from "../components/FormAction";
import axios from "axios";
import { toast } from "react-toastify";
import {BsBackspaceReverseFill} from "react-icons/bs";

const fields = forgotPasswordFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

const ForgotPassword = ({setOpenModal}) => {
  const [forgotPasswordState, setForgotPasswordState] = useState(fieldsState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForgotPasswordState({ ...forgotPasswordState, [e.target.id]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const validationErrors = validateForm(forgotPasswordState);
    if (Object.keys(validationErrors).length === 0) {
      
      try {
        
        const response = await axios.post("https://oauthapp-8l6w.onrender.com/api/v1/auth/forgotPassowrd", 
        // const response = await axios.post("http://localhost:8800/api/v1/auth/forgotPassowrd", 
          forgotPasswordState, 
        );
        if (response.data.success) {
          toast.success(`${response.data.message}`)
          setOpenModal(false);
        }else {
          toast.error(`${response.data.message}`)
          setErrors({
            ...errors,
            password: "Wrong Password.",
          });
        }
      } catch (error) {
        toast.error(`${error.response.data.message}`)
        console.log("Error forgotPassword:", error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = (formData) => {
    const errors = {};
  
    fields.forEach((field) => {
      if (field.isRequired && !formData[field.id]) {
        errors[field.id] = `${field.labelText} is required.`;
      }else{
        errors[field.id]="";
      }
  
      if (field.id === "email" && formData[field.id]) {
        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        console.log("Email:", formData[field.id]);
        console.log("Pattern Test Result:", emailPattern.test(formData[field.id]));

        if (!emailPattern.test(formData[field.id])) {
          errors[field.id] = "Invalid email format.";
        }
      }
  
      if (field.id === "newpassword" && formData[field.id]) {
        // Validate password length
        if (formData[field.id].length < 6) {
          errors[field.id] = "New Password must be at least 6 characters.";
        }
      }
    });
  
    return errors;
  };
  const handleCloseModal = () =>{
    setOpenModal(false);
  }
  return (
   <div className="w-screen h-screen bg-black bg-opacity-80  fixed top-0 left-0 flex justify-center items-center">
      <form
        className="bg-white-500 p-20 w-100 h-120 relative overflow-auto space-y-6"
        onSubmit={handleSubmit}
      >
      <BsBackspaceReverseFill onClick={handleCloseModal}  className="absolute right-20 top-14  rounded-md text-white bg-purple-600 hover:bg-purple-700 cursor-pointer"/>
      <div className="-space-y-px">
        {fields.map((field) => (
          <div key={field.id} className="mb-4">
            <Input
              handleChange={handleChange}
              value={forgotPasswordState[field.id]}
              labelText={field.labelText}
              labelFor={field.labelFor}
              id={field.id}
              name={field.name}
              type={field.type}
              isRequired={field.isRequired}
              placeholder={field.placeholder}
            />
            {errors[field.id] && (
              <p className="text-red-500 mt-2">{errors[field.id]}</p>
            )}
          </div>
        ))}
      </div>
      <FormAction hide={false}  handleSubmit={handleSubmit} text="Submit" />
    </form>
  </div>
  );
};

export default ForgotPassword;
