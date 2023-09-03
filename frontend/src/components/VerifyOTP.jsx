import { useState } from "react";
import FormAction from "../components/FormAction";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {BsBackspaceReverseFill} from "react-icons/bs";

const fixedInputClass =
  "rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm";

const VerifyOTP = ({ setOpenModal }) => {
  const [verifyOTPState, setVerifyOTPState] = useState({
    resendEnabled: false,
  });
  const [errors, setErrors] = useState({});
  const [otpSent, setOTPSent] = useState(false);
  const [otpFieldVisible, setOtpFieldVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    console.log(verifyOTPState);
    setVerifyOTPState({ ...verifyOTPState, [e.target.id]: e.target.value });
  };

  const handleResendOTP = async (e) => {
      e.preventDefault();
      try {
        const res =  await axios.post("https://oauthapp-8l6w.onrender.com/api/v1/auth/sendOTP", {
        // const res = await axios.post(
        //   "http://localhost:8800/api/v1/auth/sendOTP",
        //   {
            email: verifyOTPState.email,
          }
        );
        if (res.data.success) {
          toast.success("Send otp successfully");
        } else {
          toast.error(`${res.data.message}`);
        }
      } catch (error) {
        toast.error(`${error.response.data.message}`);
        console.log("Error occues in sending OTP:", error);
      }
    
  };

  const handleSendOTP = async () => {
    
      try {
        const res = await axios.post("https://oauthapp-8l6w.onrender.com/api/v1/auth/sendOTP", {
    

        // const res = await axios.post(
        //   "http://localhost:8800/api/v1/auth/sendOTP",
        //   {
            email: verifyOTPState.email,
          }
        );
        console.log(res);
        if (res.data.success) {
          setOTPSent(true);
          toast.success(`${res.data.message}`);
        } else {
          toast.error(`${res.data.message}`);
        }
        setOtpFieldVisible(true);
        setVerifyOTPState({
          ...verifyOTPState,
          resendEnabled: true,
        });
      } catch (error) {
        toast.error(`${error.response.data.message}`);
        console.log("Error sending OTP:", error);
      }
    
  };

  const handleVerify = async () => {
   
      try {
        const response = await axios.post(
          "https://oauthapp-8l6w.onrender.com/api/v1/auth/verify",
          // "http://localhost:8800/api/v1/auth/verify",
          {
            otp: verifyOTPState.otp,
            email: verifyOTPState.email,
          }
        );

        if (response.data.success) {
          toast.success(`${response.data.message}`);
          setOpenModal(false); // Close the OTP verification modal
          navigate("/");
        } else {
          toast.error(`${response.data.message}`);
          setErrors({
            ...errors,
            email: "Invalid email or phone format.",
            otp: "Invalid OTP. Please enter a valid OTP.",
          });
        }
      } catch (error) {
        toast.error(`${error.response.data.message}`);
        console.log("Error verifying OTP:", error);
      }
    
  };

  
   const validateEmailFeilds = (formData) => {
      const errors = {};
    
      if (!formData["email"]) {
        errors["email"] = "Email or Phone is required.";
      } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^[0-9]{10}$/; 
    
        if (!emailPattern.test(formData["email"]) && !phonePattern.test(formData["email"])) {
          errors["email"] = "Invalid email or phone format.";
        }
        else{
          errors["email"]="";
        }
      }
    
      return errors;
    };
    
    const validateOtpField = (formData) => {
      const errors = {};
    
      if (!formData["otp"]) {
        errors["otp"] = "OTP is required.";
      } else if (formData["otp"].length !== 6) {
        errors["otp"] = "OTP must be 6 digits.";
      }else{
        errors["otp"]="";
      }
      return errors;
    };
    
    const handleSubmit = (e) => {
      console.log("hey");
      e.preventDefault();
      if (!otpSent) {
      console.log("otpnotsend");

        const ValidateErrors = validateEmailFeilds(verifyOTPState);
        console.log("errosfind",ValidateErrors);
        const len = Object.values(ValidateErrors)
        if (len[0]?.length === 0) {
          console.log("Calling handleSendOTP");
          handleSendOTP();
        } else {
          console.log("Calling not handleSendOTP");
          setErrors(ValidateErrors);
          console.log("errosfind",ValidateErrors);

        }
      } else {
        console.log("otpsend");
        const ValidateErrors = validateOtpField(verifyOTPState);
        const len = Object.values(ValidateErrors)
        if (len[0]?.length === 0) {
          console.log("Calling verify");
          handleVerify();
        }else {
          console.log("Calling not verify");
          setErrors(ValidateErrors);
        }
      }
    };

  const SendOTPSection = ({ verifyOTPState, handleChange }) => (
    <div>
      <label htmlFor="email" className="sr-only">
        Email
      </label>
      <input
        autoFocus="autoFocus"
        onChange={handleChange}
        value={verifyOTPState.email}
        id="email"
        name="email"
        type="text"
        required
        className={fixedInputClass}
        placeholder="Enter email or phone"
      />

      {errors.email && <p className="text-red-500 mt-2">{errors.email}</p>}
      <FormAction hide={false} handleSubmit={handleSubmit} text={"SEND OTP"} />
    </div>
  );

  const VerifyOTPSection = ({ verifyOTPState,handleChange }) => (
    <div>
       <label htmlFor="otp" className="sr-only">
        Otp
      </label>
      <input
        autoFocus="autoFocus"
        onChange={handleChange}
        value={verifyOTPState.otp}
        id="otp"
        name="otp"
        type="tel"
        required
        className={fixedInputClass}
        placeholder="Enter otp"
      />
      {errors.otp && <p className="text-red-500 mt-2">{errors.otp}</p>}
      <FormAction hide={false} handleSubmit={handleSubmit} text={"VERIFY"} />
      {verifyOTPState.resendEnabled && (
        <button
          onClick={handleResendOTP}
          className="text-red-500 font-bold cursor-pointer"
        >
          Resend OTP
        </button>
      )}
    </div>
  );
  const handleCloseModal = () =>{
    setOpenModal(false);
  }
  return (
    <div className="w-screen h-screen bg-black bg-opacity-80 fixed top-0 left-0 flex justify-center items-center">
      <form
        className="bg-white-500 p-20 w-100 h-120 relative overflow-auto space-y-6"   
      >
        <BsBackspaceReverseFill onClick={handleCloseModal}  className="absolute right-20 top-14  rounded-md text-white bg-purple-600 hover:bg-purple-700 cursor-pointer"/>
        {!otpSent ? (
          <SendOTPSection
            handleChange = {handleChange}
            verifyOTPState={verifyOTPState}
          />
        ) : (
          otpFieldVisible && ( // Render OTP field only if otpFieldVisible is true
            <VerifyOTPSection
              handleChange = {handleChange}
              verifyOTPState={verifyOTPState}
              
            />
          )
        )}
      </form>
    </div>
  );
};
export default VerifyOTP;
