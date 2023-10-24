import { useState } from "react";

const fixedInputClass =
  "rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm";

const Input = (props) => {
  const [focused,setFocused] = useState(false);
  const { labelText, labelFor,errorMessage, handleChange,selectedFileProfile,selectedFileResume, ...inputProps } = props;
  

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   setSelectedFile(file);
  //   handleChange(id, file); // Pass the selected file to the parent component
  // };

  const handleFocus =(e)=>{
    setFocused(true);
  }
  
  return (
    <div className="my-5 ">
      <label htmlFor={labelFor} className="sr-only">
        {labelText}
      </label>
      {inputProps.type === 'file' ? (
        <>
         {inputProps.id==='profile'? (<div className="mt-1">
            <input
              type={inputProps.type}
              id={inputProps.id}
              name={inputProps.name}
              accept="image/*"
              onChange={handleChange}
              className="hidden "
            />
            <label
              htmlFor={inputProps.id}
              className="cursor-pointer group relative w-[400px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
            >
              {selectedFileProfile ? `${labelText} Selected` : `Upload ${labelText} `}
            </label>
            {selectedFileProfile && <p className="mt-2 text-white">{selectedFileProfile.name}</p>}
          </div>)
        :
        (  <div >
          <input
            type={inputProps.type}
            id={inputProps.id}
            name={inputProps.name}
            accept='.pdf, .doc, .docx'
            onChange={handleChange}
            className="hidden"
          />
          <label
            htmlFor={inputProps.id}
            className="cursor-pointer group relative w-[400px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
          >
            {selectedFileResume ? `${labelText} Selected` : `Upload ${labelText} `}
          </label>
          {selectedFileResume && <p className="mt-2 text-white">{selectedFileResume.name}</p>}
        </div>)}
      </>
      ) : (
      <input
        onChange={handleChange}
        className={fixedInputClass }
        onBlur={handleFocus}  // click or leave
        onFocus={()=>( inputProps.id === 'confirmPassword' || inputProps.id === 'password') && setFocused(true)}
        focused = {focused.toString()}
        {...inputProps}
       
      />
      )}
      <span className="text-xs mt-1 hidden text-red-500" >{errorMessage}</span>
    </div>
  );
};

export default Input;

