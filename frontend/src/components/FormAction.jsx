import React from "react";
import { FcGoogle } from "react-icons/fc";
import { VscGithubInverted } from "react-icons/vsc";

const FormAction = ({hide ,handleSubmit,handleLoginWithGoogle, handleLoginWithGithub, action = "submit", text }) => {
  return (
    <div className="mb-8">
       <button
        type={action}
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
        onClick={handleSubmit}
      >
        {text}
      </button>
      {hide && <><div className="flex items-center justify-center font-medium text-gray-400 mt-2">
        or
      </div>
      <button
        type="button"
        className="group relative w-full flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-2"
        onClick={handleLoginWithGoogle}
      >
        <span className="mr-2">
          <FcGoogle /> 
        </span>
        Continue with Google
      </button>

      <button
        type="button"
        className=" group relative w-full flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 mt-4"
        onClick={handleLoginWithGithub}
      >
        <span className="mr-2">
          <VscGithubInverted /> 
        </span>
        Continue with Github
      </button></>}
    </div>
  );
};

export default FormAction;
