import React, { useEffect, useState } from "react";
import UserDetails from "../components/UserDetails";
import UserCard from "../components/UserCard";
import { useLocation } from "react-router-dom";
import NoDataFound from "../components/NoDataFound";
import axios from "axios";
import NewsLetter from "../components/NewsLetter";
import Payment from "../components/Payment";

const UserDetailsPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [data,setData] = useState(null);
  // const navigate = useNavigate();
  const location = useLocation();
  const userDetails = location.state?.userDetails || null;
  // console.log("userDetails: ",userDetails);
 
  const userEmail = userDetails ? userDetails.email : null;

  const queryParams = new URLSearchParams(location.search);
  console.log("queryparams",queryParams)
  // Access the query parameters
  const id = queryParams.get('id');
  console.log('id',id)

  const username = queryParams.get('username');
  console.log('username',username)

  const email = queryParams.get('email');
  console.log('email',email)


  useEffect(() => {
    const fetchData = async () => {
      try {
        // const res = await axios.get('http://localhost:8800/api/v1/user/details', {
        const res = await axios.get('https://oauthapp-8l6w.onrender.com/api/v1/user/details', {
          params: {
            email: userEmail || email,
          },
        });
        console.log("fetched data", res);
        if (res.data.success ) {
          setData(res.data.data.data); 
        }
      } catch (error) {
        console.log("Error occurred while fetching userDetails:", error);
      }
    };
  
    if (userEmail || email) {
      fetchData(); 
    }
  }, [userEmail]); 

  return (
    <>
    
    <div className="flex flex-col items-center justify-center ">
      <div className="text-center">
        {/* <span className="text-xl font-semibold mb-14">Hello Codeate Team</span> */}
       {data ? <UserCard data={data}/> : <NoDataFound/>}
				<button className="cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10" type="button" onClick={()=>setOpenModal(true)}>{data?"Edit Details":"Add Details"}</button>
        <form action="https://oauthapp-8l6w.onrender.com/logout" method="post">
						<button className="cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-5" type="submit">Sign out</button>
				</form>
        <Payment/>
        <NewsLetter/>
      </div>
      {openModal && <UserDetails setData={setData} data={data} setOpenModal={setOpenModal}/>}
    </div>
    </>
  );
};

export default UserDetailsPage;
