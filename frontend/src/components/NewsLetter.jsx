import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Input from "./Input";

const NewsLetter = () => {
  const [email, setEmail] = useState({ email: "" });
  const [err, setErr] = useState("Invalid input. Please enter a valid email address!");
  const handleChange = (e) => {
    setEmail({
      ...email,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      // const response = await axios.post('http://localhost:8800/api/v1/user/subscribe', email);
      const response = await axios.post('https://oauthapp-8l6w.onrender.com/api/v1/user/subscribe', email);

      if (response.data.success) {
        toast.success(`${response.data.message}`);
        setEmail({email:""});
        setErr("");
      } else {
        toast.error(`${response.data.message}`);
      }
    } catch (error) {
      console.error('Subscription Error:', error);
    }
  };

  return (
    <div className="w-full items-center justify-center bg-blue-900 text-white py-8 ">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-2">Save time, save money!</h1>
        <p className="text-lg mb-4">Sign up and we'll send the best deals to you.</p>
        <form onSubmit={handleEmailSubmit} className="flex flex-col items-center justify-center gap-1">
          <Input
            labelFor="email"
            labelText="Email"
            value={email.email}
            onChange={handleChange}
            id="email"
            name="email"
            type="email"
            required={true}
            className="justify-center  items-center rounded-md appearance-none relative block w-[300px] px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
            placeholder="Your email"
            errorMessage={err}
            pattern="^(?=.{1,256}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}(?:.[a-zA-Z]{2,})?$"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md cursor-pointer hover:bg-blue-700"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewsLetter;
