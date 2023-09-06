import { useState } from "react";

const fixedInputClass =
  "rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm";

const Input = (props) => {
  const [focused,setFocused] = useState(false);
  const { labelText, labelFor,errorMessage, handleChange, ...inputProps } = props;
  
  const handleFocus =(e)=>{
    setFocused(true);
  }
  
  return (
    <div className="my-5 ">
      <label htmlFor={labelFor} className="sr-only">
        {labelText}
      </label>
      <input
        onChange={handleChange}
        className={fixedInputClass }
        onBlur={handleFocus}  // click or leave
        onFocus={()=>( inputProps.id === 'confirmPassword' || inputProps.id === 'password') && setFocused(true)}
        focused = {focused.toString()}
        {...inputProps}
       
      />
      <span className="text-xs mt-2 hidden text-red-500" >{errorMessage}</span>
    </div>
  );
};

export default Input;

