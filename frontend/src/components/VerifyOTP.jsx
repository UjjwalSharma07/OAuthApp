import { useState } from "react";
import { verifyOTPFields } from "../constants/FormFields"; 
import FormAction from "../components/FormAction";
import Input from "../components/Input";
import axios from "axios";
import {useNavigate} from "react-router-dom"
import { toast } from "react-toastify";

const fields = verifyOTPFields;

const VerifyOTP = ({setOpenModal}) => {
  const [verifyOTPState, setVerifyOTPState] = useState({
    resendEnabled: false,
  });
  const [errors, setErrors] = useState({});
  const [otpSent, setOTPSent] = useState(false);
  const [otpFieldVisible, setOtpFieldVisible] = useState(false); 
  const navigate = useNavigate();
  

  const handleChange = (e) => {
    setVerifyOTPState({ ...verifyOTPState, [e.target.id]: e.target.value });
  };

const handleResendOTP = async () => {
  try {
   
    const res =  await axios.post("https://oauthbackend-qp0c.onrender.com/api/v1/auth/sendOTP", {
      email: verifyOTPState.email,
    });
    if(res.data.success){
      toast.success("Resend otp successfully")
    }
    else{
      toast.error(`${res.data.message}`)
    }
  } catch (error) {
    toast.error(`${error.response.data.message}`)
    console.log("Error resending OTP:", error);
  }
};

const handleSendOTP = async () => {
  try {
   
    const res = await axios.post("https://oauthbackend-qp0c.onrender.com/api/v1/auth/sendOTP", {
      email: verifyOTPState.email, 
    });
    console.log(res);
    if(res.data.success){
      setOTPSent(true);
      toast.success(`${res.data.message}`)
    }
    else{
      toast.error(`${res.data.message}`)
    }
    setOtpFieldVisible(true);
    setVerifyOTPState({
      ...verifyOTPState,
      resendEnabled: true, 
    });
  } catch (error) {
    toast.error(`${error.response.data.message}`)
    console.log("Error sending OTP:", error);
  }
};

const handleVerify = async () => {
  try {
   
    const response = await axios.post(
      "https://oauthbackend-qp0c.onrender.com/api/v1/auth/verify",
      {
        otp: verifyOTPState.otp,
        email: verifyOTPState.email, 
      }
    );

    if (response.data.success) {
      toast.success(`${response.data.message}`)
      setOpenModal(false); // Close the OTP verification modal
      navigate('/')
    } else {
      toast.error(`${response.data.message}`)
      setErrors({
        ...errors,
        otp: "Invalid OTP. Please enter a valid OTP.",
      });
    }
  } catch (error) {
    toast.error(`${error.response.data.message}`)
    console.log("Error verifying OTP:", error);
  }
};



const handleSubmit = (e) => {
  e.preventDefault();
  if (!otpSent) {
    handleSendOTP();
  } else {
    handleVerify();
  }
};

const SendOTPSection = ({ verifyOTPState, handleChange, handleSendOTP }) => (
  <div>
    {fields.map((field) => (
      <div key={field.id} className="mb-4">
        <Input
          handleChange={handleChange}
          value={verifyOTPState[field.id]}
          labelText={field.labelText}
          labelFor={field.labelFor}
          id={field.id}
          name={field.name}
          type={field.type}
          isRequired={field.isRequired}
          placeholder={field.placeholder}
        />
      </div>
    ))}
    <FormAction
      hide={false}
      handleSubmit={handleSendOTP}
      text={"SEND OTP"}
    />
    
  </div>
);

const VerifyOTPSection = ({ verifyOTPState, handleChange, handleSubmit, errors }) => (
  <div>
    <Input
      handleChange={handleChange}
      value={verifyOTPState.otp}
      labelText="OTP"
      labelFor="otp"
      id="otp"
      name="otp"
      type="text"
      isRequired={true}
      placeholder="Enter OTP"
    />
    {errors.otp && (
      <p className="text-red-500 mt-2">{errors.otp}</p>
    )}
    <FormAction
      hide={false}
      handleSubmit={handleSubmit}
      text={"VERIFY"}
    />
    {verifyOTPState.resendEnabled && (
      <button onClick={handleResendOTP} className="text-blue-500 cursor-pointer">
        Resend OTP
      </button>
    )}
  </div>
);

  return (
    <div className="w-screen h-screen bg-black bg-opacity-80 fixed top-0 left-0 flex justify-center items-center">
      <form
        className="bg-white-500 p-20 w-100 h-120 relative overflow-auto space-y-6"
        onSubmit={handleSubmit}
      >
         {!otpSent ? (
          <SendOTPSection
            verifyOTPState={verifyOTPState}
            handleChange={handleChange}
            handleSendOTP={handleSendOTP}
          />
        ) : (
          otpFieldVisible && ( // Render OTP field only if otpFieldVisible is true
            <VerifyOTPSection
              verifyOTPState={verifyOTPState}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              errors={errors}
            />
          )
        )}
      </form>
    </div>
  );
};
export default VerifyOTP;
