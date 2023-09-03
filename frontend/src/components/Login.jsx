import { useState } from "react";
import { loginFields } from "../constants/FormFields";
import Input from "./Input";
import { useNavigate } from "react-router-dom";
import FormExtra from "./FormExtra";
import FormAction from "./FormAction";
import axios from "axios";
import ForgotPassword from "./ForgotPassword";
import { toast } from "react-toastify";

const fields = loginFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

const Login = () => {
  const [loginState, setLoginState] = useState(fieldsState);
  const [errors, setErrors] = useState({}); 
  const [openModal, setOpenModal] = useState(false); 
 
  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(loginState);
    if (Object.keys(validationErrors).length === 0) {
      authenticateUser();
    } else {
      setErrors(validationErrors);
    }
  };
  
  const validateForm = (formData) => {
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
    });
    
    return errors;
  };
  const navigate = useNavigate();
  const authenticateUser = async() => {
    try {
      console.log(loginState);
      
      const res = await axios.post("https://oauthapp-8l6w.onrender.com/api/v1/auth/login", loginState);
      // const res = await axios.post("http://localhost:8800/api/v1/auth/login", loginState);
      if (res.data.success) {
        toast.success(`${res.data.message}`)
        navigate("/dummy")
      } else {
        console.log("Login failed:" , res.data.message);
        toast.error(`${res.data.message}`)
      }
      
    } catch (error) {
      toast.error(`${error.response.data.message}`)
      console.log("Error occurs in login: ",error);
    }
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
      <div className="-space-y-px">
        {fields.map((field) => (
          <div key={field.id} className="mb-4">
            <Input
              handleChange={handleChange}
              value={loginState[field.id]}
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
      <FormExtra setOpenModal={setOpenModal} />
      <FormAction hide={true} handleLoginWithGithub={handleLoginWithGithub} handleLoginWithGoogle={handleLoginWithGoogle}  handleSubmit={handleSubmit} text="Login" />
    </form>
     {openModal && <ForgotPassword setOpenModal={setOpenModal} />}
     </>
  );
};

export default Login;
