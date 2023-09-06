import Header from "../components/Header";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <>
      <Header
        heading="Login to your account"
        paragraph="Don't have an account yet? "
        linkName="Signup"
        linkUrl="/signup"
      />
      <LoginForm/>
    </>
  );
};

export default LoginPage;
