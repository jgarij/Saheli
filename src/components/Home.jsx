import React, { useState } from 'react';
import Googlelogin from '../googleOath/Googlelogin'; // Import GoogleLogin component
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false); // State to manage login visibility
  const navigate=useNavigate()
  const handleLogin = () => {
    setShowLogin(true); 
  };

  const handleLoginSuccess = () => {
    navigate('/form'); 
  };
  return (
    <div className="home-container flex flex-col items-center justify-center p-4 bg-gray-100 ">
      <p className="quote text-lg text-center mb-6">
        True friendship is not about finding someone who just understands you, 
        but someone who accepts you for who you are, supports you in your dreams, 
        and makes you feel like you're never alone, no matter where life takes you.
      </p>
      
      {!showLogin ? (
        <button 
          onClick={handleLogin} 
          className="login-btn px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          Login
        </button>
      ) : (
        <Googlelogin onLoginSuccess={handleLoginSuccess} />  
      )}
    </div>
  );
}
