import { useState } from "react";
import { signupFields } from "../constants/FormFields";
import FormAction from "./FormAction";
import Input from "./Input";
import VerifyOTP from "./VerifyOTP";
import axios from 'axios';
import { toast } from 'react-toastify';


const fields = signupFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));
console.log(fieldsState)
const Signup = () => {
  const [signupState, setSignupState] = useState(fieldsState);
  const [errors, setErrors] = useState({});
 

  const [openModal, setOpenModal] = useState(false); 
  
  const handleChange = (e) => {
    setSignupState({ ...signupState, [e.target.id]: e.target.value });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(signupState);

    if (Object.keys(validationErrors).length === 0) {
      try {
        console.log(signupState)
        const response = await axios.post(
          //    http://localhost:8800
          "https://oauthapp-8l6w.onrender.com/api/v1/auth/register",
          signupState
        );
        console.log(response);
        if (response.data.success) {
          toast.success(`${response.data.message}`)
          setOpenModal(true);
        } else {
          console.log("Registration failed:" , response.data.message);
          toast.error(`${response.data.message}`)
        }
      } catch (error) {
        console.log("Error registering:", error);
        toast.error(`${error.response.data.message}`)
      }
    } else {
      setErrors(validationErrors);
    }
  };


  const validateForm = (formData) => {
    console.log(formData)
    const validationErrors = {};

    // Validate mobile number 
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      validationErrors.phone = "Invalid Phone number.";
    }
    if (!formData.phone) {
      validationErrors.phone = "Phone no. is required.";
    }
    if (!formData.email) {
      validationErrors.email = "Email  is required.";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ) {
      // Validate email format
      
      console.log("Email:", formData.email);
      console.log("Pattern Test Result:",/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email));
      validationErrors.email = "Invalid email format.";
      console.log(validationErrors.email);
    }
   
    if (!formData.username) {
      validationErrors.username = "User name is required.";
    }
    if (!formData.password) {
      validationErrors.password = "password is required.";
    }

    if (formData.password && formData.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters.";
    }

    if (formData.confirmPassword !== formData.password) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    return validationErrors;
  };
  
  const handleLoginWithGoogle = ()=>{
    //   http://localhost:8800
    window.location.href = "https://oauthapp-8l6w.onrender.com/login/federated/google"
  }
  const handleLoginWithGithub = ()=>{
    window.location.href = "https://oauthapp-8l6w.onrender.com/auth/github"
  }
  return (
    <>
    
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div >
        {fields.map((field) => (
          <div key={field.id} className="mb-4">
            
              <Input
                handleChange={handleChange}
                value={signupState[field.id]}
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

        <FormAction hide={true} handleLoginWithGithub={handleLoginWithGithub} handleLoginWithGoogle={handleLoginWithGoogle} handleSubmit={handleSubmit} text="Signup" />
      </div>
    </form>
    {openModal && <VerifyOTP setOpenModal={setOpenModal} />}
    </>
  );
};

export default Signup;



