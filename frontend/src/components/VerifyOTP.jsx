import { useState } from "react";
import FormAction from "../components/FormAction";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BsBackspaceReverseFill } from "react-icons/bs";
import Input from "./Input";



const VerifyOTP = ({ setOpenModal }) => {
  const [verifyOTPState, setVerifyOTPState] = useState({
    email: "",
    otp: "",
    resendEnabled: false,
  });

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
      const res = await axios.post(
        "https://oauthapp-8l6w.onrender.com/api/v1/auth/sendOTP",
        {
          // const res = await axios.post(
          //   "http://localhost:8800/api/v1/auth/sendOTP",
          //   {
          email: verifyOTPState.email,
        }
      );
      if (res.data.success) {
        toast.success("Sent OTP successfully");
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
      const res = await axios.post(
        "https://oauthapp-8l6w.onrender.com/api/v1/auth/sendOTP",
        {
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
      }
    } catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log("Error verifying OTP:", error);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const emailPattern =
      /^(?=.{1,256}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
    const validOTP = /^\d{6}$/;
    const isEmailValid =
      emailPattern === "" ||
      new RegExp(emailPattern).test(verifyOTPState.email);

    const isOTPValid =
      validOTP === "" || new RegExp(validOTP).test(verifyOTPState.otp);

    if (!isEmailValid ) {
      console.log("Invalid input. Please check the fields.");
      return;
    }

    if (!otpSent) {
      handleSendOTP();
    } else {

      if (!isOTPValid) {
        console.log("Invalid input. Please check the fields.");
        return;
      }
      handleVerify();
    }
  };

  const SendOTPSection = ({ verifyOTPState, handleChange }) => (
    <div>
      <Input
        autoFocus="autoFocus"
        labelFor="email"
        labelText="Email"
        value={verifyOTPState["email"]}
        onChange={handleChange}
        id="email"
        name="email"
        type="text"
        required={true}
        placeholder="Email or Phone"
        errorMessage="Invalid input. Please enter a valid email address or phone number!"
        pattern="/^(?=.{1,256}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/"
      />

      <FormAction hide={false} handleSubmit={handleSubmit} text={"SEND OTP"} />
    </div>
  );

  const VerifyOTPSection = ({ verifyOTPState, handleChange }) => (
    <div>
      <Input
        autoFocus="autoFocus"
        labelFor="otp"
        labelText="Otp"
        value={verifyOTPState["otp"]}
        onChange={handleChange}
        id="otp"
        name="otp"
        type="tel"
        required={true}
        placeholder="Enter otp"
        errorMessage="It should be a valid 6 digits OTP!"
        pattern="^\d{6}$"
      />

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
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  return (
    <div className="w-screen h-screen bg-black bg-opacity-80 fixed top-0 left-0 flex justify-center items-center">
      <form className="bg-white-500 p-20 w-100 h-120 relative overflow-auto space-y-6">
        <BsBackspaceReverseFill
          onClick={handleCloseModal}
          className="absolute right-20 top-14  rounded-md text-white bg-purple-600 hover:bg-purple-700 cursor-pointer"
        />
        {!otpSent ? (
          <SendOTPSection
            handleChange={handleChange}
            verifyOTPState={verifyOTPState}
          />
        ) : (
          otpFieldVisible && ( // Render OTP field only if otpFieldVisible is true
            <VerifyOTPSection
              handleChange={handleChange}
              verifyOTPState={verifyOTPState}
            />
          )
        )}
      </form>
    </div>
  );
};
export default VerifyOTP;
