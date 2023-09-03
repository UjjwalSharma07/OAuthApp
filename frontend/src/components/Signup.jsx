import { useState } from "react";
import { signupFields } from "../constants/FormFields";
import FormAction from "./FormAction";
import Input from "./Input";
import VerifyOTP from "./VerifyOTP";
import axios from 'axios';
import { toast } from 'react-toastify';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const fields = signupFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));
console.log(fieldsState)
const Signup = () => {
  const [signupState, setSignupState] = useState(fieldsState);
  const [errors, setErrors] = useState({});
  const[showPassword, setShowPassword] = useState(false);
  const[showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [openModal, setOpenModal] = useState(false); 
  
  const handleChange = (e) => {
    setSignupState({ ...signupState, [e.target.id]: e.target.value });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(signupState);
      console.log("error:", validationErrors)
    if (Object.keys(validationErrors).length === 0) {
      try {
        console.log(signupState)
        const response = await axios.post(
        
          "https://oauthapp-8l6w.onrender.com/api/v1/auth/register",
          // "http://localhost:8800/api/v1/auth/register",
          signupState
        );
        console.log(response);
        if ( response.data.success ) {
          setOpenModal(true);
          toast.success(`${response.data.message}`)
        } else {
          console.log("Registration failed:" , response.data.message);
          toast.error(`${response.data.message}`)
        }
      } catch (error) {
        if(error.response.data.status === 403){
          setOpenModal(true);
        }
        console.log("Error registering:", error);
        toast.error(`${error.response.data.message}`)
      }
    } else {
      setErrors(validationErrors);
    }
  };


  const validateForm = (formData) => {
    console.log(formData)
    const errors = {};

    fields.forEach((field) => {
      if (field.isRequired && !formData[field.id]) {
        errors[field.id] = `${field.labelText} is required.`;
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
      
      if (field.id === "password" && formData[field.id]) {
        // Validate password length
        if (formData[field.id].length < 6) {
          errors[field.id] = "Password must be at least 6 characters.";
        }
      }

      if (field.id === "phone" && formData[field.id] && !/^[0-9]{10}$/.test(formData.phone)) {
        errors[field.id] = "Invalid phone number.";
      }

    });
  
    if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Password do not match.";
    }

    return errors;
  };
  
  const handleLoginWithGoogle = ()=>{
    //   
    window.location.href = "https://oauthapp-8l6w.onrender.com/login/federated/google"
    // window.location.href = "http://localhost:8800/login/federated/google"
  }
  const handleLoginWithGithub = ()=>{
    window.location.href = "https://oauthapp-8l6w.onrender.com/auth/github"
    // window.location.href = "http://localhost:8800/auth/github"
  }
  return (
    <>
    
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div >
        {fields.map((field) => (
          <div key={field.id} className="mb-4 relative">
            
              <Input
                handleChange={handleChange}
                value={signupState[field.id]}
                labelText={field.labelText}
                labelFor={field.labelFor}
                id={field.id}
                name={field.name}
                type={ field.id === 'password' ? (showPassword  ? 'text' : field.type) : (showConfirmPassword  ? 'text' : field.type)}
                isRequired={field.isRequired}
                placeholder={field.placeholder}
              />
              { (field.id === 'password' ) && <span 
             className=  {errors['password'] ? 'absolute right-3 bottom-[52px] cursor-pointer':  'absolute right-3 bottom-[10px] cursor-pointer ' }
             onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? 

                (<AiOutlineEye fontSize={24} fill='#AFB2BF'/>) : 

                (<AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF'/>)}
            </span>}

            { (field.id === 'confirmPassword' ) && <span 
             className=  {errors['confirmPassword'] ? 'absolute right-3 bottom-[52px] cursor-pointer':  'absolute right-3 bottom-[10px] cursor-pointer ' }
             onClick={() => setShowConfirmPassword((prev) => !prev)}>
                {showConfirmPassword ? 

                (<AiOutlineEye fontSize={24} fill='#AFB2BF'/>) : 

                (<AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF'/>)}
            </span>}
            {errors[field.id] && (
              <p className="text-red-500 mt-2">{errors[field.id]}</p>
            )}
          </div>
        ))}

        <FormAction hide={true} handleLoginWithGithub={handleLoginWithGithub} handleLoginWithGoogle={handleLoginWithGoogle} handleSubmit={handleSubmit} text="Signup" />
      </div>
    </form>
    {openModal && <VerifyOTP setOpenModal={setOpenModal} />}
    </>
  );
};

export default Signup;



