import React from "react";
import Header from "../components/Header";
import SignUpForm from "../components/SignUpForm";

const SignupPage = () => {
  return (
    <>
      <Header
        heading="Signup to create an account"
        paragraph="Already have an account? "
        linkName="Login"
        linkUrl="/"
      />
      <SignUpForm/>
    </>
  );
};

export default SignupPage;

