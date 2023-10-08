import React from 'react'


const NoDataFound = () => {
  return (
    <div className="w-[500px] flex flex-col h-[300px] justify-center items-center  mb-[30px]">
        <p className='font-bold mb-[20px]'>Data Not Available. Please add details.</p>
        <img className='w-[200px] h-[200px] object-cover ' src="no-connection.png" alt="Data not available" />
    </div>
  )
}

export default NoDataFound
