import React, { useState, useContext } from 'react';
import Googlelogin from '../googleOath/Googlelogin'; 
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../ContextApi/authcontext';

export default function Home() {
  const { curruser } = useContext(AuthContext); 
  const [showLogin, setShowLogin] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = () => {
    setShowLogin(true); 
  };

  const handleLoginSuccess = () => {
    navigate('/form'); 
  };

  const handleMakeFriend = () => {
    navigate('/dashboard'); 
  };

  return (
    <div className="home-container flex flex-col items-center justify-center p-4 bg-gray-100 ">
      <p className="quote text-lg text-center mb-6">
        True friendship is not about finding someone who just understands you, 
        but someone who accepts you for who you are, supports you in your dreams, 
        and makes you feel like you're never alone, no matter where life takes you.
      </p>

      {curruser ? (
        // If user is logged in, show "Make Friend" button
        <button 
          onClick={handleMakeFriend} 
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md"
        >
          Make Friend
        </button>
      ) : (
        // If user is not logged in, show Login button or Google login
        !showLogin ? (
          <button 
            onClick={handleLogin} 
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Login
          </button>
        ) : (
          <Googlelogin onLoginSuccess={handleLoginSuccess} />  
        )
      )}
    </div>
  );
}
