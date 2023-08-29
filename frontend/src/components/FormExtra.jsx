import React from 'react'


const FormExtra = ({setOpenModal}) => {
  const handleClick =()=>{
    setOpenModal(true);
  }
  return (
    <div className="flex items-center justify-end ">
        

        <div onClick={handleClick} className="text-sm">
          <span className="cursor-pointer font-medium pointer text-purple-600 hover:text-purple-500">
            Forgot your password?
          </span>
          
        </div>
      </div>
  )
}

export default FormExtra
