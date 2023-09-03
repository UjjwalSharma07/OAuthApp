import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import DummyPage from './pages/DummyPage';

function App() {
  
  return (
  <div className="min-h-full h-fit  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full ">
     <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage/>} />
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/dummy" element={<DummyPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  </div>
  );
}

export default App;


