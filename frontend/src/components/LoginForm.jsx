import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "./Input";
import FormExtra from "./FormExtra";
import FormAction from "./FormAction";
import ForgotPassword from "./ForgotPassword";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const loginFields = [
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
    labelText: "Password",
    labelFor: "password",
    id: "password",
    name: "password",
    type: "password",
    autoComplete: "current-password",
    required: true,
    placeholder: "Password",
    errorMessage:
      "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
    pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
  },
];

const LoginForm = () => {
  const [loginState, setLoginState] = useState({
    email: "",
    password: "",
  });

  const [openModal, setOpenModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
    console.log(loginState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEmailValid = loginFields[0].pattern === "" || new RegExp(loginFields[0].pattern).test(loginState.email);
    const isPasswordValid = loginFields[1].pattern === "" || new RegExp(loginFields[1].pattern).test(loginState.password);
  
    if (!isEmailValid || !isPasswordValid) {
      console.log("Invalid input. Please check the fields.");
      return;
    }
    authenticateUser();
  };
 
  const navigate = useNavigate();
  const authenticateUser = async() => {
    try {
      console.log(loginState);
      
      // const res = await axios.post("https://oauthapp-8l6w.onrender.com/api/v1/auth/login", loginState);
      const res = await axios.post("http://localhost:8800/api/v1/auth/login", loginState);
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

  const handleLoginWithGoogle = () => {
    window.location.href =
      "https://oauthapp-8l6w.onrender.com/login/federated/google";
    // window.location.href = "http://localhost:8800/login/federated/google"
  };
  const handleLoginWithGithub = () => {
    window.location.href = "https://oauthapp-8l6w.onrender.com/auth/github";
    // window.location.href = "http://localhost:8800/auth/github"
  };
  const handleShowPassword = ()=>{
    console.log(showPassword)
    setShowPassword((prev) => !prev)
    
  }
  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="-space-y-px ">
          {loginFields.map((input) => (
            <div key={input.id} className="mb-4 relative">
              <Input
                {...input} 
                handleChange={handleChange}
                value={loginState[input.id]}
                type={
                  input.id === "password" && showPassword ? "text" : input.type
                }
              />
              {input.id === "password" && (
                <span
                  className="absolute right-3 top-[8px] cursor-pointer"
                  onClick={handleShowPassword}
                >
                  {showPassword ? (
                    <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                  ) : (
                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                  )}
                </span>
              )}
            </div>
          ))}
        </div>
        <FormExtra setOpenModal={setOpenModal} />
        <FormAction
          hide={true}
          handleLoginWithGithub={handleLoginWithGithub}
          handleLoginWithGoogle={handleLoginWithGoogle}
          handleSubmit={handleSubmit}
          text="Login"
        />
      </form>
      {openModal && <ForgotPassword setOpenModal={setOpenModal} />}
    </>
  );
};

export default LoginForm;
