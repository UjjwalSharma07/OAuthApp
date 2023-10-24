import React, { useState } from "react";
import axios from "axios";
import Input from "./Input";
import FormAction from "./FormAction";
import VerifyOTP from "./VerifyOTP";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";



const SignUpForm = () => {

  const [signUpState, setSignUpState] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const signupFields = [
    {
      labelText: "Username",
      labelFor: "username",
      id: "username",
      name: "username",
      type: "text",
      autoComplete: "username",
      required: true,
      placeholder: "Username",
      errorMessage:
        "Username should be 3-16 characters and shouldn't include any special character!",
      pattern: "^[A-Za-z0-9]{3,16}$",
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
      pattern:'^[7-9][0-9]{9}$',
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
    {
      labelText: "Confirm Password",
      labelFor: "confirmPassword",
      id: "confirmPassword",
      name: "confirmPassword",
      type: "password",
      autoComplete: "confirmPassword",
      required: true,
      placeholder: "Confirm Password",
      errorMessage: "Passwords don't match!",
      pattern: `${signUpState.password}`,
    },
  ];

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleChange = (e) => {
    setSignUpState({ ...signUpState, [e.target.id]: e.target.value });
    console.log(signUpState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isUsernameValid =
      signupFields[0].pattern === "" ||
      new RegExp(signupFields[0].pattern).test(signUpState.username);
    const isEmailValid =
      signupFields[1].pattern === "" ||
      new RegExp(signupFields[1].pattern).test(signUpState.email);
    const isPhoneValid =
      signupFields[2].pattern === "" ||
      new RegExp(signupFields[2].pattern).test(signUpState.phone);
    const isPasswordValid =
      signupFields[3].pattern === "" ||
      new RegExp(signupFields[3].pattern).test(signUpState.password);
    const isConfirmPasswordValid =
      signupFields[4].pattern === "" ||
      new RegExp(signupFields[4].pattern).test(signUpState.confirmPassword);

    if (
      !isUsernameValid ||
      !isEmailValid ||
      !isPhoneValid ||
      !isPasswordValid ||
      !isConfirmPasswordValid
    ) {
      console.log("Invalid input. Please check the fields.");
      return;
    }
    registerUser();
  };

  const registerUser = async () => {
    try {
      console.log(signUpState);
      const response = await axios.post(
        // "https://oauthapp-8l6w.onrender.com/api/v1/auth/register",
        "http://localhost:8800/api/v1/auth/register",
        signUpState
      );
      console.log(response);
      if (response.data.success) {
        setOpenModal(true);
        toast.success(`${response.data.message}`);
      } else {
        console.log("Registration failed:", response.data.message);
        toast.error(`${response.data.message}`);
      }
    } catch (error) {
      if (error.response.data.status === 403) {
        setOpenModal(true);
      }
      console.log("Error occurs in user registration:", error);
      toast.error(`${error.response.data.message}`);
    }
  };

  const handleLoginWithGoogle = () => {
    window.location.href = "https://oauthapp-8l6w.onrender.com/login/federated/google";
    // window.location.href = "http://localhost:8800/login/federated/google"
  };
  const handleLoginWithGithub = () => {
    window.location.href = "https://oauthapp-8l6w.onrender.com/auth/github";
    // window.location.href = "http://localhost:8800/auth/github"
  };
  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="-space-y-px ">
          {signupFields.map((input) => (
            <div key={input.id} className="mb-4 relative">
              <Input
                {...input}
                handleChange={handleChange}
                value={signUpState[input.id]}
                type={ input.id === 'password' ? (showPassword  ? 'text' : input.type) : (showConfirmPassword  ? 'text' : input.type)}
              />
              {input.id === "password" && (
                <span
                  className="absolute right-3 top-[8px] cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                  ) : (
                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                  )}
                </span>
              )}
              {input.id === "confirmPassword" && (
                <span
                  className="absolute right-3 top-[8px] cursor-pointer "
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                  ) : (
                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                  )}
                </span>
              )}
            </div>
          ))}
        </div>
        <FormAction
          hide={true}
          handleLoginWithGithub={handleLoginWithGithub}
          handleLoginWithGoogle={handleLoginWithGoogle}
          handleSubmit={handleSubmit}
          text="Signup"
        />
      </form>
      {openModal && <VerifyOTP setOpenModal={setOpenModal} />}
    </>
  );
};

export default SignUpForm;
