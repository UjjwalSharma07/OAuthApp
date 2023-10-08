import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import UserDetailsPage from './pages/UserDetailsPage';

function App() {
  
  return (
  <div className="min-h-full h-fit  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full ">
     <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage/>} />
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/userDetails" element={<UserDetailsPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  </div>
  );
}

export default App;


