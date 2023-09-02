const fixedInputClass="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"

const Input = ({
    handleChange,
    value,
    labelText,
    labelFor,
    id,
    name,
    type,
    isRequired=false,
    placeholder,
    customClass
}) => {
  return (
    <div className="my-5">
            <label htmlFor={labelFor} className="sr-only">
              {labelText}
            </label>
            <input
              onChange={handleChange}
              value={value}
              id={id}
              name={name}
              type={type}
              required={isRequired}
              className={fixedInputClass+customClass}
              placeholder={placeholder}
            />
          </div>
  )
}

export default Input



// const validateEmailFeilds = (formData) => {
//   const errors = {};

//   if (!formData) {
//     errors.email = "Email or Phone is required.";
//   } else {
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const phonePattern = /^[0-9]{10}$/; 

//     if (!emailPattern.test(formData) && !phonePattern.test(formData)) {
//       errors.email = "Invalid email or phone format.";
//     } else {
//       errors.email = "";
//     }
//   }

//   return errors;
// };

// const validateOtpField = (formData) => {
//   const errors = {};

//   if (!formData) {
//     errors.otp = "OTP is required.";
//   } else if (formData.length !== 6) {
//     errors.otp = "OTP must be 6 digits.";
//   } else {
//     errors.otp = ""; 
//   }

//   return errors;
// };

// const handleSubmit = (e) => {
//   e.preventDefault();
//   if (!otpSent) {
//     const ValidateErrors = validateEmailFeilds(verifyOTPState.email);
//     if (Object.keys(ValidateErrors).length === 0) {
//       handleSendOTP();
//     } else {
//       setErrors(ValidateErrors);
//     }
//   } else {
//     const ValidateErrors = validateOtpField(verifyOTPState.otp);
//     if (Object.keys(ValidateErrors).length === 0) {
//       handleVerify();
//     }else {
//       setErrors(ValidateErrors);
//     }
//   }
// };