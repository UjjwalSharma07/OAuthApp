import React from 'react'
import axios from 'axios'
import { toast } from "react-toastify";

const Payment = () => {
    const loadScript =(src)=>{
        return new Promise((resolve)=>{
            const script = document.createElement("script");
            script.src = src;
            script.onload =()=>{
                resolve(true);
            }
            script.onerror =()=>{
                resolve(false);
            }
            document.body.appendChild(script);
        })
    }
    const handleClick = async()=>{
        const orderId = "OD"+ Math.floor(Math.random()*Math.floor(Math.random()*Date.now()));
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

        if(!res){
            toast.error("Razorpay SDK failed to load.");
            return;
        }
        const paymentOptions = {
            orderId:orderId,
            amount: 50000,
            currency:"INR",
            payment_capture:1,
        }

        // const response = await axios.post("http://localhost:8800/api/v1/user/payment/create",paymentOptions);
        const response = await axios.post("https://oauthapp-8l6w.onrender.com/api/v1/user/payment/create",paymentOptions);
        
        if(response.data.success){
            toast.success(`${response.data.message}`)
        }

        if(!response.data.data){
            toast.error(`Server error. Data not found.`)
        }else{
            const options = {
                key:"rzp_test_wVSlM3wkV9BJ0N",
                currency:response.data.data.currency,
                amount:  (response.data.data.amount * 100).toString(),
                order_id:response.data.data.id,
                name:"Codeate project",
                description:"Test transaction",
                image:"https://www.codeate.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcodeate.c28c9bc5.png&w=256&q=75",
                // "handler": function (response){
                //     alert(response.razorpay_payment_id);
                //     alert(response.razorpay_order_id);
                //     alert(response.razorpay_signature)
                // },
                prefill:{
                    email:"ujjvalmishra6016@gmail.com",
                    contact:9027394386
                },
                notes:{
                    address:"Razorpay corporate office"
                },
                theme:{
                    color:"#1f5215"
                }
            }
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        }
        console.log("response",response)
    }   
    
  return (
    <div>
      <button onClick={handleClick} className="cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-5 mb-5" >Payment</button>
    </div>
  )
}

export default Payment
