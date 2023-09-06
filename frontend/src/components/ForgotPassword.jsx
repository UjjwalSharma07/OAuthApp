import { useState } from "react";
import Input from "../components/Input";
import FormAction from "../components/FormAction";
import axios from "axios";
import { toast } from "react-toastify";
import { BsBackspaceReverseFill } from "react-icons/bs";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ForgotPassword = ({ setOpenModal }) => {
  const [forgotPasswordState, setForgotPasswordState] = useState({
    email: "",
    newpassword: "",
    confirmPassword: "",
  });
  const forgotPasswordFields = [
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
      labelText: "New Password",
      labelFor: "newpassword",
      id: "newpassword",
      name: "newpassword",
      type: "password",
      autoComplete: "current-password",
      required: true,
      placeholder: " New Password",
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
      autoComplete: "current-password",
      required: true,
      placeholder: "Confirm Password",
      errorMessage: "Passwords don't match!",
      pattern: `${forgotPasswordState.newpassword}`,
    },
  ];
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForgotPasswordState({
      ...forgotPasswordState,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEmailValid =
      forgotPasswordFields[0].pattern === "" ||
      new RegExp(forgotPasswordFields[0].pattern).test(
        forgotPasswordState.email
      );
    const isPasswordValid =
      forgotPasswordFields[1].pattern === "" ||
      new RegExp(forgotPasswordFields[1].pattern).test(
        forgotPasswordState.password
      );
    const isConfirmPasswordValid =
      forgotPasswordFields[2].pattern === "" ||
      new RegExp(forgotPasswordFields[2].pattern).test(
        forgotPasswordState.confirmPassword
      );

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      console.log("Invalid input. Please check the fields.");
      return;
    }

    try {
      // const response = await axios.post("https://oauthapp-8l6w.onrender.com/api/v1/auth/forgotPassowrd",
      const response = await axios.post(
        "http://localhost:8800/api/v1/auth/forgotPassowrd",
        forgotPasswordState
      );
      if (response.data.success) {
        toast.success(`${response.data.message}`);
        setOpenModal(false);
      } else {
        toast.error(`${response.data.message}`);
      }
    } catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log("Error forgotPassword:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  return (
    <div className="w-screen h-screen bg-black bg-opacity-80  fixed top-0 left-0 flex justify-center items-center">
      <form
        className="bg-white-500 p-20 w-100 h-120 relative overflow-auto space-y-6"
        onSubmit={handleSubmit}
      >
        <BsBackspaceReverseFill
          onClick={handleCloseModal}
          className="absolute right-20 top-14  rounded-md text-white bg-purple-600 hover:bg-purple-700 cursor-pointer"
        />
        <div className="-space-y-px ">
          {forgotPasswordFields.map((input) => (
            <div key={input.id} className="mb-4 relative">
              <Input
                {...input}
                handleChange={handleChange}
                value={forgotPasswordState[input.id]}
                type={
                  input.id === "newpassword"
                    ? showPassword
                      ? "text"
                      : input.type
                    : showConfirmPassword
                    ? "text"
                    : input.type
                }
              />

              {input.id === "newpassword" && (
                <span
                  className="absolute right-3 top-[8px] cursor-pointer "
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
        <FormAction hide={false} handleSubmit={handleSubmit} text="Submit" />
      </form>
    </div>
  );
};

export default ForgotPassword;
